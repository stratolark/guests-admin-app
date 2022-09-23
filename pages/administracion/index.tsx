import Spinner from '@/components/Spinner';
import { type TitleWithIconProps } from '@/components/TitleWithIcon';

import {
  AuthAction,
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
} from 'next-firebase-auth';
import Head from 'next/head';
import { FunctionComponent, useEffect, useState } from 'react';
import Admin from '../../components/Pages/administracion/_components/Admin';

function Administracion({ authUser }: { authUser: any }) {
  type TitlesSettingsProps = {
    roles: TitleWithIconProps;
    // piezas: TitleWithIconProps;
    // arrendatarios: TitleWithIconProps;
    // finanzas: TitleWithIconProps;
    repartos: TitleWithIconProps;
  };

  const titleSettingsProps: TitlesSettingsProps = {
    roles: {
      icon: 'wrench2',
      title: 'Roles de Usuarios',
      order: 2,
      className: 'text-lg',
    },
    // piezas: {
    //   icon: 'dooropen',
    //   title: 'Piezas',
    //   order: 2,
    //   className: 'text-lg',
    // },
    // arrendatarios: {
    //   icon: 'user',
    //   title: 'Arrendatarios',
    //   order: 2,
    //   className: 'text-lg',
    // },
    // finanzas: {
    //   icon: 'money',
    //   title: 'Finanzas',
    //   order: 2,
    //   className: 'text-lg',
    // },
    repartos: {
      icon: 'userpart',
      title: 'Repartos Mensuales',
      order: 2,
      className: 'text-lg',
    },
  };

  const AuthUser = useAuthUser();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <div className='page-container'>
      <Head>
        <title>Administración - Pensión</title>
      </Head>
      {isLoading && AuthUser?.email === null && <Spinner />}
      {!isLoading && AuthUser?.email !== null && (
        <>
          <h1 className='page-title'>Administración</h1>
          <Admin
            titleSettingsProps={titleSettingsProps}
            authUser={JSON.parse(authUser)}
          />
        </>
      )}
    </div>
  );
}
export const getServerSideProps = withAuthUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ AuthUser }) => {
  if (!AuthUser.claims.admin && !AuthUser.emailVerified) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  const authUser = JSON.stringify(AuthUser);
  return {
    props: {
      authUser,
    },
  };
});

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  LoaderComponent: Spinner as FunctionComponent,
})(Administracion);
