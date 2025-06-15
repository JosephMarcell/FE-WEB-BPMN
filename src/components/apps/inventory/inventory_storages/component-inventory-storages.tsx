'use client';

import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import SelectLocation from '@/components/apps/inventory/inventory_storages/_components/select-location';
import InventoryTable from '@/components/apps/inventory/inventory_storages/_components/storages-table';

import {
  useGetAllItemInventories,
  useGetAllItemsPerInventory,
  // useGetAllLocations,
} from '@/app/api/hooks/inventory/inventory/useGetAllInventories';
import {
  inventoryLocationInitialState,
  InventoryLocationProperty,
} from '@/helpers/utils/inventory/inventory_location';

const ComponentsInventoryStorages = () => {
  const pathname = usePathname();
  const [location, setLocation] = React.useState<InventoryLocationProperty>(
    inventoryLocationInitialState,
  );
  const {
    data: listItemInventories,
    isLoading,
    refetch,
  } = useGetAllItemInventories();
  // const { data: listLocations } = useGetAllLocations();
  const { refetch: refetchPerInventory } = useGetAllItemsPerInventory(
    location?.pkid || 0,
  );
  const [allLocations, setAllLocation] = useState<InventoryLocationProperty[]>(
    [],
  );

  const handleChangeLocation = (
    location_pkid: number,
    locations: InventoryLocationProperty[],
  ) => {
    if (!locations) return;

    const selectedLocation = locations.find(
      location => location.pkid == location_pkid,
    );
    if (location_pkid != 0) {
      refetchPerInventory;
    }
    setLocation(selectedLocation || inventoryLocationInitialState);
  };

  useEffect(() => {
    setAllLocation(listItemInventories || []);
  }, [listItemInventories]);

  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <SelectLocation
        location={location}
        handleChangeLocation={(location_pkid, locations) =>
          handleChangeLocation(location_pkid, locations)
        }
      />
      <div className='relative flex h-full flex-col sm:h-[calc(100vh_-_150px)]'>
        <InventoryTable
          data={allLocations}
          isLoading={isLoading}
          refetch={refetch}
        />
      </div>
    </div>
  );
};

export default ComponentsInventoryStorages;
