import { WorkCentreProperty } from '@/helpers/utils/manufacturing/work_centre';
interface WorkCentreDetail {
  data: WorkCentreProperty;
}
const WorkCentreDetailComponent = ({ data }: WorkCentreDetail) => {
  return (
    <div className='panel border-white-light h-full px-0'>
      <div className='p-5'>
        <div className='space-y-5'>
          <div>
            <label htmlFor='name'>
              Nama Kategori<span style={{ color: 'red' }}>*</span>
            </label>
            <input
              id='name'
              name='name'
              type='text'
              placeholder='Nama Work Centre'
              className='form-input'
              value={data.name || ''}
              disabled
            />
          </div>
          <div>
            <label htmlFor='location'>
              Lokasi<span style={{ color: 'red' }}>*</span>
            </label>
            <input
              id='location'
              name='location'
              type='text'
              placeholder='Lokasi Work Centre'
              className='form-input'
              value={data.location || ''}
              disabled
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkCentreDetailComponent;
