import { FixedButton } from '@/components/FixedButton';
import { month } from '@/data/months';
import { Space } from '@mantine/core';
import dayjs from 'dayjs';
import {
  doc,
  FirestoreError,
  getFirestore,
  onSnapshot,
} from 'firebase/firestore';
import {
  AuthAction,
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
} from 'next-firebase-auth';
import Head from 'next/head';
import QuickStart from '@/components/Pages/_shared/_components/QuickStart';
import { financeLinks } from '@/components/Pages/_shared/_data/quickStartLinks';
import { FunctionComponent, useEffect, useState } from 'react';
import FinanceModal from '../../components/Pages/finanzas/_components/FinanceModal';
import MonthlyFinances from '../../components/Pages/finanzas/_components/MonthlyFinances';
import MonthSelector from '../../components/Pages/finanzas/_components/MonthSelector';
import Splits from '../../components/Pages/finanzas/_components/Splits';
import Spinner from '@/components/Spinner';

const COLLECTIONS_FINANCES = 'Finances';

function Finanzas() {
  const AuthUser = useAuthUser();
  const [opened, setOpened] = useState(false);
  const [openMonthPicker, setOpenMonthPicker] = useState(false);
  const [selectedDate, onSelectedDateChange] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [monthFinances, setMonthFinances] = useState<any>([]);
  const [errors, setErrors] = useState<FirestoreError>();

  useEffect(() => {
    const currentMonthDoc = `${month[dayjs(selectedDate).month()]}-${dayjs(
      selectedDate
    ).year()}`;
    const db = getFirestore();
    const unsubscribe = onSnapshot(
      doc(db, COLLECTIONS_FINANCES, currentMonthDoc),
      (querySnapshot) => {
        const financesData = querySnapshot?.data();
        setMonthFinances({
          payments: financesData?.payments ?? 0,
          expenses: financesData?.expenses ?? 0,
          // parenthesis are needed to avoid error
          finances:
            (financesData?.payments ?? 0) - (financesData?.expenses ?? 0),
          last_updated_at: financesData?.last_updated_at,
        });
        setLoading(false);
      },
      (error) => {
        console.log('Error getting documents: ', error);
        setErrors(error);
        setLoading(false);
        console.log(errors);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [selectedDate]);

  return (
    <div className='page-container'>
      <Head>
        <title>Finanzas - Pensión</title>
      </Head>
      <h1 className='page-title'>Finanzas</h1>
      <MonthSelector
        openMonthPicker={openMonthPicker}
        setOpenMonthPicker={setOpenMonthPicker}
        selectedMonth={selectedDate}
        onMonthChange={onSelectedDateChange}
      />
      <MonthlyFinances isLoading={loading} currentFinances={monthFinances} />
      <Splits currentFinances={monthFinances} isLoading={loading} />
      <Space h={36} />
      <QuickStart links={financeLinks} />
      <Space h={60} />
      {(AuthUser?.claims?.admin || AuthUser?.claims?.manager) &&
        AuthUser?.emailVerified && (
          <>
            <FinanceModal open={opened} setOpen={setOpened} />
            <FixedButton
              text='Añadir Gasto o Pago'
              onClick={() => setOpened(true)}
            />
          </>
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
})(Finanzas);
