import { Back } from '@/components/Back';
import Spinner from '@/components/Spinner';
import {
  collection,
  type FirestoreError,
  getFirestore,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';
import {
  AuthAction,
  withAuthUser,
  withAuthUserTokenSSR,
} from 'next-firebase-auth';
import Head from 'next/head';
import { useRouter } from 'next/router';
import PageError from '@/components/Pages/_shared/_components/PageError';
import { FunctionComponent, useEffect, useState } from 'react';
import Slug from '../../components/Pages/piezas/_components/Slug';
import { RoomProps } from '@/components/Pages/piezas/_types/types';

function SlugRoute() {
  const router = useRouter();
  const { slug } = router.query;

  const collectionName = 'rooms';

  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<FirestoreError>();
  const [doc, setDoc] = useState<RoomProps>();

  useEffect(() => {
    const db = getFirestore();

    const q = query(
      collection(db, collectionName),
      where('id', '==', Number(slug))
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const docs = querySnapshot?.docs?.map((doc1) => {
          return { ...(doc1?.data() as RoomProps), key: doc1?.id } || [];
        });
        setDoc(docs[0] || []);
        setIsLoading(false);
      },
      (error) => {
        console.log('Error getting documents: ', error);
        setErrors(error);
        setIsLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  if (errors) {
    console.log('errors:', errors);
  }
  const pageTitle = `Pieza ${doc?.id || ''} - Pensión`;
  return (
    <div className='page-container'>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <Back link='/piezas' title='Piezas' />
      {isLoading && <Spinner />}
      {errors && <PageError />}
      {!isLoading && !errors && <Slug roomData={doc as RoomProps} />}
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
})(SlugRoute);
