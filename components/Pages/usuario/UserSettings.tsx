import ChangePasswordForm from '@/components/Pages/usuario/_components/_forms/ChangePasswordForm';
import ChangeUserInfoForm from '@/components/Pages/usuario/_components/_forms/ChangeUserInfoForm';
import { Avatar, Button, Modal, Spoiler } from '@mantine/core';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
dayjs.extend(LocalizedFormat);
import 'dayjs/locale/es';
import { useAuthUser } from 'next-firebase-auth';
import { CircleCheck, Clock, X } from 'tabler-icons-react';
import { MutableRefObject, useEffect, useRef, useState } from 'react';
import ChangeProfilePictureModal from './_components/_modals/ChangeProfilePictureModal';
import { DeleteStorageObj, UpdateUserProfile } from '../_shared/firebase';
import { reload, User } from 'firebase/auth';
import ChangeUserEmailForm from './_components/_forms/ChangeUserEmailForm';

export default function UserSettings() {
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | string>('');
  const [openDeleteConfirmModal, setOpenDeleteConfirmModal] = useState(false);
  const AuthUser = useAuthUser();

  const userData = {
    imageUrl: AuthUser?.photoURL || '#',
    fullName: AuthUser?.displayName || AuthUser?.email?.split('@')[0],
    email: AuthUser?.email,
    password: '',
    role:
      (AuthUser?.claims?.admin && 'Admin') ||
      (AuthUser?.claims?.manager && 'Propietario') ||
      'Usuario',
  };
  const inputAvatarRef = useRef<HTMLInputElement>();
  function handleAvatarChange(e: any) {
    if (e.currentTarget.files[0] === undefined) {
      setSelectedFile('');
    }
    setSelectedFile(e.currentTarget.files[0]);
    if (
      e.currentTarget.files[0] !== undefined &&
      e.currentTarget.files[0] !== null
    ) {
      setOpenModal(true);
    }
  }

  async function handleAvatarDelete() {
    if (AuthUser?.photoURL !== null) {
      await DeleteStorageObj(AuthUser?.photoURL);
      console.log('Current photoURL has been deleted.');

      await UpdateUserProfile(AuthUser, { photoURL: '' });
      await reload(AuthUser?.firebaseUser as User);
    }
    setOpenDeleteConfirmModal(false);
  }

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <>
      <section className='pb-8'>
        <div className='p-1.5 bg-white rounded-md'>
          <div className='pt-6 pb-4 h-full flex justify-center items-center self-center flex-col'>
            <Avatar
              src={AuthUser?.photoURL ?? ''}
              radius='xl'
              size={100}
              alt='User Photo'
            />
            <div className='pt-2'>
              <input
                ref={inputAvatarRef as MutableRefObject<HTMLInputElement>}
                type='file'
                accept='image/jpeg,image/png,image/webp'
                className='hidden'
                onChange={(e) => handleAvatarChange(e)}
                onClick={(e) => {
                  e.currentTarget.value = '';
                }}
              />
              <button
                onClick={() => inputAvatarRef?.current?.click()}
                type='button'
                className='underline cursor-pointer text-sm'
              >
                Cambiar foto
              </button>
              {AuthUser?.photoURL !== '' && AuthUser?.photoURL !== null && (
                <>
                  <span className='mr-2 ml-3'>-</span>
                  <button
                    onClick={() => setOpenDeleteConfirmModal(true)}
                    type='button'
                    className='underline cursor-pointer text-xs text-red-400'
                  >
                    <X size={12} className='inline mr-1' />
                    Remover foto
                  </button>
                </>
              )}
              <Modal
                opened={openDeleteConfirmModal}
                onClose={() => setOpenDeleteConfirmModal(false)}
                title='Confimar remover foto de perfil'
              >
                ¿Estas seguro que quieres remover tu foto de perfil?
                <div className='pt-8 flex justify-end'>
                  <Button
                    type='button'
                    variant='outline'
                    className='mr-3'
                    onClick={() => setOpenDeleteConfirmModal(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type='button'
                    className='!bg-red-500 hover:!bg-red-600'
                    onClick={() => handleAvatarDelete()}
                  >
                    Remover foto
                  </Button>
                </div>
              </Modal>
            </div>
            {/* TODO: add failure/success alert */}
            <ChangeProfilePictureModal
              authUser={AuthUser}
              selectedFile={selectedFile ?? []}
              setSelectedFile={setSelectedFile}
              open={openModal}
              setOpen={setOpenModal}
            />
          </div>
          <div className='py-2 px-4'>
            <p className='text-center text-xs uppercase'>{userData?.role}</p>
            <h3 className='text-center font-bold text-xl'>
              {userData?.fullName}
            </h3>
            <p className='text-center text-neutral-400'>{userData?.email}</p>
          </div>
          <div className='pt-2 pb-4 flex justify-center items-center'>
            {AuthUser?.emailVerified ? (
              <>
                <div className='mr-2'>Email Verificado</div>
                <CircleCheck color='teal' />
              </>
            ) : (
              <>
                <div className='mr-2'>Email No Verificado</div>
              </>
            )}
          </div>
          <Spoiler
            classNames={{
              root: 'text-center mb-3',
              content: 'my-2',
              control: '!py-2',
            }}
            maxHeight={0}
            hideLabel='Ver menos datos'
            showLabel='Ver más datos'
          >
            <div className='pb-4 flex flex-wrap justify-center items-center'>
              <span className='flex items-center text-sm text-neutral-500'>
                <Clock color='gray' size={15} className='inline-flex mr-1.5' />
                Fecha de creación:
              </span>
              {!loading && (
                <span>
                  {dayjs(AuthUser?.firebaseUser?.metadata?.creationTime)
                    .locale('es')
                    .format('LLLL')}
                </span>
              )}
            </div>
          </Spoiler>
        </div>
      </section>
      <section className='pb-10'>
        <div>
          <h2 className='text-lg font-bold pb-3'>Cambiar Nombre</h2>
          <div>
            <ChangeUserInfoForm authUser={AuthUser} />
          </div>
        </div>
      </section>
      <section className='pb-10'>
        <div>
          <h2 className='text-lg font-bold pb-3'>Cambiar Email</h2>
          <div>
            <ChangeUserEmailForm authUser={AuthUser} />
          </div>
        </div>
      </section>
      <section className='pb-16'>
        <div>
          <h2 className='text-lg font-bold pb-3'>Cambiar Contraseña</h2>
          <div>
            <ChangePasswordForm authUser={AuthUser} />
          </div>
        </div>
      </section>
    </>
  );
}
