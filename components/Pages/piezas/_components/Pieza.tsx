import { FixedButton } from '@/components/FixedButton';
import { stableSortDesc2 } from '@/lib/utils/sortDesc';
import { useAuthUser } from 'next-firebase-auth';
import Head from 'next/head';
import { useState } from 'react';
import { type RoomProps } from '../_types/types';
import RoomCard from './RoomCard';
import RoomForm from './_forms/RoomForm';

type PiezaProps = {
  roomsList: any;
  latestRoomID: number;
};

export default function Pieza({ roomsList, latestRoomID }: PiezaProps) {
  const AuthUser = useAuthUser();
  const [opened, setOpened] = useState(false);
  const sortedRentedRooms = stableSortDesc2(roomsList, 'isRented');
  return (
    <div className='page-container'>
      <Head>
        <title>Piezas - Pensión</title>
      </Head>
      <h1 className='page-title'>Piezas</h1>
      <div className='h-full'>
        <h2 className='pb-6'>
          <span className='font-bold pr-3'>Lista de Piezas:</span>
          <span className='text-sm italic text-neutral-400'>
            {roomsList?.length !== 0 ? roomsList?.length : '0'}{' '}
            {roomsList?.length > 1 ? 'piezas' : 'pieza'}
          </span>
        </h2>
        <div className='flex flex-wrap pb-6'>
          {roomsList?.length !== 0 &&
            sortedRentedRooms?.map((room: RoomProps) => (
              <RoomCard
                room={room}
                key={`${room.id}-${room.number}-${room.created_at}`}
                className='mb-4 w-full'
              />
            ))}
          {roomsList?.length === 0 && (
            <>
              <div className='pt-12 flex items-center justify-center'>
                <p className='text-center'>
                  Aún no haz añadido ninguna Pieza. Intenta haciendo click al
                  botón &apos;Añadir Pieza&apos;. O contacta a un administrador.
                </p>
              </div>
            </>
          )}
          {roomsList?.length !== 0 && (
            <div className='w-full flex items-center justify-center pt-2 pb-6 text-sm italic text-neutral-400'>
              Fin de Lista
            </div>
          )}
        </div>
        {AuthUser?.claims?.admin && AuthUser?.emailVerified && (
          <>
            <div>
              <RoomForm
                opened={opened}
                setOpened={() => setOpened(false)}
                type='add'
                latestRoomID={latestRoomID}
                roomData={roomsList}
              />
            </div>
            <FixedButton text='Añadir Pieza' onClick={() => setOpened(true)} />
          </>
        )}
      </div>
    </div>
  );
}
