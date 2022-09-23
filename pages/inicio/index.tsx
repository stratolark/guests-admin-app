import Spinner from '@/components/Spinner';
import {
  withAuthUser,
  withAuthUserTokenSSR,
  AuthAction,
  useAuthUser,
} from 'next-firebase-auth';
import { FunctionComponent, useEffect, useState } from 'react';
import Head from 'next/head';
import QuickStart from '@/components/Pages/_shared/_components/QuickStart';
import { startLinks } from '@/components/Pages/_shared/_data/quickStartLinks';
import {
  collection,
  doc,
  FirestoreError,
  getFirestore,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';
import PensionSummary from '@/components/Pages/inicio/_components/PensionSummary';
import { month } from '@/data/months';
import { FinancesProps } from '@/components/Pages/finanzas/_types/types';

function Index() {
  const AuthUser = useAuthUser();
  const [isLoading, setLoading] = useState(true);
  const [financeErrors, setFinanceErrors] = useState<FirestoreError>();
  const [financeData, setFinanceData] = useState<FinancesProps | undefined>();
  const [roomErrors, setRoomErrors] = useState<FirestoreError>();
  const [roomLength, setRoomLength] = useState<number>(0);
  const [renterErrors, setRenterErrors] = useState<FirestoreError>();
  const [renterLength, setRenterLength] = useState<number>(0);

  // FINANCE COLLECTION get Finances data for current Month-Year
  useEffect(() => {
    const documentName = `${
      month[new Date().getMonth()]
    }-${new Date().getFullYear()}`;
    const q = doc(getFirestore(), 'Finances', documentName);

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        setFinanceData(querySnapshot.data() as FinancesProps);
        setLoading(false);
      },
      (error) => {
        console.log('Error getting rooms documents: ', error);
        setFinanceErrors(error);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);
  // ROOMS COLLECTION length
  useEffect(() => {
    const q = query(
      collection(getFirestore(), 'rooms'),
      where('isRented', '==', 'Sí')
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        setRoomLength(querySnapshot.docs.length);
        setLoading(false);
      },
      (error) => {
        console.log('Error getting renters documents: ', error);
        setRoomErrors(error);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  // TODO: make this into a hook
  // RENTERS COLLECTION length
  useEffect(() => {
    const q = query(
      collection(getFirestore(), 'renters'),
      where('rentStatus', '==', 'activo')
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        setRenterLength(querySnapshot.docs.length);
        setLoading(false);
      },
      (error) => {
        console.log('Error getting renters documents: ', error);
        setRenterErrors(error);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  if (financeErrors || roomErrors || renterErrors) {
    console.log('financeErrors', financeErrors);
    console.log('roomErrors', roomErrors);
    console.log('renterErrors', renterErrors);
  }

  return (
    <div className='page-container'>
      <Head>
        <title>Inicio - Pensión</title>
      </Head>
      {isLoading && AuthUser?.email === null && <Spinner />}
      {!isLoading && AuthUser?.email !== null && (
        <div>
          <div>
            <h2 className='page-title'>Resumen</h2>
            <PensionSummary
              isLoading={isLoading}
              roomLength={roomLength}
              financeData={financeData}
              renterLength={renterLength}
            />
          </div>
          <div className='pb-4'>
            <QuickStart links={startLinks} />
          </div>
        </div>
      )}
    </div>
  );
}

// Note that this is a higher-order function.
// therefore, nextjs will throw a Fast Refresh Warning
export const getServerSideProps = withAuthUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})();

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  LoaderComponent: Spinner as FunctionComponent,
})(Index);
