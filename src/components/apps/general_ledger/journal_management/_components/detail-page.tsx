import Flatpickr from 'react-flatpickr';
import Select from 'react-select';

import { useGetAllCoa } from '@/app/api/hooks/general_ledger/coa/useGetAllCoa';
import { useGetAllTransactionType } from '@/app/api/hooks/general_ledger/transaction_type/useGetAllTransactionType';
import { JournalProperty } from '@/helpers/utils/general_ledger/journal';
import { JournalDetailProperty } from '@/helpers/utils/general_ledger/journalDetail';

interface IJournalDetail {
  data: JournalProperty;
}
interface OptionSelect {
  pkid: string | number;
  name: string | number;
  number: string | number;
}
const JournalDetailComponent = ({ data }: IJournalDetail) => {
  const { data: listTransactionType } = useGetAllTransactionType();
  const { data: listCoa } = useGetAllCoa();
  return (
    <div className='panel border-white-light h-full px-5'>
      <div className='space-y-5'>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <div>
            <label htmlFor='post_date'>
              Per Tanggal <span style={{ color: 'red' }}>*</span>
            </label>
            <Flatpickr
              id='post_date'
              name='post_date'
              placeholder='Pilih Tanggal'
              className='form-input'
              value={data.post_date || ''}
              style={{ cursor: 'not-allowed' }}
              disabled
            />
          </div>
          <div>
            <label htmlFor='transaction_type_pkid'>
              Tipe Transaksi <span style={{ color: 'red' }}>*</span>
            </label>
            <Select
              id='transaction_type_pkid'
              placeholder='Pilih Kategori Aset'
              name='transaction_type_pkid'
              className='basic-single'
              isSearchable={true}
              isClearable={true}
              value={
                data.transaction_type_pkid
                  ? {
                      value: data.transaction_type_pkid ?? '',
                      label:
                        listTransactionType?.find(
                          (item: OptionSelect) =>
                            item.pkid === data.transaction_type_pkid,
                        )?.name ?? '',
                    }
                  : null
              }
              menuPortalTarget={document.body}
              isDisabled
            />
          </div>
        </div>
        <div>
          <label htmlFor='notes'>
            Keterangan <span style={{ color: 'red' }}>*</span>
          </label>
          <textarea
            id='notes'
            name='notes'
            rows={3}
            className='form-textarea'
            placeholder='Enter notes'
            value={data.notes || ''}
            required
            style={{ cursor: 'not-allowed' }}
            disabled
          ></textarea>
        </div>
        <div>
          <label htmlFor='find_coa'>
            Cari Akun Perkiraan <span style={{ color: 'red' }}>*</span>
          </label>
          <Select
            id='find_coa'
            placeholder='Pilih Akun Perkiraan'
            name='find_coa'
            className='basic-single'
            isDisabled
            options={listCoa?.map((item: OptionSelect) => ({
              value: item.pkid,
              label: item.name,
              kode: item.number,
            }))}
            isSearchable={true}
            isClearable={true}
            menuPortalTarget={document.body}
            styles={{
              control: provided => ({
                ...provided,
                cursor: 'not-allowed',
              }),
              menuPortal: provided => ({
                ...provided,
                cursor: 'not-allowed',
              }),
            }}
          />
        </div>
        <div className='table-responsive mb-5'>
          <table>
            <thead>
              <tr>
                <th>Kode</th>
                <th>Nama</th>
                <th className='text-center'>Debit</th>
                <th className='text-center'>Credit</th>
                <th className='text-center'>Selisih</th>
              </tr>
            </thead>
            <tbody>
              {data.JournalDetails.map((data: JournalDetailProperty) => {
                return (
                  <tr key={data.coa_pkid}>
                    <td>
                      <div className='whitespace-nowrap'>{data.number}</div>
                    </td>
                    <td>
                      <div className='whitespace-nowrap'>{data.name}</div>
                    </td>
                    <td className='text-right'>
                      <input
                        type='text'
                        className='border-none text-right caret-blue-500 focus:caret-indigo-500'
                        placeholder='0'
                        defaultValue={data.debit}
                        style={{ cursor: 'not-allowed' }}
                        disabled
                      />
                    </td>
                    <td className='text-right'>
                      <input
                        type='text'
                        className='border-none text-right caret-blue-500 focus:caret-indigo-500'
                        placeholder='0'
                        defaultValue={data.credit}
                        style={{ cursor: 'not-allowed' }}
                        disabled
                      />
                    </td>
                  </tr>
                );
              })}
              <tr>
                <td colSpan={2} className='text-center'>
                  <strong>Total</strong>
                </td>
                <td className='text-right'>
                  {data.JournalDetails.reduce(
                    (acc, curr) => acc + +curr.debit,
                    0,
                  )}
                </td>
                <td className='text-right'>
                  {data.JournalDetails.reduce(
                    (acc, curr) => acc + +curr.credit,
                    0,
                  )}
                </td>
                <td className='text-right'>
                  {Math.abs(
                    data.JournalDetails.reduce(
                      (acc, curr) => acc + +curr.credit,
                      0,
                    ) -
                      data.JournalDetails.reduce(
                        (acc, curr) => acc + +curr.debit,
                        0,
                      ),
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default JournalDetailComponent;
