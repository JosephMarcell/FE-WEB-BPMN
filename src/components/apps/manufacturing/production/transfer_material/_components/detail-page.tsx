import { DataTable } from 'mantine-datatable';
import Swal from 'sweetalert2';

import { useGetProductionOrderByPkid } from '@/app/api/hooks/manufacturing/production_order/useGetProductionOrderByPkid';
import { useApproveTransferMaterial } from '@/app/api/hooks/manufacturing/transfer_material/useApproveTransferMaterial';
import { WorkflowStatus } from '@/helpers/utils/global/listStatus';
import { TransferMaterialProperty } from '@/helpers/utils/manufacturing/transfer_material';

interface TransferMaterialDetail {
  data: TransferMaterialProperty[];
  refetch: () => void;
}

const TransferMaterialDetailComponent = ({
  data,
  refetch,
}: TransferMaterialDetail) => {
  const { data: productionOrderDetail } = useGetProductionOrderByPkid(
    data[0].production_order_pkid ?? 0,
  );
  const { mutateAsync: approveTransferMaterial } = useApproveTransferMaterial();

  const handleApproveTransferMaterial = async (pkid: number) => {
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
          await approveTransferMaterial(pkid);
          Swal.fire(
            'Saved!',
            'Your production request has been saved.',
            'success',
          ).then(() => {
            refetch();
          });
        } catch (error) {
          Swal.fire('Error!', 'Something went wrong', 'error');
        }
      }
    });
  };
  return (
    <div className='panel border-white-light h-full px-0'>
      <div className='p-5'>
        <div className='space-y-5'>
          <div>
            <label htmlFor='item_pkid'>
              Production Order Code<span style={{ color: 'red' }}>*</span>
            </label>
            <input
              id='skill'
              name='skill'
              type='text'
              placeholder='Nama Skill'
              className='form-input'
              value={productionOrderDetail?.code || ''}
              disabled
            />
          </div>
          <div className=''>
            <DataTable
              className='table-hover whitespace-nowrap'
              records={data.map(item => ({
                ...item,
              }))}
              columns={[
                { title: 'ID', accessor: 'pkid' },
                { title: 'Item Name', accessor: 'item_pkid' },
                { title: 'Quantity', accessor: 'quantity' },
                {
                  title: 'Status',
                  accessor: 'status',
                  render: (row: TransferMaterialProperty) => (
                    <span
                      className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 bg-${
                        WorkflowStatus.find(x => x.value === row.status)?.color
                      }-100 text-${
                        WorkflowStatus.find(x => x.value === row.status)?.color
                      }-800`}
                    >
                      <div className='flex items-center justify-center'>
                        <div
                          className='mr-2 h-3 w-3 rounded-full'
                          style={{
                            backgroundColor: WorkflowStatus.find(
                              x => x.value === row.status,
                            )?.color,
                          }}
                        />
                        {
                          WorkflowStatus.find(x => x.value === row.status)
                            ?.label
                        }
                      </div>
                    </span>
                  ),
                },
                {
                  accessor: 'action',
                  render: (record: TransferMaterialProperty, index: number) => (
                    <div
                      className='flex items-center justify-center'
                      key={index}
                    >
                      <button
                        className='btn btn-sm btn-primary'
                        onClick={() =>
                          handleApproveTransferMaterial(record.pkid ?? 0)
                        }
                        disabled={record.status === 'approved'}
                      >
                        Approve
                      </button>
                    </div>
                  ),
                },
              ]}
              highlightOnHover
              noRecordsText='No records found'
              minHeight={400}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransferMaterialDetailComponent;
