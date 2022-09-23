import {
  AuthAction,
  withAuthUser,
  withAuthUserTokenSSR,
} from 'next-firebase-auth';
import Head from 'next/head';
import { FunctionComponent, useEffect, useState } from 'react';
import Arrendatario from '@/components/Pages/arrendatarios/_components/Arrendatario';
import {
  collection,
  FirestoreError,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import Spinner from '@/components/Spinner';
import PageError from '@/components/Pages/_shared/_components/PageError';
import { RenterProps } from '@/components/Pages/arrendatarios/_types/types';

function Arrendatarios() {
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<FirestoreError | null>(null);
  const [renterList, setRenterList] = useState<RenterProps[]>([]);
  const [latestRenterID, setLatestRenterID] = useState(1);

  const collectionName = 'renters';
  useEffect(() => {
    const db = getFirestore();
    const q = query(
      collection(db, collectionName),
      orderBy('id', 'desc')
      // limit(100)
    );
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const docs = querySnapshot?.docs?.map((doc1) => {
          return (
            {
              ...(doc1?.data() as RenterProps),
              key: doc1?.id,
            } || []
          );
        });
        setLatestRenterID(querySnapshot?.docs?.length === 0 ? 0 : docs[0]?.id);
        setRenterList(docs);
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

  const renterListLength = renterList?.length === 0 ? 1 : latestRenterID + 1;

  return (
    <div className='page-container'>
      <Head>
        <title>Arrendatarios - Pensión</title>
      </Head>
      {isLoading && <Spinner />}
      {errors && <PageError />}
      {!isLoading && !errors && (
        <Arrendatario
          renterList={renterList}
          renterListLength={renterListLength}
        />
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
})(Arrendatarios);
