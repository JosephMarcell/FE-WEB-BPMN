// inventoryLocationInitialState,

import { useEffect, useState } from 'react';
import Select, { SingleValue, StylesConfig } from 'react-select';

// import { useGetAllWarehouse } from '@/app/api/hooks/inventory/master_data/warehouse/useGetAllWarehouse';
import { useGetAllDropdownWarehouse } from '@/app/api/hooks/inventory/storage/useGetAllDropdownWarehouse';
import { InventoryLocationProperty } from '@/helpers/utils/inventory/inventory_location';

interface SelectOptionProperty {
  value: string;
  label: string;
}

interface ISelectLocation {
  location: SingleValue<InventoryLocationProperty>;
  handleChangeLocation: (
    location_pkid: number,
    locations: InventoryLocationProperty[],
  ) => void;
}

const SelectLocation = ({ handleChangeLocation }: ISelectLocation) => {
  const {
    data: listLocations,
    isError,
    isLoading,
  } = useGetAllDropdownWarehouse();
  const [allLocation, setAllLocation] = useState<SelectOptionProperty[]>([]);

  useEffect(() => {
    if (listLocations) {
      const tempAllLocation: SelectOptionProperty[] = listLocations.map(
        (location: InventoryLocationProperty) => ({
          value: location.pkid.toString(),
          label: location.name,
        }),
      );
      setAllLocation(tempAllLocation);
    }
  }, [listLocations]);

  const customStyles: StylesConfig<SelectOptionProperty, false> = {
    menu: provided => ({ ...provided, zIndex: 1000 }),
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading data</div>;

  return (
    <Select
      className='w-[250px]'
      options={allLocation}
      defaultValue={allLocation[0] as SingleValue<SelectOptionProperty>}
      onChange={selectedLocation =>
        handleChangeLocation(
          parseInt(selectedLocation?.value || '0'),
          listLocations || [],
        )
      }
      styles={customStyles}
    />
  );
};

export default SelectLocation;
