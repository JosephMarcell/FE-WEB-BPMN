// import deleteBaseAttributes from '@/hooks/deleteBaseAttribute';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import Flatpickr from 'react-flatpickr';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import Swal from 'sweetalert2';

import ItemMaterialComponent from '@/components/apps/inventory/other/bill_of_materials/_components/item-material-component';
import IconX from '@/components/icon/icon-x';

import { IRootState } from '@/store';
import {
  BillOfMaterialObject,
  handleAddItemParent,
  handleClearBillOfMaterial,
  handleSetBillOfMaterial,
} from '@/store/inventory/bill_of_material/';

import { useCreateBillOfMaterial } from '@/app/api/hooks/inventory/bill_of_material/useCreateBillOfMaterial';
import { useGetBillOfMaterialByPkid } from '@/app/api/hooks/inventory/bill_of_material/useGetBillOfMaterialByPkid';
import { useUpdateBillOfMaterial } from '@/app/api/hooks/inventory/bill_of_material/useUpdateBillOfMaterial';
import { useGetAllItemForDropdownByCategory } from '@/app/api/hooks/inventory/items/item/useGetAllItemForDropdownByCategory';
import {
  generateUniqueFourDigitNumber,
  initialStateBillOfMaterial,
} from '@/helpers/utils/inventory/bill_of_materials';
import { inventoryReceiveItemInitialState } from '@/helpers/utils/inventory/inventory_receive_item';

interface IModalBillOfMaterialProps {
  modal: boolean;
  modalEdit: boolean;
  setModal: (value: boolean) => void;
  setModalEdit: (value: boolean) => void;
  refetch: () => void;
}
interface OptionSelect {
  pkid: string | number;
  name: string | number;
  number: string | number;
  code: string;
}
interface SelectedOption {
  value: string | number | null | undefined;
  label: string;
  code: string;
}
const lineComponent = () => {
  return (
    <div className='flex w-[100px] flex-col items-center bg-slate-400'></div>
  );
};
const renderTree = (node: BillOfMaterialObject, depth = 0) => {
  return (
    <div key={`${node.item_detail_pkid}`} style={{ marginTop: '8px' }}>
      <ItemMaterialComponent
        item_detail_pkid={node.item_detail_pkid}
        name={node.item_name}
        quantity={node.quantity}
        unique_parent={node.unique_parent}
        item_code={node.item_code}
        depth={depth}
      />

      {node.childBomDetails && node.childBomDetails.length > 0 && (
        <div className='flex gap-2'>
          {lineComponent()}
          <div style={{ marginLeft: '0px' }}>
            {node.childBomDetails.map(child => renderTree(child, depth + 1))}
          </div>
        </div>
      )}
    </div>
  );
};

const ModalBillOfMaterial = ({
  modal,
  modalEdit,
  setModal,
  setModalEdit,
  refetch,
}: IModalBillOfMaterialProps) => {
  const dispatch = useDispatch();
  const pkid = useSelector((state: IRootState) => state.themeConfig.pkid);
  const isRtl =
    useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';
  const tree = useSelector((state: IRootState) => state.billOfMaterial.tree);
  const { data: listEndProducts } = useGetAllItemForDropdownByCategory(1);
  const { mutateAsync: createBillOfMaterial } = useCreateBillOfMaterial();
  const { mutateAsync: updateBillOfMaterial } = useUpdateBillOfMaterial();
  const [form, setForm] = useState(initialStateBillOfMaterial);
  const [emptyField, setEmptyField] = useState([] as string[]);
  const [enabled, setEnabled] = useState(false);

  const [selectedItem, setSelectedItem] = useState<{
    name: string;
    code: string;
  }>({ name: '', code: '' });
  const [openCanvas, setOpenCanvas] = useState(false);

  const {
    data: bomDetailData,
    isLoading,
    refetch: refetchDetail,
  } = useGetBillOfMaterialByPkid(pkid, enabled);

  useEffect(() => {
    if (pkid && modalEdit && !isLoading) {
      setEnabled(true);
      refetchDetail();
    }
  }, [pkid, modalEdit, isLoading, refetchDetail]);

  useEffect(() => {
    if (bomDetailData && modalEdit) {
      setForm(bomDetailData);
      setOpenCanvas(true);
      dispatch(
        handleSetBillOfMaterial({
          item_detail_pkid: bomDetailData.item_header_pkid,
          item_name: bomDetailData?.itemHeader?.name,
          quantity: bomDetailData.production_quantity,
          unique_parent: 1,
          item_code: bomDetailData?.itemHeader?.code,
          level: 0,
          childBomDetails: bomDetailData.bomDetails,
        }),
      );
    }
  }, [bomDetailData, modalEdit, dispatch]);

  const handleAddItemBillOfMaterial = async () => {
    if (!form.item_header_pkid && !form.production_quantity) {
      await Swal.fire({
        title: 'Some Field is Empty',
        text: 'Please fill all mandatory field',
        icon: 'error',
        confirmButtonText: 'Close',
      });
    } else {
      dispatch(
        handleAddItemParent({
          item_detail_pkid: form.item_header_pkid ?? 0,
          item_name: selectedItem.name,
          quantity: form.production_quantity ?? 0,
          unique_parent: generateUniqueFourDigitNumber(),
          item_code: selectedItem.code,
          level: 0,
          childBomDetails: [],
        }),
      );
      setOpenCanvas(true);
    }
  };

  const handleClearItemBillOfMaterial = () => {
    dispatch(handleClearBillOfMaterial());
    setOpenCanvas(false);
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
      'effective_date',
      'expiration_date',
      'status',
      'description',
      'code',
      'total_cost',
      'unique_parent',
      'tenant_id',
      'item_code',
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
  const handleSubmit = async () => {
    const isMandatoryEmpty = mandatoryValidation();

    if (!isMandatoryEmpty) {
      await Swal.fire({
        title: 'Some Field is Empty',
        text: 'Please fill all mandatory field',
        icon: 'error',
        confirmButtonText: 'Close',
      });
    } else {
      Swal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to revert this!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Save it!',
        cancelButtonText: 'No, cancel!',
      }).then(async result => {
        if (result.isConfirmed) {
          try {
            if (modalEdit) {
              const tempForm = { ...form, bomDetails: tree.childBomDetails };

              await updateBillOfMaterial({
                pkid: pkid,
                data: tempForm,
              });
              setModalEdit(false);
            }
            if (modal) {
              const inputForm = { ...form, bomDetails: tree.childBomDetails };
              await createBillOfMaterial(inputForm);
              setModal(false);
            }
            setForm(initialStateBillOfMaterial);
            setEmptyField([]);
            Swal.fire('Saved!', 'Your asset has been saved.', 'success').then(
              () => {
                refetch();
              },
            );
          } catch (error) {
            await Swal.fire('Error!', 'Something went wrong', 'error');
          }
        }
      });
    }
  };
  const handleOnChange = (
    value: string | number | boolean | Date | null,
    key: string,
    name?: string,
    code?: string,
  ) => {
    if (key.includes('date') && value instanceof Date) {
      const date = new Date(value.toString());
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');

      value = `${year}-${month}-${day}`;
    }
    if (key === 'item_header_pkid') {
      setSelectedItem({ name: name ?? '', code: code ?? '' });
      handleClearItemBillOfMaterial();
    }
    setForm({ ...form, [key]: value });
  };
  const handleCancel = () => {
    if (
      JSON.stringify(form) === JSON.stringify(inventoryReceiveItemInitialState)
    ) {
      if (modalEdit) {
        setModalEdit(false);
      }
      if (modal) {
        setModal(false);
      }
      setForm(initialStateBillOfMaterial);
      setEmptyField([]);
      dispatch(handleClearBillOfMaterial());
    } else {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Your data will not be saved!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Discard it!',
        cancelButtonText: 'No, cancel!',
      }).then(async result => {
        if (result.isConfirmed) {
          try {
            if (modalEdit) {
              setModalEdit(false);
            }
            if (modal) {
              setModal(false);
            }
            setForm(initialStateBillOfMaterial);
            setEmptyField([]);
            dispatch(handleClearBillOfMaterial());
            setOpenCanvas(false);
          } catch (error) {
            await Swal.fire('Error!', 'Something went wrong', 'error');
          }
        }
      });
    }
  };
  const handleClose = () => {
    if (modalEdit) {
      setModalEdit(false);
      setForm(initialStateBillOfMaterial);
      setOpenCanvas(false);
      dispatch(handleClearBillOfMaterial());
    }
    if (modal) {
      setModal(false);
    }
  };
  return (
    <div>
      <Transition appear show={modal || modalEdit} as={Fragment}>
        <Dialog
          as='div'
          open={modal || modalEdit}
          onClose={() => {
            if (modalEdit) {
              setModalEdit(true);
            }
            if (modal) {
              setModal(true);
            }
          }}
        >
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0' />
          </Transition.Child>
          <div
            id='slideIn_down_modal'
            className='fixed inset-0 z-[998] overflow-y-auto bg-[black]/60'
          >
            <div className='flex min-h-screen items-start justify-center px-4'>
              <Dialog.Panel className='panel animate__animated animate__slideInDown dark:text-white-dark my-8 w-full max-w-6xl overflow-hidden rounded-lg border-0 p-0 text-black'>
                <div className='flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]'>
                  <h5 className='text-lg font-bold'>
                    {modal ? 'New' : 'Edit'} Bill Of Material
                  </h5>
                  <button
                    onClick={handleClose}
                    type='button'
                    className='text-white-dark hover:text-dark'
                  >
                    <IconX />
                  </button>
                </div>
                <div className='p-5'>
                  <div className='space-y-5'>
                    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                      <div>
                        <label>
                          Item Name
                          <span style={{ color: 'red' }}>*</span>
                        </label>
                        <Select
                          id='item_header_pkid'
                          name='item_header_pkid'
                          placeholder='Pilih Item'
                          className='basic-single'
                          options={listEndProducts?.map(
                            (item: OptionSelect) => ({
                              value: item.pkid,
                              label: item.name,
                              code: item.code,
                            }),
                          )}
                          isSearchable={true}
                          isClearable={true}
                          maxMenuHeight={150}
                          menuPlacement='top'
                          styles={{
                            menu: provided => ({
                              ...provided,
                              zIndex: 9999, // Set a high z-index value
                            }),
                            control: provided => ({
                              ...provided,
                              borderColor: emptyField.includes(
                                'item_header_pkid',
                              )
                                ? 'red'
                                : '',
                            }),
                          }}
                          onChange={(selectedOption: SelectedOption | null) =>
                            handleOnChange(
                              selectedOption?.value || '',
                              'item_header_pkid',
                              selectedOption?.label || '',
                              selectedOption?.code || '',
                            )
                          }
                          value={
                            form.item_header_pkid
                              ? {
                                  value: form.item_header_pkid ?? '',
                                  label:
                                    (listEndProducts &&
                                      listEndProducts?.find(
                                        (item: { pkid: number }) =>
                                          item.pkid === form.item_header_pkid,
                                      )?.name) ??
                                    '',
                                  code:
                                    (listEndProducts &&
                                      listEndProducts?.find(
                                        (item: { pkid: number }) =>
                                          item.pkid === form.item_header_pkid,
                                      )?.code) ??
                                    '',
                                }
                              : null
                          }
                        />
                      </div>
                      <div>
                        <label htmlFor='production_quantity'>
                          Quantity <span style={{ color: 'red' }}>*</span>
                        </label>
                        <input
                          id='production_quantity'
                          name='production_quantity'
                          type='text'
                          placeholder='Quantity Produced '
                          className='form-input'
                          onChange={e =>
                            handleOnChange(
                              String(e.target.value),
                              'production_quantity',
                            )
                          }
                          value={form.production_quantity || ''}
                          style={{
                            borderColor: emptyField.includes(
                              'production_quantity',
                            )
                              ? 'red'
                              : '',
                          }}
                        />
                      </div>
                    </div>
                    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                      <div>
                        <label>
                          Effective Date
                          <span style={{ color: 'red' }}>*</span>
                        </label>
                        <Flatpickr
                          id='effective_date'
                          name='effective_date'
                          placeholder='Choose Date'
                          options={{
                            dateFormat: 'Y-m-d',
                            position: isRtl ? 'auto right' : 'auto left',
                          }}
                          className='form-input'
                          onChange={date =>
                            handleOnChange(date[0], 'effective_date')
                          }
                          value={form.effective_date || ''}
                          style={{
                            borderColor: emptyField.includes('effective_date')
                              ? 'red'
                              : '',
                          }}
                        />
                      </div>
                      <div>
                        <label htmlFor='quantity'>Expiration Date</label>
                        <Flatpickr
                          id='expiration_date'
                          name='expiration_date'
                          placeholder='Choose Date'
                          options={{
                            dateFormat: 'Y-m-d',
                            position: isRtl ? 'auto right' : 'auto left',
                          }}
                          className='form-input'
                          onChange={date =>
                            handleOnChange(date[0], 'expiration_date')
                          }
                          value={form.expiration_date || ''}
                          style={{
                            borderColor: emptyField.includes('expiration_date')
                              ? 'red'
                              : '',
                          }}
                        />
                      </div>
                    </div>
                    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                      <div>
                        <div className='w-full'>
                          <button
                            onClick={handleAddItemBillOfMaterial}
                            type='button'
                            className='btn btn-primary w-full'
                          >
                            Select Item
                          </button>
                        </div>
                      </div>
                      <div>
                        <div className='w-full'>
                          <button
                            onClick={handleClearItemBillOfMaterial}
                            type='button'
                            className='btn btn-danger w-full'
                          >
                            Clear Item
                          </button>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label htmlFor='description'>Description</label>
                      <textarea
                        id='description'
                        name='description'
                        rows={3}
                        className='form-textarea'
                        placeholder='Enter Description'
                        onChange={e =>
                          handleOnChange(String(e.target.value), 'description')
                        }
                        value={form.description || ''}
                        required
                        style={{
                          borderColor: emptyField.includes('description')
                            ? 'red'
                            : '',
                        }}
                      ></textarea>
                    </div>
                    <div>
                      <label htmlFor='description'>Keterangan</label>
                      <div className='flex flex-row flex-wrap space-x-4 border-2 border-dashed p-2'>
                        <div className='flex flex-row items-center justify-center'>
                          <div className='mr-2 h-3 w-3 rounded-full bg-blue-400' />
                          <span>Item End Product</span>
                        </div>
                        <div className='flex flex-row items-center justify-center'>
                          <div className='mr-2 h-3 w-3 rounded-full bg-yellow-400' />
                          <span>Item Itermediete</span>
                        </div>
                        <div className='flex flex-row items-center justify-center'>
                          <div className='mr-2 h-3 w-3 rounded-full bg-green-400' />
                          <span>Item Raw Material</span>
                        </div>
                        <div className='flex flex-row items-center justify-center'>
                          <div className='mr-2 h-3 w-3 rounded-full bg-slate-400' />
                          <span>Item Penyusun</span>
                        </div>
                      </div>
                    </div>
                    {openCanvas && (
                      <div className='overflow-y-autoborder-2 shadow-inner-md h-fit max-h-[600px] w-full overflow-x-auto border-2 border-dashed p-2'>
                        <div className='min-w-[200%]'>{renderTree(tree)}</div>
                      </div>
                    )}
                  </div>
                  <div className='mt-8 flex items-center justify-end'>
                    <button
                      onClick={handleCancel}
                      type='button'
                      className='btn btn-outline-danger'
                    >
                      Discard
                    </button>
                    <button
                      onClick={handleSubmit}
                      type='button'
                      className='btn btn-primary ltr:ml-4 rtl:mr-4'
                    >
                      Save
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default ModalBillOfMaterial;
