import { useState } from 'react';
import { TiDeleteOutline } from 'react-icons/ti';
import { useDispatch } from 'react-redux';
import Select from 'react-select';
import Swal from 'sweetalert2';

import {
  handleAddItemBillOfMaterial,
  handleDeleteItemBillOfMaterialNode,
  initialStateBillOfMaterialObject,
} from '@/store/inventory/bill_of_material';

import { useGetAllItemForDropdown } from '@/app/api/hooks/inventory/items/item/useGetAllItemForDropdown';
import { generateUniqueFourDigitNumber } from '@/helpers/utils/inventory/bill_of_materials';
interface ItemMaterialProps {
  item_detail_pkid: number;
  quantity: number;
  unique_parent: number;
  name: string;
  item_code: string;
  depth: number;
  isReadOnly?: boolean;
}
interface OptionSelect {
  pkid: string | number;
  name: string | number;
  number: string | number;
  code: string;
}
interface SelectedOption {
  value: string | number | null | undefined;
  label: string | number;
  item_name?: string;
  code?: string;
}

const ItemMaterialComponent = ({
  item_detail_pkid,
  quantity,
  unique_parent,
  name,
  item_code,
  depth,
  isReadOnly = false,
}: ItemMaterialProps) => {
  const dispatch = useDispatch();
  const { data: listItem } = useGetAllItemForDropdown();
  const [emptyField, setEmptyField] = useState([] as string[]);
  const [form, setForm] = useState(initialStateBillOfMaterialObject);
  const handleOnChange = (
    value: string | number | null,
    key: string,
    item_name?: string,
    code?: string,
  ) => {
    setForm(prevForm => ({
      ...prevForm,
      [key]: value,
      ...(key === 'item_detail_pkid' && {
        name: item_name || '',
        item_code: code || '',
        level: depth + 1,
      }),
    }));
  };
  const itemCategoryColor = (code: string) => {
    if (code.includes('IEP')) {
      return 'bg-blue-400';
    } else if (code.includes('IRM')) {
      return 'bg-green-400';
    } else if (code.includes('IMG')) {
      return 'bg-yellow-400';
    }
  };
  const mandatoryValidation = () => {
    const temp = { ...form };
    const requiredField = [] as string[];
    const excludeItemField = [
      'created_by',
      'created_date',
      'created_host',
      'updated_by',
      'updated_date',
      'updated_host',
      'is_deleted',
      'deleted_by',
      'deleted_date',
      'deleted_host',
      'pkid',
      'childBomDetails',
      'unique_parent',
      'level',
      'wastage_percentage',
      'notes',
    ];
    const requiredData = Object.keys(temp).filter(
      data => !excludeItemField.includes(data),
    );

    requiredData.forEach(field => {
      if (
        temp[field as keyof typeof temp] === null ||
        temp[field as keyof typeof temp] === 0 ||
        temp[field as keyof typeof temp] === undefined
      ) {
        requiredField.push(field);
      }
    });

    if (requiredField.length > 0) {
      setEmptyField(requiredField);
      return false;
    }

    return true;
  };
  const handleAddItem = async () => {
    const isMandatoryEmpty = mandatoryValidation();
    if (!isMandatoryEmpty) {
      await Swal.fire({
        title: 'Some Field is Empty',
        text: 'Please fill all mandatory field',
        icon: 'error',
        confirmButtonText: 'Close',
      });
    } else {
      const result = dispatch(
        handleAddItemBillOfMaterial({
          parentId: unique_parent,
          newItem: { ...form, unique_parent: generateUniqueFourDigitNumber() },
        }),
      );
      if (result.payload) {
        await Swal.fire({
          title: 'Item Added',
          text: 'Item has been added to the list',
          icon: 'success',
          confirmButtonText: 'Close',
        });
      }
      setForm(initialStateBillOfMaterialObject);
    }
  };

  const handleDeleteItem = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Save it!',
      cancelButtonText: 'No, cancel!',
    }).then(result => {
      if (result.isConfirmed) {
        dispatch(handleDeleteItemBillOfMaterialNode(unique_parent));
        Swal.fire('Deleted!', 'Item has been deleted.', 'success');
      }
    });
  };
  return (
    <div className='flex flex-col space-y-2'>
      <div
        className={`flex w-fit flex-col rounded-md ${itemCategoryColor(
          item_code,
        )} p-2`}
      >
        <div className='flex flex-row'>
          <span className='font-bold'>Item Name / Depth : &nbsp;</span>
          <span>
            {name} / Level {depth} {item_detail_pkid}
          </span>
        </div>
        <div className='flex justify-between'>
          <div className='flex flex-row'>
            <span className='font-bold'>Item Quantity : &nbsp;</span>
            <span>{quantity}</span>
          </div>
          <div>
            {!isReadOnly && (
              <button
                onClick={handleDeleteItem}
                className='mt-1 rounded-full bg-red-400'
              >
                <TiDeleteOutline size={16} color='white' />
              </button>
            )}
          </div>
        </div>
      </div>
      {!item_code.includes('IRM') && (
        <div className='flex flex-row'>
          {!isReadOnly && (
            <>
              <div className='mr-2 h-[100px] w-[100px] flex-shrink-0 rounded-md bg-slate-400' />
              <div className='flex flex-col space-y-2 border-2 border-dashed p-2'>
                <Select
                  id='item_detail_pkid'
                  placeholder='Choose Item'
                  options={listItem?.map((item: OptionSelect) => ({
                    value: item.pkid,
                    label: item.name,
                    item_name: item.name,
                    code: item.code,
                  }))}
                  isSearchable={true}
                  isClearable={true}
                  className='basic-single'
                  onChange={(selectedOption: SelectedOption | null) =>
                    handleOnChange(
                      selectedOption?.value || null,
                      'item_detail_pkid',
                      selectedOption?.item_name || '',
                      selectedOption?.code || '',
                    )
                  }
                  value={
                    form.item_detail_pkid
                      ? {
                          value: form.item_detail_pkid ?? '',
                          label:
                            listItem?.find(
                              (item: OptionSelect) =>
                                item.pkid === form.item_detail_pkid,
                            )?.name ?? '',
                        }
                      : null
                  }
                  menuPortalTarget={document.body}
                  styles={{
                    control: provided => ({
                      ...provided,
                      borderColor: emptyField.includes('item_detail_pkid')
                        ? 'red'
                        : '',
                      zIndex: 9999,
                    }),
                    menuPortal: provided => ({
                      ...provided,
                      zIndex: 9999,
                    }),
                  }}
                />
                <div className='flex flex-row space-x-2'>
                  <input
                    type='number'
                    className='form-input'
                    placeholder='Quantity'
                    value={form.quantity}
                    onChange={e => handleOnChange(e.target.value, 'quantity')}
                    style={{
                      borderColor: emptyField.includes('quantity') ? 'red' : '',
                    }}
                  />
                  <button
                    className='btn btn-primary ltr:ml-4 rtl:mr-4'
                    onClick={handleAddItem}
                  >
                    Choose
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ItemMaterialComponent;
