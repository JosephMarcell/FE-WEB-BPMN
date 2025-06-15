import Select from 'react-select';

import Timeline from '@/components/apps/manufacturing/master_data/routing/_components/timeline';

import { useGetAllItems } from '@/app/api/hooks/inventory/items/useCRUDItem';
import { RoutingProperty } from '@/helpers/utils/manufacturing/routing';

interface RoutingDetail {
  data: RoutingProperty[];
}
interface OptionSelect {
  pkid: string | number;
  name: string | number;
  description?: string | number;
  skill?: string | number;
}
const RoutingDetailComponent = ({ data }: RoutingDetail) => {
  const { data: listItem } = useGetAllItems();
  return (
    <div className='panel border-white-light h-full px-0'>
      <div className='p-5'>
        <div className='space-y-5'>
          <div>
            <label htmlFor='item_pkid'>
              Pilih Item<span style={{ color: 'red' }}>*</span>
            </label>
            <Select
              id='item_pkid'
              name='item_pkid'
              placeholder='Pilih Item'
              className='basic-single'
              options={listItem?.map((item: OptionSelect) => ({
                value: item.pkid,
                label: item.name,
              }))}
              isSearchable={true}
              isClearable={true}
              maxMenuHeight={150}
              menuPlacement='top'
              isDisabled
              value={
                data[0].item_pkid
                  ? {
                      value: data[0].item_pkid ?? '',
                      label:
                        listItem?.find(
                          (item: OptionSelect) =>
                            item.pkid === data[0].item_pkid,
                        )?.name ?? '',
                    }
                  : null
              }
            />
          </div>
          <div className='flex justify-center border-2 border-dashed'>
            <Timeline data={data} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoutingDetailComponent;
