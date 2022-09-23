import Icon from '@/icons/Icon';
import Link from 'next/link';
import { Hash } from 'tabler-icons-react';

type RenterCardProps = {
  renter: {
    firstName: string;
    lastName: string;
    id: number;
    room: string;
    rentStatus: string;
    roomValue?: number;
  };
  [x: string]: any;
};
export default function RenterCard({ renter, ...rest }: RenterCardProps) {
  return (
    <div {...rest}>
      <Link href={`/arrendatarios/${renter?.id}`}>
        <a
          title='Ver Detalles'
          className='group mb-4 py-5 px-6 flex flex-wrap bg-white hover:bg-blue-100 rounded-md'
        >
          <div className='text-neutral-500 w-full flex item-center justify-between mb-1.5'>
            <Icon
              kind='renter'
              divCss='flex items-center'
              svgCss='h-[1.15rem] w-[1.15rem]'
            />
            <div className='flex items-center'>
              <Hash size={14} className='mr-1' />
              <span className='font-medium text-sm'>{renter?.id}</span>
            </div>
          </div>
          <div className='flex w-full'>
            <div className='w-10/12 flex items-center'>
              <span className='font-bold'>
                {renter?.firstName} {renter?.lastName}
              </span>
            </div>
          </div>
          <div>
            <div className='grid gap-1'>
              <span className=''>
                {renter?.rentStatus === 'activo' && <>{renter?.room} </>}
              </span>
              <span className='text-neutral-500 text-sm'>
                {renter?.roomValue && renter?.roomValue > 0
                  ? `${new Intl.NumberFormat('es-CL', {
                      style: 'currency',
                      currency: 'CLP',
                    }).format(renter?.roomValue)} pesos al mes`
                  : ''}
              </span>
            </div>
            <div className='mt-6 text-blue-600 group-hover:underline text-sm'>
              Ver Detalles
            </div>
          </div>
        </a>
      </Link>
    </div>
  );
}
