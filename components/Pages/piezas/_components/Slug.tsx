import { Button } from '@mantine/core';
import { useAuthUser } from 'next-firebase-auth';
import RenterCard from '@/components/Pages/arrendatarios/_components/RenterCard';
import DeleteDocForm from '@/components/Pages/_shared/_components/_forms/DeleteDocForm';
import { useState } from 'react';
import { AlertTriangle, Edit } from 'tabler-icons-react';
import { RoomProps } from '../_types/types';
import RoomForm from './_forms/RoomForm';
import Services from './Room/Services';
import Status, {
  FieldsProps,
} from '../../arrendatarios/_components/Renter/Status';
import RoomProfile from './Room/RoomProfile';
import { UpdateDocField } from '../../_shared/firebase';
import { RenterProps } from '../../arrendatarios/_types/types';

type SlugProps = {
  roomData: RoomProps;
};

export default function Slug({ roomData }: SlugProps) {
  const AuthUser = useAuthUser();
  const [opened, setOpened] = useState(false);
  const [openDeleteForm, setOpenDeleteForm] = useState(false);

  const roomProfile = {
    id: roomData?.id,
    renter:
      roomData?.assignRenter !== ''
        ? roomData?.assignRenter
        : 'Sin arrendatario asignado',
  };

  const roomStatus: FieldsProps[] = [
    {
      icon: 'dooropen',
      name: 'Estado',
      value: roomData?.isRented === 'Sí' ? 'Arrendada' : 'Vacante',
    },
    {
      icon: 'money',
      name: 'Valor Mensual',
      value:
        new Intl.NumberFormat('es-CL', {
          style: 'currency',
          currency: 'CLP',
        }).format(roomData?.monthlyPayment || 0) || 'Pago No Configurado',
    },
    {
      icon: 'bathroom',
      name: 'Baño',
      value:
        roomData?.hasBathroom === 'Sí'
          ? (roomData?.bathroomType as string)
          : 'Sin Baño Asignado',
    },
  ];

  return (
    <div>
      <div className='mt-4 py-2.5 mb-3 flex items-center justify-between'>
        <div className='flex items-center'>
          <h2 className='font-bold text-xl'>Datos</h2>
        </div>
        {(AuthUser?.claims?.admin || AuthUser?.claims?.manager) &&
          AuthUser?.emailVerified && (
            <>
              <div>
                <Button
                  onClick={() => setOpened(true)}
                  classNames={{
                    root: '!bg-blue-500 hover:!bg-blue-600',
                  }}
                  rightIcon={<Edit size={18} />}
                >
                  Editar
                </Button>
              </div>
              <RoomForm
                opened={opened}
                setOpened={() => setOpened(false)}
                roomData={roomData}
                type='edit'
              />
            </>
          )}
      </div>
      <section className='mb-6'>
        {roomData?.isRoomAvailable === 'No' && (
          <div className='bg-white text-center font-bold rounded-md p-4 my-2'>
            <AlertTriangle size={18} className='inline' /> !Pieza no habilitada
            para arrendar!
          </div>
        )}
        <div>
          <RoomProfile roomProfile={roomProfile} />
        </div>
      </section>
      <section className='mb-6'>
        <h2 className='font-bold text-lg mb-4'>Detalles de Pieza:</h2>
        <Status statusFields={roomStatus} />
      </section>
      <section className='mb-6'>
        <h2 className='font-bold text-lg mb-4'>
          Servicios: ({roomData?.services?.length})
        </h2>
        <Services roomData={roomData} />
      </section>
      <section className='mb-6'>
        <h2 className='font-bold text-lg mb-4'>Datos de Arrendataria(o):</h2>
        <div className='flex gap-2.5 flex-wrap'>
          {(roomData?.assignRenter !== '' || undefined || null) && roomData && (
            <RenterCard
              renter={roomData?.assignRenterData as any}
              key={roomData?.key}
              className='w-full'
            />
          )}
          {roomData?.assignRenter === '' && (
            <div className='text-center w-full bg-white rounded-md py-3 px-5 font-bold'>
              Sin Arrendatario Asignado
            </div>
          )}
        </div>
      </section>
      {AuthUser?.claims?.admin && AuthUser?.emailVerified && (
        <section>
          <h2 className='font-bold pb-3'>Opciones:</h2>
          <Button
            onClick={() => setOpenDeleteForm(true)}
            leftIcon={<AlertTriangle size={16} />}
            classNames={{
              root: 'mb-12 !bg-red-500 hover:!bg-red-600',
            }}
            color='red'
          >
            Eliminar Datos
          </Button>
          <DeleteDocForm
            // TODO: update renter if room is deleted and viceversa
            deleteDataFrom={{
              title: 'Pieza',
              desc: 'de la pieza',
              notificationSubject: 'Pieza',
              redirectTo: '/piezas',
            }}
            collectionName='rooms'
            onSubmit={async () => {
              if (roomData?.assignRenter !== '') {
                try {
                  await UpdateDocField<Partial<RenterProps>>(
                    {
                      rentStatus: 'inactivo',
                      room: ``,
                      roomValue: 0,
                    },
                    'renters',
                    roomData?.assignRenterData?.key
                  );
                  console.log('Renter updated');
                } catch (error) {
                  console.log(error);
                  return error;
                }
              }
            }}
            docKey={roomData?.key as string}
            opened={openDeleteForm}
            setOpened={() => setOpenDeleteForm(false)}
          />
        </section>
      )}
    </div>
  );
}
