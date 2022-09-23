import { Back } from '@/components/Back';
import Spinner from '@/components/Spinner';
import {
  collection,
  type FirestoreError,
  getFirestore,
  onSnapshot,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import {
  AuthAction,
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
} from 'next-firebase-auth';
import Head from 'next/head';
import { useRouter } from 'next/router';
import PageError from '@/components/Pages/_shared/_components/PageError';
import { FunctionComponent, useEffect, useState } from 'react';
import Slug from '@/components/Pages/arrendatarios/_components/Slug';
import { RenterProps } from '@/components/Pages/arrendatarios/_types/types';

function SlugRoute() {
  const AuthUser = useAuthUser();
  const router = useRouter();
  const { slug } = router.query;

  const collectionName = 'renters';

  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<FirestoreError>();
  const [doc, setDoc] = useState<RenterProps>();
  const [renterPayments, setRenterPayments] = useState<any>();

  useEffect(() => {
    const q = query(
      collection(getFirestore(), collectionName),
      where('id', '==', Number(slug))
    );
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const docs = querySnapshot?.docs?.map((doc1) => {
          return (
            {
              ...(doc1?.data() as RenterProps),
              key: doc1?.id,
            } ?? []
          );
        });
        setDoc(docs[0]);
        setIsLoading(false);
      },
      (error) => {
        setDoc([] as any);
        console.log('Error getting documents: ', error);
        setErrors(error);
        setIsLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const q = query(
      collection(getFirestore(), 'payments'),
      where('addedByItemValueID', '==', Number(slug)),
      orderBy('created_at', 'desc')
    );
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const paymentDocs = querySnapshot?.docs?.map((doc1) => {
          return (
            {
              ...(doc1?.data() as any),
              key: doc1?.id,
            } ?? []
          );
        });
        setRenterPayments(paymentDocs);
      },
      (error) => {
        setRenterPayments([]);
        console.log('Error getting PAYMENTS documents: ', error);
      }
    );
    return () => {
      unsubscribe();
    };
  }, []);

  const pageTitle = `Arrendatario Nº ${doc?.id || ''} - Pensión`;

  return (
    <div className='page-container'>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      {isLoading && AuthUser?.email === null && errors === undefined && (
        <Spinner />
      )}
      {!isLoading && AuthUser?.email !== null && errors === undefined && (
        <>
          <Back link='/arrendatarios' title='Arrendatarios' />
          <Slug userData={doc} renterDocs={renterPayments} />
        </>
      )}
      {!isLoading && AuthUser?.email !== null && errors !== undefined && (
        <PageError />
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
})(SlugRoute);
