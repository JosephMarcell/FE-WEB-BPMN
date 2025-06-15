import { Menu, Transition } from '@headlessui/react';
import sortBy from 'lodash/sortBy';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import Link from 'next/link';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { Fragment } from 'react';
import { CiBoxList } from 'react-icons/ci';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux';
import { Tooltip } from 'react-tooltip';
import Swal from 'sweetalert2';

import { getTranslation } from '@/lib/lang/i18n';

import Dropdown from '@/components/dropdown';
import IconCaretDown from '@/components/icon/icon-caret-down';
import IconDownload from '@/components/icon/icon-download';
import IconEdit from '@/components/icon/icon-edit';
import IconEye from '@/components/icon/icon-eye';
import IconFile from '@/components/icon/icon-file';
import IconPrinter from '@/components/icon/icon-printer';
import IconTrashLines from '@/components/icon/icon-trash-lines';
import Skeleton from '@/components/Skeleton';

import { IRootState } from '@/store';
import { setModalEdit, setPkid } from '@/store/themeConfigSlice';

import { AssetStatus } from '@/helpers/utils/global/listStatus';
import { UserRole, UserStatus } from '@/helpers/utils/global/listUser';

const { t } = getTranslation();
interface MyData {
  [key: string]: unknown;
}
interface DataTableColumn<T extends MyData> {
  accessor: string;
  title: string;
  sortable?: boolean;
  hidden?: boolean;
  render?: (record: T, index: number) => React.ReactNode;
}
interface IProps<T extends MyData> {
  title?: string;
  data?: T[];
  columns?: DataTableColumn<T>[];
  isLoading?: boolean;
  deleteFunc?: (id: string | number) => void; // Ubah tipe parameter menjadi string | number
  detailPath?: string;
  refetch?: () => void;
  hide_columns?: string[];
  action?: string;
  exportCSV?: () => void;
  exportPDF?: () => void;
  handleDownloadRow?: (id: string | number) => void; // Ubah ini dari number ke string | number
  onEdit?: (id: string | number) => void; // Tambahkan properti onEdit
}
const RenderHRMDataTable = <T extends MyData>({
  title,
  data,
  columns,
  isLoading,
  deleteFunc,
  detailPath,
  refetch,
  hide_columns = [],
  action,
  exportCSV,
  exportPDF,
  handleDownloadRow, // Destructure handleDownloadRow
  onEdit, // Destructure onEdit
}: IProps<T>) => {
  const isRtl =
    useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';
  const dispatch = useDispatch();
  useEffect(() => {
    if (refetch) {
      refetch();
    }
  }, [refetch]);
  const [page, setPage] = useState(1);
  const PAGE_SIZES = [5, 10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[1]);
  const [initialRecords, setInitialRecords] = useState(data ? data : []);
  const [, setRecordsData] = useState(initialRecords);
  const [search, setSearch] = useState('');
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: 'id',
    direction: 'asc',
  });
  const [hideCols, setHideCols] = useState<string[]>(hide_columns);
  const showHideColumns = (col: string) => {
    if (hideCols.includes(col)) {
      setHideCols((prevCols: string[]) =>
        prevCols.filter((d: string) => d !== col),
      );
    } else {
      setHideCols((prevCols: string[]) => [...prevCols, col]);
    }
  };
  const formatDate = (date: string) => {
    if (date) {
      date = date.split('T')[0];
      const dt = new Date(date);
      const month =
        dt.getMonth() + 1 < 10 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1;
      const day = dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate();
      return day + '-' + month + '-' + dt.getFullYear();
    }
    return '';
  };

  const actionTime = (date: string) => {
    if (date) {
      const [datePart, elsePart] = date.split('T');
      const timePart = elsePart.split('+');
      const [hour, minute, second] = timePart[0].split(':');
      const formattedSecond = second.slice(0, 2);
      const [year, month, day] = datePart.split('-');

      return ` ${day}-${month}-${year} ${hour}:${minute}:${formattedSecond}`;
    }
    return '';
  };

  const sortedAndPaginatedRecords = useMemo(() => {
    const sortedData = sortBy(initialRecords, [sortStatus.columnAccessor]);
    if (sortStatus.direction === 'desc') {
      sortedData.reverse();
    }
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    return sortedData.slice(from, to);
  }, [initialRecords, sortStatus, page, pageSize]);
  useEffect(() => {
    setInitialRecords(data || []);
  }, [data]);
  useEffect(() => {
    setPage(1);
  }, [pageSize]);
  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    setRecordsData([...initialRecords.slice(from, to)]);
  }, [page, pageSize, initialRecords]);
  useEffect(() => {
    if (data && columns) {
      setInitialRecords(
        data.filter((item: MyData) => {
          return columns?.some(col => {
            const columnValue = item[col.accessor];
            if (columnValue) {
              return columnValue
                .toString()
                .toLowerCase()
                .includes(search.toLowerCase());
            }
            return false;
          });
        }),
      );
    }
  }, [search, data, columns]);
  // const handleUpdateRow = (id: number) => {
  //   dispatch(setModalEdit(true));
  //   dispatch(setPkid(id));
  // };
  const handleUpdateRow = (id: string | number) => {
    dispatch(setModalEdit(true));
    // Use type assertion to bypass TypeScript's type checking
    dispatch(setPkid(id as any));
  };
  const handleDeleteRow = (id: string | number) => {
    Swal.fire({
      title: 'Are you sure to delete?',
      text: 'You will not be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete it!',
      cancelButtonText: 'No, cancel!',
    }).then(async result => {
      if (result.isConfirmed) {
        try {
          // Cek dulu apakah record memiliki property id yang lebih relevan
          const record = sortedAndPaginatedRecords.find(
            r => r.pkid === id || r.id === id,
          );

          // Gunakan UUID string jika tersedia di property id
          const actualId =
            record && typeof record.id === 'string' ? record.id : id;
          console.log('Deleting with ID:', actualId);

          deleteFunc?.(actualId);

          Swal.fire('Deleted!', 'Your data has been deleted.', 'success').then(
            () => {
              refetch?.();
            },
          );
        } catch (error) {
          console.error('Delete error:', error);
          Swal.fire('Error!', 'Something went wrong', 'error');
        }
      }
    });
  };

  const getNestedValue = <T extends MyData>(obj: T, accessor: string) => {
    // Split the accessor by the keys
    const keys = accessor.split(/[[\].]+/).filter(Boolean);

    // Iterate through the keys and access the nested properties
    return keys.reduce((acc: unknown, key: string) => {
      if (acc && typeof acc === 'object' && key in acc) {
        return (acc as MyData)[key];
      }
      return undefined;
    }, obj);
  };

  const handleLogRow = (username: string) => {
    localStorage.setItem('username', username);
  };

  if (isLoading) {
    return <Skeleton className='h-full w-full' />;
  }
  return (
    <div className='panel mt-6'>
      <div className='mb-5 flex flex-col gap-5 px-5 md:flex-row md:items-center'>
        {title && <h2 className='text-xl font-semibold'>{title}</h2>}
        <div className='flex items-center gap-5 ltr:ml-auto rtl:mr-auto'>
          {title === t('each_user_activity') && (
            <div className='flex flex-wrap items-center'>
              {/* <button type='button' className='btn btn-dark btn-sm m-1 '>
              <IconFile className='h-5 w-5 ltr:mr-2 rtl:ml-2' />
              Bulk Insert
            </button> */}
              <button
                type='button'
                onClick={exportCSV}
                className='btn btn-success btn-sm m-1 '
              >
                <IconFile className='h-5 w-5 ltr:mr-2 rtl:ml-2' />
                CSV
              </button>
              {/* <button
              type='button'
              // onClick={() => exportTable('txt')}
              className='btn btn-info btn-sm m-1'
            >
              <IconFile className='h-5 w-5 ltr:mr-2 rtl:ml-2' />
              TXT
            </button> */}
              <button
                type='button'
                onClick={exportPDF}
                className='btn btn-primary btn-sm m-1'
              >
                <IconPrinter className='ltr:mr-2 rtl:ml-2' />
                PDF
              </button>
            </div>
          )}

          <div className='z-10 flex flex-col gap-5 md:flex-row md:items-center'>
            <div className='dropdown'>
              <Dropdown
                placement={`${isRtl ? 'bottom-end' : 'bottom-start'}`}
                btnClassName='!flex items-center border font-semibold border-white-light dark:border-[#253b5c] rounded-md px-4 py-2 text-sm dark:bg-[#1b2e4b] dark:text-white-dark'
                button={
                  <>
                    <span className='ltr:mr-1 rtl:ml-1'> {t('column')} </span>
                    <IconCaretDown className='h-5 w-5' />
                  </>
                }
              >
                <ul className='!min-w-[140px]'>
                  {columns?.map((col, i) => {
                    return (
                      <li
                        key={i}
                        className='flex flex-col'
                        onClick={e => {
                          e.stopPropagation();
                        }}
                      >
                        <div className='flex items-center px-4 py-1'>
                          <label className='mb-0 cursor-pointer'>
                            <input
                              type='checkbox'
                              checked={!hideCols.includes(col.accessor)}
                              className='form-checkbox'
                              defaultValue={String(col?.accessor)}
                              onChange={(
                                event: ChangeEvent<HTMLInputElement>,
                              ) => {
                                setHideCols(
                                  hideCols.filter(
                                    (d: string) =>
                                      d !== event.target.defaultValue,
                                  ),
                                );
                                showHideColumns(col.accessor);
                              }}
                            />
                            <span className='ltr:ml-2 rtl:mr-2'>
                              {col.title}
                            </span>
                          </label>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </Dropdown>
            </div>
          </div>
          <div className='text-right'>
            <input
              type='text'
              className='form-input'
              placeholder={t('search') + '...'}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className='datatables'>
        <DataTable
          className='table-hover whitespace-nowrap'
          records={sortedAndPaginatedRecords}
          columns={
            columns
              ? columns.map((col, i) => {
                  return {
                    accessor: col.accessor,
                    title: col.title,
                    sortable: true,
                    hidden: hideCols.includes(col.accessor),
                    cellsClassName: `{ ${
                      i === columns.length - 1
                        ? 'sticky right-0 shadow-md bg-white dark:!border-[#191e3a] dark:bg-black'
                        : ''
                    }`,
                    titleClassName: `relative  ${
                      i === columns.length - 1 ? 'sticky right-0 z-10' : ''
                    }`,
                    render: (record: T, index: number) =>
                      col.render ? (
                        col.render(record, index)
                      ) : String(col.accessor).includes('date') ||
                        String(col.accessor).includes('maintenance_end') ||
                        String(col.accessor).includes('maintenance_start') ? (
                        formatDate(record[col.accessor] as string)
                      ) : String(col.accessor).includes('action_time') ? (
                        actionTime(record[col.accessor] as string)
                      ) : String(col.accessor).includes('role') ? (
                        <span
                          className={`badge bg-${
                            UserRole.find(x => x.value === record[col.accessor])
                              ?.color
                          }`}
                        >
                          {
                            UserRole.find(x => x.value === record[col.accessor])
                              ?.label
                          }
                        </span>
                      ) : String(col.accessor).includes('status') ? (
                        <span
                          className={`rounded-full p-2 py-1 font-bold text-white bg-${
                            AssetStatus.find(
                              x => x.value === record[col.accessor],
                            )?.color
                          }`}
                        >
                          {
                            AssetStatus.find(
                              x => x.value === record[col.accessor],
                            )?.label
                          }
                        </span>
                      ) : String(col.accessor).includes('is_verified') ? (
                        <span
                          className={`badge bg-${
                            UserStatus.find(
                              x => x.value === record[col.accessor],
                            )?.color
                          }`}
                        >
                          {
                            UserStatus.find(
                              x => x.value === record[col.accessor],
                            )?.label
                          }
                        </span>
                      ) : col.accessor === 'action' ? (
                        <div className='opa z-10 mx-auto flex w-max items-center gap-4'>
                          <div className='relative'>
                            <div className='dropdown'>
                              <div className='relative inline-block text-left'>
                                <Menu>
                                  {({ open }) => (
                                    <>
                                      <span className='rounded-md shadow-sm'>
                                        <Menu.Button className='focus:shadow-outline-blue inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:border-blue-300 focus:outline-none active:bg-gray-50 active:text-gray-800 dark:bg-black'>
                                          <HiOutlineDotsVertical className='h-4.5 w-4.5' />
                                        </Menu.Button>
                                      </span>
                                      <Transition
                                        show={open}
                                        as={Fragment}
                                        enter='transition ease-out duration-100'
                                        enterFrom='transform opacity-0 scale-95'
                                        enterTo='transform opacity-100 scale-100'
                                        leave='transition ease-in duration-75'
                                        leaveFrom='transform opacity-100 scale-100'
                                        leaveTo='transform opacity-0 scale-95'
                                      >
                                        <Menu.Items
                                          static
                                          className='absolute right-full z-10 -mt-10 mr-2 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'
                                        >
                                          <div className='flex space-x-2 px-4 py-1'>
                                            {action?.includes('U') && (
                                              <>
                                                <Menu.Item data-tooltip-id='my-tooltip-edit'>
                                                  {({ active }) => (
                                                    <button
                                                      className={`${
                                                        active
                                                          ? 'bg-gray-100'
                                                          : 'text-gray-900'
                                                      } flex items-center rounded-xl px-2 py-2 text-sm`}
                                                      onClick={() => {
                                                        const idToUpdate =
                                                          typeof record.id ===
                                                            'string' &&
                                                          record.id.includes(
                                                            '-',
                                                          )
                                                            ? record.id
                                                            : (record.pkid as
                                                                | string
                                                                | number);

                                                        // Gunakan fungsi edit kustom jika disediakan, jika tidak, gunakan handleUpdateRow
                                                        if (onEdit) {
                                                          onEdit(idToUpdate);
                                                        } else {
                                                          handleUpdateRow?.(
                                                            idToUpdate,
                                                          );
                                                        }
                                                      }}
                                                    >
                                                      <IconEdit className='h-4.5 w-4.5 text-blue-600' />
                                                    </button>
                                                  )}
                                                </Menu.Item>
                                                <Tooltip
                                                  id='my-tooltip-edit'
                                                  content='Edit'
                                                  events={['hover']}
                                                  place={
                                                    isRtl ? 'left' : 'right'
                                                  }
                                                  style={{
                                                    backgroundColor:
                                                      'rgb(255, 255, 255)',
                                                    color: '#4361ee',
                                                  }}
                                                  className='z-50'
                                                />
                                              </>
                                            )}
                                            {action?.includes('L') && (
                                              <>
                                                <Menu.Item data-tooltip-id='my-tooltip-log'>
                                                  {({ active }) => (
                                                    <Link
                                                      href={`../users/user_log/${record.user_pkid}`}
                                                      className={`${
                                                        active
                                                          ? 'bg-gray-100'
                                                          : 'text-gray-900'
                                                      } flex items-center rounded-xl px-2 py-2 text-sm`}
                                                      onClick={() =>
                                                        handleLogRow(
                                                          record.username as string,
                                                        )
                                                      }
                                                    >
                                                      <CiBoxList className='h-4.5 w-4.5 text-green-600' />
                                                    </Link>
                                                  )}
                                                </Menu.Item>
                                                <Tooltip
                                                  id='my-tooltip-log'
                                                  content='Log'
                                                  events={['hover']}
                                                  place={
                                                    isRtl ? 'left' : 'right'
                                                  }
                                                  style={{
                                                    backgroundColor:
                                                      'rgb(255, 255, 255)',
                                                    color: '#4361ee',
                                                    zIndex: 99,
                                                  }}
                                                />
                                              </>
                                            )}
                                            {action?.includes('R') && (
                                              <>
                                                <Menu.Item data-tooltip-id='my-tooltip-read'>
                                                  {({ active }) => (
                                                    // Dalam komponen RenderHRMDataTable, temukan bagian Link untuk detail dan ubah menjadi:
                                                    <Link
                                                      href={`${detailPath}/${
                                                        record.id &&
                                                        typeof record.id ===
                                                          'string' &&
                                                        record.id.includes('-')
                                                          ? record.id
                                                          : record.pkid ||
                                                            record.id ||
                                                            ''
                                                      }`}
                                                      className={`${
                                                        active
                                                          ? 'bg-gray-100'
                                                          : 'text-gray-900'
                                                      } flex items-center rounded-xl px-2 py-2 text-sm`}
                                                    >
                                                      <IconEye className='h-4.5 w-4.5 text-yellow-600' />
                                                    </Link>
                                                  )}
                                                </Menu.Item>
                                                <Tooltip
                                                  id='my-tooltip-read'
                                                  content='Read'
                                                  events={['hover']}
                                                  place={
                                                    isRtl ? 'left' : 'right'
                                                  }
                                                  style={{
                                                    backgroundColor:
                                                      'rgb(255, 255, 255)',
                                                    color: '#4361ee',
                                                    zIndex: 99,
                                                  }}
                                                />
                                              </>
                                            )}
                                            {action?.includes('D') && (
                                              <>
                                                <Menu.Item data-tooltip-id='my-tooltip-delete'>
                                                  {({ active }) => (
                                                    <button
                                                      className={`${
                                                        active
                                                          ? 'bg-gray-100'
                                                          : 'text-gray-900'
                                                      } flex items-center rounded-xl px-2 py-2 text-sm`}
                                                      onClick={() => {
                                                        console.log(
                                                          '=== DELETE BUTTON CLICKED ===',
                                                        );
                                                        console.log(
                                                          'Record object:',
                                                          record,
                                                        );
                                                        console.log(
                                                          'Record.id:',
                                                          record.id,
                                                        );
                                                        console.log(
                                                          'Record.pkid:',
                                                          record.pkid,
                                                        );

                                                        // Type-safe way to get deleteId
                                                        let deleteId:
                                                          | string
                                                          | number;

                                                        // Prioritas: gunakan record.id jika ada dan berupa string/number,
                                                        // jika tidak ada atau invalid, gunakan record.pkid
                                                        if (
                                                          record.id &&
                                                          (typeof record.id ===
                                                            'string' ||
                                                            typeof record.id ===
                                                              'number')
                                                        ) {
                                                          deleteId = record.id;
                                                        } else if (
                                                          record.pkid &&
                                                          (typeof record.pkid ===
                                                            'string' ||
                                                            typeof record.pkid ===
                                                              'number')
                                                        ) {
                                                          deleteId =
                                                            record.pkid;
                                                        } else {
                                                          console.error(
                                                            'No valid ID found for deletion',
                                                          );
                                                          return; // Exit early if no valid ID
                                                        }

                                                        console.log(
                                                          'Using delete ID:',
                                                          deleteId,
                                                        );
                                                        console.log(
                                                          'Delete ID type:',
                                                          typeof deleteId,
                                                        );

                                                        if (deleteFunc) {
                                                          deleteFunc(deleteId);
                                                        } else {
                                                          handleDeleteRow(
                                                            deleteId,
                                                          );
                                                        }
                                                      }}
                                                    >
                                                      <IconTrashLines className='h-4.5 w-4.5 text-red-600' />
                                                    </button>
                                                  )}
                                                </Menu.Item>
                                                <Tooltip
                                                  id='my-tooltip-delete'
                                                  content='Delete'
                                                  events={['hover']}
                                                  place={
                                                    isRtl ? 'left' : 'right'
                                                  }
                                                  style={{
                                                    backgroundColor:
                                                      'rgb(255, 255, 255)',
                                                    color: '#4361ee',
                                                    zIndex: 99,
                                                  }}
                                                />
                                              </>
                                            )}
                                            {action?.includes('X') && (
                                              <>
                                                <Menu.Item data-tooltip-id='my-tooltip-download'>
                                                  {({ active }) => (
                                                    <button
                                                      className={`${
                                                        active
                                                          ? 'bg-gray-100'
                                                          : 'text-gray-900'
                                                      } flex items-center rounded-xl px-2 py-2 text-sm`}
                                                      onClick={() => {
                                                        const idToDownload =
                                                          typeof record.id ===
                                                            'string' &&
                                                          record.id.includes(
                                                            '-',
                                                          )
                                                            ? record.id
                                                            : (record.pkid as
                                                                | string
                                                                | number);

                                                        handleDownloadRow?.(
                                                          idToDownload,
                                                        );
                                                      }}
                                                    >
                                                      <IconDownload className='h-4.5 w-4.5 text-green-600' />
                                                    </button>
                                                  )}
                                                </Menu.Item>
                                                <Tooltip
                                                  id='my-tooltip-download'
                                                  content='Download'
                                                  events={['hover']}
                                                  place={
                                                    isRtl ? 'left' : 'right'
                                                  }
                                                  style={{
                                                    backgroundColor:
                                                      'rgb(255, 255, 255)',
                                                    color: '#4361ee',
                                                  }}
                                                  className='z-[999]'
                                                />
                                              </>
                                            )}
                                          </div>
                                        </Menu.Items>
                                      </Transition>
                                    </>
                                  )}
                                </Menu>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : getNestedValue(record, col.accessor) !== undefined &&
                        getNestedValue(record, col.accessor) !== null ? (
                        String(getNestedValue(record, col.accessor))
                      ) : (
                        '-'
                      ),
                  };
                })
              : []
          }
          highlightOnHover
          noRecordsText={t('no_records_found')}
          totalRecords={initialRecords.length}
          recordsPerPage={pageSize}
          page={page}
          fetching={isLoading}
          onPageChange={p => setPage(p)}
          recordsPerPageOptions={PAGE_SIZES}
          onRecordsPerPageChange={setPageSize}
          sortStatus={sortStatus}
          onSortStatusChange={setSortStatus}
          minHeight={400}
          paginationText={({ from, to, totalRecords }) =>
            `Showing  ${from} to ${to} of ${totalRecords} entries`
          }
          recordsPerPageLabel='Records per page'
        />
      </div>
    </div>
  );
};
export default RenderHRMDataTable;
