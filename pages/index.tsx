import { Login } from '@/components/Forms/Login';
import Spinner from '@/components/Spinner';

import {
  AuthAction,
  withAuthUser,
  withAuthUserTokenSSR,
} from 'next-firebase-auth';
import Head from 'next/head';
import { FunctionComponent } from 'react';

function Index() {
  return (
    <section className='h-full flex'>
      <Head>
        <title>Pensión</title>
      </Head>
      <Login />
    </section>
  );
}
export const getServerSideProps = withAuthUserTokenSSR({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
})();

export default withAuthUser({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.RENDER,
  LoaderComponent: Spinner as FunctionComponent,
})(Index);
