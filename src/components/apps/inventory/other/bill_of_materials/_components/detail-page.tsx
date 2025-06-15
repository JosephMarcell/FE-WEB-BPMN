import { useEffect } from 'react';
import Flatpickr from 'react-flatpickr';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';

import { IRootState } from '@/store';
import {
  BillOfMaterialObject,
  handleSetBillOfMaterial,
} from '@/store/inventory/bill_of_material';

import { useGetAllItemForDropdownByCategory } from '@/app/api/hooks/inventory/items/item/useGetAllItemForDropdownByCategory';
import { BillOfMaterialProperty } from '@/helpers/utils/inventory/bill_of_materials';

import ItemMaterialComponent from './item-material-component';

interface IBillOfMaterialProperty {
  data: BillOfMaterialProperty;
}
interface OptionSelect {
  pkid: string | number;
  name: string | number;
  code: string | number;
  number: string | number;
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
        isReadOnly={true}
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
const BillOfMaterialDetailComponent = ({ data }: IBillOfMaterialProperty) => {
  const isRtl =
    useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';
  const tree = useSelector((state: IRootState) => state.billOfMaterial.tree);
  const dispatch = useDispatch();

  const { data: listEndProducts } = useGetAllItemForDropdownByCategory(1);

  useEffect(() => {
    if (data) {
      dispatch(
        handleSetBillOfMaterial({
          item_detail_pkid: data.item_header_pkid ?? 0,
          item_name: data?.itemHeader?.name ?? '',
          quantity: data.production_quantity ?? 0,
          unique_parent: 1,
          item_code: data?.itemHeader?.code ?? '',
          level: 0,
          childBomDetails: data.bomDetails ?? [],
        }),
      );
    }
  }, [data, dispatch]);
  return (
    <div className='panel border-white-light h-full px-0'>
      <div className='p-5'>
        <div className='space-y-5'>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <div>
              <label>Item Name</label>
              <Select
                id='item_header_pkid'
                name='item_header_pkid'
                placeholder='Pilih Item'
                className='basic-single'
                options={listEndProducts?.map((item: OptionSelect) => ({
                  value: item.pkid,
                  label: item.name,
                  code: item.code,
                }))}
                isSearchable={true}
                isClearable={true}
                maxMenuHeight={150}
                menuPlacement='top'
                isDisabled
                value={
                  data.item_header_pkid
                    ? {
                        value: data.item_header_pkid ?? '',
                        label:
                          (listEndProducts &&
                            listEndProducts?.find(
                              (item: { pkid: number }) =>
                                item.pkid === data.item_header_pkid,
                            )?.name) ??
                          '',
                        code:
                          (listEndProducts &&
                            listEndProducts?.find(
                              (item: { pkid: number }) =>
                                item.pkid === data.item_header_pkid,
                            )?.code) ??
                          '',
                      }
                    : null
                }
              />
            </div>
            <div>
              <label htmlFor='production_quantity'>Quantity</label>
              <input
                id='production_quantity'
                name='production_quantity'
                type='text'
                placeholder='Quantity Produced '
                className='form-input'
                value={data.production_quantity || ''}
                readOnly
              />
            </div>
          </div>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <div>
              <label>Effective Date</label>
              <Flatpickr
                id='effective_date'
                name='effective_date'
                placeholder='Choose Date'
                options={{
                  dateFormat: 'Y-m-d',
                  position: isRtl ? 'auto right' : 'auto left',
                }}
                className='form-input'
                value={data.effective_date || ''}
                disabled
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
                value={data.expiration_date || ''}
                disabled
              />
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
              value={data.description || ''}
              required
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
          <div className='overflow-y-autoborder-2 shadow-inner-md h-fit max-h-[600px] w-full overflow-x-auto border-2 border-dashed p-2'>
            <div className='min-w-[200%]'>{renderTree(tree)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillOfMaterialDetailComponent;
