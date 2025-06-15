import Skeleton from '@/components/Skeleton';

const LoadingDetailPage = () => {
  return (
    <div className='panel border-white-light h-full px-0'>
      <div className='mb-5 flex flex-col gap-5 px-5 md:flex-row md:items-center'>
        <div className='w-full space-y-4'>
          <div className='flex justify-center'>
            <Skeleton className='h-12 w-1/2' />
          </div>
          <Skeleton className='h-12 w-full' />
          <Skeleton className='h-12 w-full' />
          <Skeleton className='h-12 w-full' />
          <Skeleton className='h-12 w-full' />
          <Skeleton className='h-12 w-full' />
          <Skeleton className='h-12 w-full' />
          <Skeleton className='h-12 w-full' />
          <Skeleton className='h-12 w-full' />
          <Skeleton className='h-12 w-full' />
          <Skeleton className='h-12 w-full' />
        </div>
      </div>
    </div>
  );
};

export default LoadingDetailPage;
