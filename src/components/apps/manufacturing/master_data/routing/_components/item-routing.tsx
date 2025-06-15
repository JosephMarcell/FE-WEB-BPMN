import Select from 'react-select';

import { useGetAllOperation } from '@/app/api/hooks/manufacturing/operation/useGetAllOperation';

interface ItemRoutingProperty {
  name: string | null;
  order: number | null;
  operation_pkid: number | null;
  handleDelete: () => void;
  handleOnChange: (
    value: string | number | boolean | Date | null,
    key: string,
    index: number,
  ) => void;
  index: number;
}
interface OptionSelect {
  pkid: string | number;
  name: string | number;
}

const ItemRoutingComponent = ({
  name,
  order,
  operation_pkid,
  handleDelete,
  handleOnChange,
  index,
}: ItemRoutingProperty) => {
  const { data: listOperation } = useGetAllOperation();

  return (
    <div className='grid grid-cols-1 gap-4'>
      <div className='flex items-center'>
        <label htmlFor={`order-${index}`} className='w-1/6 pr-2 text-left'>
          Order ke -
        </label>
        <input
          id={`order-${index}`}
          name={`order-${index}`}
          type='text'
          placeholder='Order ke'
          className='form-input w-20'
          onChange={e => handleOnChange(e.target.value, 'order', index)}
          value={order || ''}
        />
        <label htmlFor={`name-${index}`} className='w-1/6 pl-4 pr-2 text-left'>
          Nama Routing
        </label>
        <input
          id={`name-${index}`}
          name={`name-${index}`}
          type='text'
          placeholder='Nama Routing'
          className='form-input w-1/3'
          onChange={e => handleOnChange(e.target.value, 'name', index)}
          value={name || ''}
        />
        <label
          htmlFor={`operation_pkid-${index}`}
          className='w-1/6 pl-4 pr-2 text-left'
        >
          Pilih Operasi
        </label>
        <Select
          id={`operation_pkid-${index}`}
          name={`operation_pkid-${index}`}
          placeholder='Pilih Operatoin'
          className='basic-single w-1/3'
          options={listOperation?.map((item: OptionSelect) => ({
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
            operation_pkid
              ? {
                  value: operation_pkid,
                  label:
                    listOperation?.find(
                      (item: OptionSelect) => item.pkid === operation_pkid,
                    )?.name ?? '',
                }
              : null
          }
          onChange={selectedOption =>
            handleOnChange(
              selectedOption?.value ?? null,
              'operation_pkid',
              index,
            )
          }
        />
        <div className='ml-2'>
          <button
            type='button'
            className='btn btn-danger'
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemRoutingComponent;
