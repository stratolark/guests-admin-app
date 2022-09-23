import UserSettings from '@/components/Pages/usuario/UserSettings';
import Spinner from '@/components/Spinner';
import {
  AuthAction,
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
} from 'next-firebase-auth';
import Head from 'next/head';
import { FunctionComponent } from 'react';

function Usuario() {
  const authUser = useAuthUser();
  return (
    <div className='page-container'>
      <Head>
        <title>Usuario - Pensión</title>
      </Head>
      {authUser?.email !== null ? (
        <>
          <h1 className='page-title'>Perfil de Usuario</h1>
          <UserSettings />
        </>
      ) : (
        <Spinner />
      )}
    </div>
  );
}

export const getServerSideProps = withAuthUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})();

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  LoaderComponent: Spinner as FunctionComponent,
})(Usuario);
