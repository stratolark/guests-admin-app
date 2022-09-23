import { useAuthUser } from 'next-firebase-auth';
import { useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { Button } from '@mantine/core';
import RegisterUserCard from './RegisterUserCard';
import { UserRecord } from 'firebase-admin/lib/auth/user-record';

interface UserListDTO extends AxiosResponse {
  data: {
    data: UserRecord[];
  };
}

export default function AddAdmin({ authUser }) {
  const [isListLoading, setIsListLoading] = useState(false);
  const [usersList, setUsersList] = useState<UserRecord[] | null>();
  const [errorFetchingUser, setErrorFetchingUsers] = useState(false);

  const AuthUser = useAuthUser();

  const userRoles = ['manager', 'user'];

  if (authUser.claims.admin) {
    userRoles.unshift('admin');
  }

  const GET_ALL_USERS_ENDPOINT = 'api/listusers';

  async function getAllUsers() {
    setIsListLoading(true);

    try {
      const token = await AuthUser.getIdToken();
      const response: UserListDTO = await axios.get(GET_ALL_USERS_ENDPOINT, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('response', response);
      setUsersList(response.data.data);
      setIsListLoading(false);
    } catch (error) {
      // console.error('error', error);
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
      setErrorFetchingUsers(true);
      setIsListLoading(false);
    }
  }

  // console.log('usersList', usersList);

  return (
    <div className='mt-6 mb-12'>
      <div>
        <p>
          Para cambiar el rol de un usuario primero debes obtener la lista de
          usuarios, y luego cambiar el Rol Actual en el menu. Finalmente debes
          guardar los datos.
        </p>
      </div>

      <div className='mt-6'>
        <Button loading={isListLoading} onClick={() => getAllUsers()}>
          Obtener Lista de Usuarios
        </Button>
      </div>
      {usersList && !isListLoading ? (
        <section className='mt-12'>
          {usersList && usersList.length > 0 && (
            <>
              <div className='font-bold'>
                Usuarios Registrados: {usersList.length}
              </div>
              {usersList.map((user) => (
                <RegisterUserCard
                  key={user.uid}
                  authUser={authUser}
                  user={user}
                  roleData={userRoles}
                />
              ))}
            </>
          )}
        </section>
      ) : null}
      {errorFetchingUser && !usersList && !isListLoading ? (
        <div className='mt-4 font-bold text-red-500'>
          Ocurrió un error al obtener la lista de usuarios. Por favor inténtalo
          de nuevo más tarde.
        </div>
      ) : null}
    </div>
  );
}
