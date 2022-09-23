import { useRouter } from 'next/router';
import { AlertCircle, Refresh } from 'tabler-icons-react';

export default function PageError() {
  const router = useRouter();

  return (
    <div className='py-12 px-8 text-center'>
      <div className='flex justify-center py-4'>
        <AlertCircle size={48} strokeWidth={2} color={'black'} />
      </div>
      <div>
        Lo sentimos ha ocurrido un error. Por favor actualiza la página o
        inténtalo de nuevo más tarde.
      </div>
      <div className='pt-8 flex items-center justify-center'>
        <button
          type='button'
          onClick={() => router.reload()}
          className='btn-primary py-2.5 px-5 !rounded-full flex items-center justify-center'
        >
          <Refresh size={20} strokeWidth={2} className='mr-3' />
          <div>Reintentar</div>
        </button>
      </div>
    </div>
  );
}
