import { type Icons } from '@/icons/Icon';
import { Button } from '@mantine/core';
import 'dayjs/locale/es';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
dayjs.extend(localizedFormat);
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
dayjs.extend(isSameOrBefore);
import { useState } from 'react';
import { AlertTriangle, Edit } from 'tabler-icons-react';
import RenterForm from './_forms/RenterForm';
import DeleteDocForm from '../../_shared/_components/_forms/DeleteDocForm';
import { useAuthUser } from 'next-firebase-auth';
import Profile from './Renter/Profile';
import Status from './Renter/Status';
import Payments from './Renter/Payments';
import { GetDocs, UpdateDocField } from '../../_shared/firebase';
import { RoomProps } from '../../piezas/_types/types';

// TODO: add DTOs
type SlugProps = {
  userData: any;
  renterDocs: any[];
};

type FieldsProps = {
  icon: Icons;
  name: string;
  value: string | number;
};

export default function Slug({ userData, renterDocs }: SlugProps) {
  const [opened, setOpened] = useState(false);
  const [openDeleteForm, setOpenDeleteForm] = useState(false);
  const AuthUser = useAuthUser();

  const isRenterActive =
    userData?.rentStatus !== 'inactivo'
      ? dayjs(new Date(userData?.rentStart?.seconds * 1000)).isSameOrBefore(
          new Date(userData?.rentEnd?.seconds * 1000)
        )
      : false;

  const rentFieldsData: FieldsProps[] = [
    {
      icon: 'door',
      name: 'Pieza Arrendada',
      value: userData?.room === '' ? 'Sin Asignar' : userData?.room,
    },
    {
      icon: 'money',
      name: 'Pago Mensual',
      value:
        userData?.roomValue > 0
          ? new Intl.NumberFormat('es-CL', {
              style: 'currency',
              currency: 'CLP',
            }).format(userData?.roomValue) + ' pesos'
          : 'No Especificado',
    },
    {
      icon: 'calendar',
      name: 'Inicio de Arriendo',
      value: dayjs(new Date(userData?.rentStart?.seconds * 1000))
        .locale('es')
        .format('LLLL'),
    },

    {
      icon: 'time',
      name: 'Fin de Arriendo',
      value: isRenterActive
        ? 'Aún Arrienda'
        : dayjs(new Date(userData?.rentEnd?.seconds * 1000))
            .locale('es')
            .format('LLLL'),
    },
  ];

  return (
    <div>
      <section className='py-6'>
        <div className='mb-6'>
          <div className='pb-6 flex justify-between items-center'>
            <h1 className='text-xl font-bold'>Datos</h1>
            {(AuthUser?.claims?.admin || AuthUser?.claims?.manager) &&
              AuthUser?.emailVerified && (
                <>
                  <div>
                    <Button
                      onClick={() => setOpened(true)}
                      rightIcon={<Edit size={18} />}
                      classNames={{ root: '!bg-blue-500 hover:!bg-blue-600' }}
                    >
                      Editar
                    </Button>
                  </div>
                  <RenterForm
                    opened={opened}
                    setOpened={() => setOpened(false)}
                    userData={userData}
                    type='edit'
                  />
                </>
              )}
          </div>
          <Profile
            renter={`${userData?.firstName} ${userData?.lastName}`}
            renterId={userData?.id || '0'}
            renterRUT={userData?.rut === '' ? 'No Informado' : userData?.rut}
            renterEmail={userData?.email || 'No Informado'}
            renterPhone={
              userData?.phone === '' ? 'No Informado' : userData?.phone
            }
          />
        </div>
        <div className='w-full mb-6'>
          <h1 className='text-xl font-bold pb-4'>Estado de Arriendo</h1>
          <Status statusFields={rentFieldsData} />
        </div>
        <div className='w-full'>
          <h1 className='text-xl font-bold pb-4'>Historial de Pagos</h1>
          <Payments paymentDocs={renterDocs} />
        </div>
      </section>
      {AuthUser?.claims?.admin && AuthUser?.emailVerified && (
        <section className='mt-4'>
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
            onSubmit={async () => {
              if (userData?.room !== '') {
                try {
                  const rooms: RoomProps[] = await GetDocs<RoomProps>('rooms');
                  const selectedRoomData = rooms?.filter(
                    (val) => `Pieza ${val.id}` === userData?.room
                  );
                  await UpdateDocField<Partial<RoomProps>>(
                    {
                      assignRenter: '',
                      isRented: 'No',
                      assignRenterData: {
                        firstName: '',
                        lastName: '',
                        id: 0,
                        rentStatus: 'inactivo',
                        room: '',
                        roomValue: 0,
                      },
                    },
                    'rooms',
                    selectedRoomData[0]?.key
                  );
                  console.log('Room Updated');
                } catch (error) {
                  console.log(error);
                }
              }
            }}
            deleteDataFrom={{
              title: 'Arrendatario',
              desc: 'del arrendatario',
              notificationSubject: 'Arrendatario',
              redirectTo: '/arrendatarios',
            }}
            collectionName='renters'
            docKey={userData?.key}
            opened={openDeleteForm}
            setOpened={() => setOpenDeleteForm(false)}
          />
        </section>
      )}
    </div>
  );
}
