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
import IconTrashLines from '@/components/icon/icon-trash-lines';
import Skeleton from '@/components/Skeleton';

import { IRootState } from '@/store';
import { setModalEdit, setPkid } from '@/store/themeConfigSlice';

import {
  AssetCondition,
  AssetStatus,
  severityType,
  violationType,
} from '@/helpers/utils/global/listStatus';

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
  title: string;
  data?: T[];
  columns?: DataTableColumn<T>[];
  isLoading?: boolean;
  deleteFunc?: (id: number) => void;
  // approveFunc?: (id: number) => void;
  detailPath?: string;
  customDetailPath?: string;
  refetch?: () => void;
  hide_columns?: string[];
  action?: string;
  // exportCSV?: () => void;
  handleDownloadRow?: (id: number) => void;
  pagination?: {
    page: number;
    per_page: number;
    max_page: number;
    count: number;
  };
  setPage?: (page: number) => void; // Add setPage prop
  setLimit?: (limit: number) => void; // Add setLimit prop
}

const RenderDataTable = <T extends MyData>({
  title,
  data,
  columns,
  isLoading,
  deleteFunc,
  // approveFunc,
  detailPath,
  customDetailPath,
  refetch,
  hide_columns = [],
  action,
  // exportCSV,
  handleDownloadRow, // Destructure handleDownloadRow
  pagination, // Destructure pagination
  setPage, // Destructure setPage
  setLimit,
}: IProps<T>) => {
  // Add console logs to check pagination values

  const isRtl =
    useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';
  const dispatch = useDispatch();

  useEffect(() => {
    if (refetch) {
      refetch();
    }
  }, [refetch]);

  const [page, setPageState] = useState(pagination?.page || 1);
  const PAGE_SIZES = [5, 10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(
    pagination?.per_page || PAGE_SIZES[1],
  );
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

  function formatAssetLastUsage(dateString: string) {
    const [datePart, timePart] = dateString.split(' ');
    const [year, month, day] = datePart.split('-');

    const [hour, minute, second] = timePart.split(':');

    const formattedSecond = second.slice(0, 2);

    return `${day}-${month}-${year} ${hour}:${minute}:${formattedSecond}`;
  }

  function formatFacilityLastUsage(dateString: string) {
    const [datePart, fullTimePart] = dateString.split('T');

    const [year, month, day] = datePart.split('-');

    const [timePart] = fullTimePart.split('+');

    const [hour, minute, second] = timePart.split(':');

    const formattedSecond = second.slice(0, 2);

    return `${day}-${month}-${year} ${hour}:${minute}:${formattedSecond}`;
  }

  const formatDate = (date: string | null | undefined) => {
    if (typeof date === 'string' && date.length > 0) {
      const dateParts = date.split('T');
      if (dateParts.length > 0) {
        const dt = new Date(dateParts[0]);
        const month =
          dt.getMonth() + 1 < 10
            ? '0' + (dt.getMonth() + 1)
            : dt.getMonth() + 1;
        const day = dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate();
        const year = `${dt.getFullYear()}`;

        return `${day}-${month}-${year}`;
      }
    }
    return '';
  };

  const formatPkid = (pkid: number) => {
    const pkidString = pkid.toString();
    return <span> {pkidString} </span>;
  };

  const sortedAndPaginatedRecords = useMemo(() => {
    const sortedData = sortBy(initialRecords, [sortStatus.columnAccessor]);
    if (sortStatus.direction === 'desc') sortedData.reverse();

    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    return sortedData.slice(from, to);
  }, [initialRecords, sortStatus, page, pageSize]);

  useEffect(() => {
    setInitialRecords(data || []);
  }, [data]);

  useEffect(() => {
    setPageState(1);
  }, [pageSize]);

  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    setRecordsData([...initialRecords.slice(from, to)]);
  }, [page, pageSize, initialRecords]);

  useEffect(() => {
    if (data && columns) {
      setInitialRecords(
        data.filter((item: MyData) =>
          columns.some(col => {
            const columnValue = item[col.accessor];
            return columnValue
              ?.toString()
              .toLowerCase()
              .includes(search.toLowerCase());
          }),
        ),
      );
    }
  }, [search, data, columns]);

  const handleUpdateRow = (id: number) => {
    dispatch(setModalEdit(true));
    dispatch(setPkid(id));
  };

  const handleDeleteRow = (id: number) => {
    Swal.fire({
      title: 'Apakah anda mau menghapus?',
      text: 'Anda tidak akan bisa mengembalikan ini!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Tidak, batalkan!',
    }).then(async result => {
      if (result.isConfirmed) {
        try {
          deleteFunc?.(id);
          Swal.fire('Terhapus!', 'Data sudah dihapus.', 'success').then(() => {
            refetch?.();
          });
        } catch (error) {
          Swal.fire('Error!', 'Terjadi kesalahan', 'error');
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

  const handlePageChange = (newPage: number) => {
    setPage?.(newPage); // Use setPage prop if available
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setLimit?.(newPageSize); // Use setLimit prop if available
  };

  if (isLoading) {
    return <Skeleton className='h-full w-full' />;
  }

  return (
    <div className='panel mt-6'>
      <div className='mb-5 flex flex-col gap-5 px-5 md:flex-row md:items-center'>
        {title && <h2 className='text-xl font-semibold'>{title}</h2>}
        <div className='flex items-center gap-5 ltr:ml-auto rtl:mr-auto'>
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
          <div className='text-left'>
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
              ? columns.map(col => {
                  return {
                    accessor: col.accessor,
                    title: col.title,
                    sortable: true,
                    hidden: hideCols.includes(col.accessor),
                    cellsClassName: `{ ${
                      col.accessor === 'action'
                        ? 'sticky right-0 shadow-md bg-white dark:!border-[#191e3a] dark:bg-black'
                        : ''
                    }`,
                    titleClassName: `relative  ${
                      col.accessor === 'action' ? 'sticky right-0 z-10' : ''
                    }`,
                    render: (record: T, index: number) =>
                      col.render ? (
                        col.render(record, index)
                      ) : String(col.accessor).includes('date') ||
                        String(col.accessor).includes('maintenance_end') ||
                        String(col.accessor).includes('maintenance_start') ||
                        String(col.accessor).includes('purchase_date') ? (
                        formatDate(record[col.accessor] as string)
                      ) : String(col.accessor).includes('last_usage') &&
                        record['asset_code'] ? (
                        formatAssetLastUsage(record[col.accessor] as string)
                      ) : (String(col.accessor).includes('last_usage') &&
                          record['facility_name']) ||
                        String(col.accessor).includes('reported_at') ? (
                        formatFacilityLastUsage(record[col.accessor] as string)
                      ) : String(col.accessor).includes('condition') ? (
                        <span
                          className={`rounded-md p-2 py-1 text-center font-bold text-white  bg-${
                            AssetCondition.find(
                              x => x.value === record[col.accessor],
                            )?.color
                          }`}
                        >
                          {
                            AssetCondition.find(
                              x => x.value === record[col.accessor],
                            )?.label
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
                      ) : String(col.accessor).includes('severity') ? (
                        <span
                          className={`rounded-full p-2 py-1 font-bold text-white bg-${
                            severityType.find(
                              x => x.value === record[col.accessor],
                            )?.color
                          }`}
                        >
                          {
                            severityType.find(
                              x => x.value === record[col.accessor],
                            )?.label
                          }
                        </span>
                      ) : String(col.accessor).includes('violation_type') ? (
                        <span>
                          {
                            violationType.find(
                              x => x.value === record[col.accessor],
                            )?.label
                          }
                        </span>
                      ) : String(col.accessor).includes('pkid') ? (
                        formatPkid(record[col.accessor] as number)
                      ) : typeof record[col.accessor] === 'number' ||
                        (typeof record[col.accessor] === 'string' &&
                          !String(col.accessor).includes('date') &&
                          !String(col.accessor).includes('last_usage') &&
                          !isNaN(parseFloat(record[col.accessor] as string)) &&
                          !(record[col.accessor] as string).startsWith('0')) ? (
                        <div className='text-right'>
                          {new Intl.NumberFormat('de-DE').format(
                            parseFloat(record[col.accessor] as string),
                          )}
                        </div>
                      ) : typeof record[col.accessor] === 'string' &&
                        !isNaN(parseFloat(record[col.accessor] as string)) ? (
                        <div className='text-right'>
                          {record[col.accessor] as string}
                        </div>
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
                                                        handleUpdateRow?.(
                                                          record.pkid as number,
                                                        );
                                                      }}
                                                    >
                                                      <IconEdit className='h-4.5 w-4.5 text-blue-600' />
                                                    </button>
                                                  )}
                                                </Menu.Item>
                                                <Tooltip
                                                  id='my-tooltip-edit'
                                                  content='Update'
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
                                            {action?.includes('E') && (
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
                                                        handleUpdateRow?.(
                                                          record.pkid as number,
                                                        );
                                                      }}
                                                    >
                                                      <IconEdit className='h-4.5 w-4.5 text-blue-600' />
                                                    </button>
                                                  )}
                                                </Menu.Item>
                                                <Tooltip
                                                  id='my-tooltip-edit'
                                                  content='Update'
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
                                            {action?.includes('R') && (
                                              <>
                                                <Menu.Item data-tooltip-id='my-tooltip-read'>
                                                  {({ active }) => (
                                                    <Link
                                                      href={`${detailPath}/${
                                                        customDetailPath
                                                          ? record[
                                                              customDetailPath
                                                            ]
                                                          : record.pkid
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
                                                  content='Detail'
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
                                            {action?.includes('L') && (
                                              <>
                                                <Menu.Item data-tooltip-id='my-tooltip-log'>
                                                  {({ active }) => (
                                                    <Link
                                                      href={`../assets/${
                                                        record.asset_code
                                                          ? record.pkid
                                                          : record.model_pkid
                                                      }/maintenance-log`}
                                                      className={`${
                                                        active
                                                          ? 'bg-gray-100'
                                                          : 'text-gray-900'
                                                      } flex items-center rounded-xl px-2 py-2 text-sm`}
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
                                                        handleDeleteRow(
                                                          record.pkid as number,
                                                        );
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
                                            {/* {action?.includes('A') && (
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
                                                        handleApproveRow(
                                                          (customDetailPath
                                                            ? record[
                                                                customDetailPath
                                                              ]
                                                            : record.pkid) as number,
                                                        );
                                                      }}
                                                    >
                                                      <IconChecks className='h-4.5 w-4.5 text-slate-600' />
                                                    </button>
                                                  )}
                                                </Menu.Item>
                                                <Tooltip
                                                  id='my-tooltip-delete'
                                                  content='Approve'
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
                                            )} */}
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
                                                        handleDownloadRow?.(
                                                          record.pkid as number,
                                                        ); // Call handleDownloadRow
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
          totalRecords={pagination?.count} // Use pagination count if available
          recordsPerPage={pagination?.per_page || pageSize} // Use pagination per_page if available
          page={pagination?.page || page} // Use pagination page if available
          fetching={isLoading}
          onPageChange={handlePageChange}
          recordsPerPageOptions={PAGE_SIZES}
          onRecordsPerPageChange={handlePageSizeChange}
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

export default RenderDataTable;
