import { DataTable } from 'mantine-datatable';

import { JobOrderDetailProperty } from '@/helpers/utils/manufacturing/job_order_detail';
import { MachineProperty } from '@/helpers/utils/manufacturing/machine';
import { ManProperty } from '@/helpers/utils/manufacturing/man';
import { OperationProperty } from '@/helpers/utils/manufacturing/operation';
import { WorkCentreProperty } from '@/helpers/utils/manufacturing/work_centre';

interface RoutingDetail {
  data: JobOrderDetailProperty[];
}

interface RowData {
  Operation: OperationProperty;
  Machine: MachineProperty;
  ManSkill: ManProperty;
  WorkCentre: WorkCentreProperty;
}

const JobOrderDetailComponent = ({ data }: RoutingDetail) => {
  const cols = [
    { accessor: 'pkid', title: 'ID' },
    {
      accessor: 'Operation.name',
      title: 'Nama Operasi',
      render: (row: RowData) => row.Operation.name,
    },
    { accessor: 'item_pkid', title: 'Nama Item' },
    { accessor: 'quantity', title: 'Kuantitas' },
    {
      accessor: 'Machine.name',
      title: 'Nama Mesin',
      render: (row: RowData) => row.Machine.description,
    },
    { accessor: 'machine_hour', title: 'Durasi Pengerjaan' },
    {
      accessor: 'ManSkill.name',
      title: 'Nama Skill',
      render: (row: RowData) => row.ManSkill.skill,
    },
    { accessor: 'man_skill_quantity', title: 'Jumlah Pekerja' },
    {
      accessor: 'WorkCentre.name',
      title: 'Work Centre',
      render: (row: RowData) => row.WorkCentre.name,
    },
    { accessor: 'progress', title: 'Status' },
  ];
  return (
    <div className='panel border-white-light h-full px-0'>
      <div className='p-5'>
        <div className='space-y-5'>
          <div>
            <div className='datatables'>
              <DataTable
                records={data as unknown as RowData[]}
                className='table-hover whitespace-nowrap'
                columns={cols}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobOrderDetailComponent;
