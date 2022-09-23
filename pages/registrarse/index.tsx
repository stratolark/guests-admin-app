import Spinner from '@/components/Spinner';
import {
  AuthAction,
  withAuthUser,
  withAuthUserTokenSSR,
} from 'next-firebase-auth';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FunctionComponent } from 'react';
import { AlertCircle, Login } from 'tabler-icons-react';

function Registrarse() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Registro - Pensión</title>
      </Head>
      <div className='py-12 px-8 text-center'>
        <div className='flex justify-center py-4'>
          <AlertCircle size={48} strokeWidth={2} color={'black'} />
        </div>
        <div>
          Lo sentimos, el registro de nuevas cuentas no está disponible en este
          momento.
        </div>
        <div className='pt-8 flex items-center justify-center'>
          <button
            type='button'
            onClick={() => router.push('/')}
            className='btn-primary py-2.5 px-5 !rounded-full flex items-center justify-center'
          >
            <Login size={20} strokeWidth={2} className='mr-3' />
            <div>Ir a Inicio de sesión</div>
          </button>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = withAuthUserTokenSSR({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
})();

export default withAuthUser({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
  whenAuthedBeforeRedirect: AuthAction.SHOW_LOADER,
  // whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  // whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  LoaderComponent: Spinner as FunctionComponent,
})(Registrarse);
