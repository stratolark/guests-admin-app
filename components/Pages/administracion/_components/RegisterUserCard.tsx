import { Alert, Avatar, Button, NativeSelect } from '@mantine/core';
import { UserRecord } from 'firebase-admin/lib/auth/user-record';
import { AuthUserContext, useAuthUser } from 'next-firebase-auth';
import { useState } from 'react';
import { CircleCheck, CircleX } from 'tabler-icons-react';
import { setAdminWithCredentials } from '../../_shared/http';

type RegisterUserCardProps = {
  authUser: AuthUserContext;
  user: UserRecord;
  roleData: string[];
};

function getUserRole(claims: any) {
  if (claims?.admin) {
    return 'admin';
  }
  if (claims?.manager) {
    return 'manager';
  }
  return 'user';
}

export default function RegisterUserCard({
  authUser,
  user,
  roleData,
}: RegisterUserCardProps) {
  const clientAuthUser = useAuthUser();
  const isAdminAuth = authUser?.email === user?.email;

  const [initialUserRole, setInitialUserRole] = useState(
    getUserRole(user.customClaims)
  );

  const [roleSelectValue, setRoleSelectValue] = useState(initialUserRole);

  const [userEmail, setUserMail] = useState('');

  const [isUpdatingRole, setIsUpdatingRole] = useState(false);

  const [credentialsSuccess, setCredentialsSuccess] = useState(false);
  const [credentialsError, setCredentialsError] = useState(false);

  async function handleAddAdmin() {
    try {
      setCredentialsError(false);
      setIsUpdatingRole(true);

      const newUserRole = await setAdminWithCredentials(
        clientAuthUser,
        authUser,
        {
          user: userEmail,
          role: {
            [roleSelectValue]: true,
          },
        }
      );

      const responseUserRole = getUserRole(newUserRole?.data?.response);

      setInitialUserRole(responseUserRole);
      setRoleSelectValue(responseUserRole);
      setCredentialsSuccess(true);
      setIsUpdatingRole(false);
    } catch (error) {
      setIsUpdatingRole(false);
      setCredentialsSuccess(false);
      setCredentialsError(true);

      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
      console.log(error.config);
    }
  }

  const isSaveButtonDisabled =
    isAdminAuth || roleSelectValue === initialUserRole;

  return (
    <div
      className={`my-4 bg-white rounded p-5 ${
        isAdminAuth && !credentialsSuccess && !credentialsError
          ? 'outline outline-1 outline-blue-500'
          : ''
      } ${isUpdatingRole ? 'opacity-50' : ''} ${
        !isSaveButtonDisabled && !credentialsSuccess && !credentialsError
          ? 'outline-dashed outline-1 outline-slate-500'
          : ''
      } ${
        credentialsSuccess && !credentialsError
          ? 'outline outline-1 outline-green-500'
          : ''
      } ${
        credentialsError && !credentialsSuccess
          ? 'outline outline-1 outline-rose-500'
          : ''
      }`}
    >
      {credentialsSuccess && !credentialsError && (
        <Alert
          icon={<CircleCheck size={16} />}
          title='Éxito!'
          color='teal'
          withCloseButton
          variant='filled'
          classNames={{ root: 'mt-4 mb-4' }}
          onClose={() => setCredentialsSuccess(false)}
        >
          Se ha cambiado el rol de: {userEmail} a {initialUserRole}
        </Alert>
      )}
      {credentialsError && !credentialsSuccess && (
        <Alert
          icon={<CircleX size={16} />}
          title='Error!'
          color='red'
          withCloseButton
          variant='filled'
          classNames={{ root: 'mt-4 mb-4' }}
          onClose={() => setCredentialsError(false)}
        >
          Ha ocurrido un error al cambiar el rol de: {userEmail} a{' '}
          {initialUserRole}. Por favor, inténtalo de nuevo más tarde.
        </Alert>
      )}
      {isAdminAuth && (
        <div className='text-center'>
          <span className='font-bold text-blue-400'>Usuario Actual</span>
        </div>
      )}
      <div className='py-4'>
        <div className='pb-8 flex items-center justify-center'>
          <Avatar
            size='xl'
            src={user?.photoURL}
            alt={`${user?.displayName?.trim()}'s photo.`}
          />
        </div>
        <div className='flex items-center justify-between'>
          <p className='font-bold w-1/2'>Nombre:</p>
          <p className='w-1/2 text-right'>
            {user?.displayName ? user.displayName : 'Sin nombre'}
          </p>
        </div>
        <div className='flex items-center justify-between'>
          <p className='font-bold w-1/2'>Email:</p>
          <p className='w-1/2 text-right'>
            {user?.email ?? 'Email No Disponible'}
          </p>
        </div>
        <div className='flex items-center justify-between'>
          <p className='font-bold w-1/2'>Email Verificado:</p>
          <p className='w-1/2 text-right'>
            {user?.emailVerified ? 'Sí' : 'No'}
          </p>
        </div>
        <div className='pt-4 flex items-center justify-between'>
          <p className='font-bold w-1/2'>Rol Actual:</p>
          <NativeSelect
            disabled={isAdminAuth}
            value={roleSelectValue}
            onChange={(event) => {
              if (credentialsError || credentialsSuccess) {
                setCredentialsSuccess(false);
                setCredentialsError(false);
              }
              setRoleSelectValue(event.currentTarget.value);
              setUserMail(user.email as string);
            }}
            data={roleData}
          />
        </div>
      </div>
      <div className='mt-5 flex justify-end'>
        <Button
          loading={isUpdatingRole}
          disabled={isSaveButtonDisabled}
          onClick={() => handleAddAdmin()}
        >
          Guardar Cambios
        </Button>
      </div>
    </div>
  );
}
