import Icon from '@/icons/Icon';
import Link from 'next/link';
import { RoomProps } from '../_types/types';

export default function RoomCard({
  room,
  ...rest
}: {
  room: RoomProps;
  [x: string]: any;
}) {
  return (
    <div {...rest}>
      <div>
        <Link href={`/piezas/${room?.id}`}>
          <a
            title='Ver Detalles'
            className={`group py-5 px-6 flex flex-wrap rounded-md ${
              room?.isRented === 'Sí'
                ? 'bg-white hover:bg-blue-100'
                : 'bg-neutral-200/50 hover:bg-neutral-300/50 opacity-90'
            }`}
          >
            <div className='pb-1.5 flex items-center w-full'>
              <div className='flex-1 flex items-center'>
                <Icon
                  kind={room?.isRented === 'Sí' ? 'roomrented' : 'door'}
                  divCss='pr-3'
                  svgCss='h-4 w-4'
                />
                <h3
                  className={`text-base uppercase font-bold ${
                    room?.isRoomAvailable === 'No' ? `line-through` : ''
                  }`}
                >
                  Pieza {room?.id}
                </h3>
              </div>
              <div className='flex flex-wrap justify-end'>
                <div
                  className={`w-full font-bold ${
                    room?.isRoomAvailable === 'No' ? `line-through` : ''
                  }`}
                >
                  {new Intl.NumberFormat('es-CL', {
                    style: 'currency',
                    currency: 'CLP',
                  }).format(room?.monthlyPayment)}
                </div>
              </div>
            </div>
            <div className='w-full flex justify-between'>
              <div className='w-full flex flex-wrap'>
                <span className='w-full text-sm text-neutral-500'>
                  {room?.isRoomAvailable === 'Sí' && (
                    <>
                      {room?.isRented === 'Sí' && 'Arrendada a'}
                      {room?.isRented === 'No' && 'Vacante'}
                    </>
                  )}
                  {room?.isRoomAvailable === 'No' && 'Pieza No Disponible'}
                </span>
                {room?.isRented === 'Sí' && (
                  <div className='flex-initial'>
                    <div className=' font-bold'>{room?.assignRenter}</div>
                  </div>
                )}
              </div>
            </div>
            <div className='mt-8 mb-2 w-full h-full'>
              <span className='w-full text-sm group-hover:underline text-blue-500'>
                Ver Detalles
              </span>
            </div>
          </a>
        </Link>
      </div>
    </div>
  );
}
