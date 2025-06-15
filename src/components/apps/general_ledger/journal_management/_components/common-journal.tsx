import Select, { components, GroupBase, OptionProps } from 'react-select';
import Swal from 'sweetalert2';

import { useGetAllCoa } from '@/app/api/hooks/general_ledger/coa/useGetAllCoa';
import { JournalProperty } from '@/helpers/utils/general_ledger/journal';

interface ICommonJournal {
  form: JournalProperty;
  handleOnChange: (value: string | Date | number | null, key: string) => void;
  dataJournalDetail: JournalDetail[];
  setDataJournalDetail: (data: JournalDetail[]) => void;
  emptyField: string[];
}
interface JournalDetail {
  credit: number;
  credit_curr: number;
  debit: number;
  debit_curr: number;
  coa_pkid: number;
  name: string;
  number: string;
}
interface OptionSelect {
  pkid: string | number;
  name: string | number;
  number: string | number;
}

const CommonJournal = ({
  form,
  handleOnChange,
  dataJournalDetail,
  setDataJournalDetail,
  emptyField,
}: ICommonJournal) => {
  const { data: listCoa } = useGetAllCoa();

  const handleAddJournalDetail = (
    coa_pkid: number,
    name: string,
    number: string,
  ) => {
    const isExist = dataJournalDetail.some(data => data.coa_pkid === coa_pkid);
    if (isExist) {
      Swal.fire({
        title: 'COA Already Inserted',
        text: 'Please select another coa',
        icon: 'error',
        confirmButtonText: 'Close',
      });
      return;
    }
    const tempDataJournalDetail = [...dataJournalDetail];
    const data = {
      credit: 0,
      credit_curr: 0,
      debit: 0,
      debit_curr: 0,
      coa_pkid: coa_pkid,
      name: name,
      number: number,
    };
    tempDataJournalDetail.push(data);
    setDataJournalDetail(tempDataJournalDetail);
  };
  const handleDeleteJournalDetail = (coa_pkid: number) => {
    const tempDataJournalDetail = [...dataJournalDetail];
    const newDataJournalDetail = tempDataJournalDetail.filter(
      data => data.coa_pkid !== coa_pkid,
    );
    setDataJournalDetail(newDataJournalDetail);
  };
  const handleOnChangeJournalDetail = (
    value: string | number | null | undefined,
    key: string | number,
    coa_pkid: number,
  ) => {
    const tempDataJournalDetail = [...dataJournalDetail];
    const newDataJournalDetail = tempDataJournalDetail.map(data => {
      if (data.coa_pkid === coa_pkid) {
        return { ...data, [key]: value, [`${key}_curr`]: value };
      }
      return data;
    });
    setDataJournalDetail(newDataJournalDetail);
  };
  function CustomOption<
    Option,
    IsMulti extends boolean = false,
    Group extends GroupBase<Option> = GroupBase<Option>,
  >(props: OptionProps<Option, IsMulti, Group>) {
    const data = props.data as {
      value: number;
      label: string;
      kode: string;
    };
    return (
      <components.Option {...props}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>{props.children}</div>
          <button
            type='button'
            className='btn btn-primary'
            onClick={e => {
              e.stopPropagation();
              handleAddJournalDetail(data?.value, data?.label, data?.kode);
            }}
          >
            Add
          </button>
        </div>
      </components.Option>
    );
  }

  const customComponents = {
    Option: CustomOption,
  };

  return (
    <div className='space-y-5'>
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
          onChange={e => handleOnChange(String(e.target.value), 'notes')}
          value={form.notes || ''}
          required
          style={{
            borderColor: emptyField.includes('notes') ? 'red' : '',
          }}
        ></textarea>
      </div>
      <div>
        <label htmlFor='find_coa'>
          Cari Akun Perkiraan <span style={{ color: 'red' }}>*</span>
        </label>
        <Select
          id='find_coa'
          placeholder='Pilih Kategori Aset'
          name='find_coa'
          className='basic-single'
          components={customComponents}
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
              zIndex: 9999,
            }),
            menuPortal: provided => ({
              ...provided,
              zIndex: 9999,
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
              <th className='text-center'>Action</th>
            </tr>
          </thead>
          <tbody>
            {dataJournalDetail.map((data: JournalDetail) => {
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
                      onChange={e =>
                        handleOnChangeJournalDetail(
                          e.target.value,
                          'debit',
                          data.coa_pkid,
                        )
                      }
                      defaultValue={data.debit}
                    />
                  </td>
                  <td className='text-right'>
                    <input
                      type='text'
                      className='border-none text-right caret-blue-500 focus:caret-indigo-500'
                      onChange={e =>
                        handleOnChangeJournalDetail(
                          e.target.value,
                          'credit',
                          data.coa_pkid,
                        )
                      }
                      placeholder='0'
                      defaultValue={data.credit}
                    />
                  </td>

                  <td className='text-center'>
                    <button
                      className='btn btn-danger btn-sm'
                      onClick={() => handleDeleteJournalDetail(data.coa_pkid)}
                    >
                      delete
                    </button>
                  </td>
                </tr>
              );
            })}
            <tr>
              <td colSpan={2} className='text-center'>
                <strong>Total</strong>
              </td>
              <td className='text-right'>
                {dataJournalDetail.reduce((acc, curr) => acc + +curr.debit, 0)}
              </td>
              <td className='text-right'>
                {dataJournalDetail.reduce((acc, curr) => acc + +curr.credit, 0)}
              </td>
              <td className='text-right'>
                {Math.abs(
                  dataJournalDetail.reduce(
                    (acc, curr) => acc + +curr.credit,
                    0,
                  ) -
                    dataJournalDetail.reduce(
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
  );
};

export default CommonJournal;
