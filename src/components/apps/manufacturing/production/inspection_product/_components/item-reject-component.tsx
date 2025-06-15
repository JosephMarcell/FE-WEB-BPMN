import { MdDeleteOutline } from 'react-icons/md';
import Select from 'react-select';

import { useGetAllItemForDropdownByCategory } from '@/app/api/hooks/inventory/items/item/useGetAllItemForDropdownByCategory';
interface ItemRoutingProperty {
  quantity: number | null;
  item_pkid: number | null;
  handleDelete?: () => void;
  handleOnChange?: (
    value: string | number | boolean | Date | null,
    key: string,
    index: number,
  ) => void;
  index: number;
  length: number;
}
interface OptionSelect {
  pkid: string | number;
  name: string | number;
}

const ItemRejectDataComponent = ({
  quantity,
  item_pkid,
  handleDelete,
  handleOnChange,
  index,
  length,
}: ItemRoutingProperty) => {
  const { data: listItem } = useGetAllItemForDropdownByCategory(8);

  return (
    <div className='grid grid-cols-1 gap-4'>
      <div className='flex items-center'>
        <label htmlFor={`order-${index}`} className='w-1/6  text-left'>
          Item Name
        </label>
        <Select
          id={`item_pkid-${index}`}
          name={`item_pkid-${index}`}
          placeholder='Choose Item'
          className='basic-single w-1/3'
          options={listItem?.map((item: OptionSelect) => ({
            value: item.pkid,
            label: item.name,
          }))}
          isSearchable={true}
          isClearable={true}
          maxMenuHeight={150}
          menuPlacement='top'
          styles={{
            menu: provided => ({
              ...provided,
              zIndex: 9999,
            }),
          }}
          value={
            item_pkid
              ? {
                  value: item_pkid,
                  label:
                    listItem?.find(
                      (item: OptionSelect) => item.pkid === item_pkid,
                    )?.name ?? '',
                }
              : null
          }
          onChange={selectedOption =>
            handleOnChange &&
            handleOnChange(selectedOption?.value ?? null, 'item_pkid', index)
          }
        />
        <label
          htmlFor={`quantity-${index}`}
          className='w-1/6 pl-4 pr-2 text-left'
        >
          Quantity
        </label>
        <input
          id={`quantity-${index}`}
          name={`quantity-${index}`}
          type='text'
          placeholder='Quantity'
          className='form-input w-1/3'
          onChange={e =>
            handleOnChange && handleOnChange(e.target.value, 'quantity', index)
          }
          value={quantity || ''}
        />
        <div className='ml-2'>
          <button
            type='button'
            className='btn btn-danger'
            onClick={handleDelete}
            disabled={length === 1}
          >
            <MdDeleteOutline />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemRejectDataComponent;
