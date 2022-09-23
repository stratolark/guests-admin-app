import ReceiptsPageTemplate from '@/components/Pages/finanzas/_templates/ReceiptsPageTemplate';
import Spinner from '@/components/Spinner';
import {
  AuthAction,
  withAuthUser,
  withAuthUserTokenSSR,
} from 'next-firebase-auth';
import { FunctionComponent } from 'react';

const COLLECTION_NAME = 'expenses';
const EXPENSE_TITLES = {
  title: 'Gastos',
  singular: 'gasto',
  plural: 'gastos',
};
function Gastos() {
  return (
    <ReceiptsPageTemplate
      type='Gastos'
      collectionName={COLLECTION_NAME}
      receiptTitles={EXPENSE_TITLES}
    />
  );
}
export const getServerSideProps = withAuthUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})();

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  LoaderComponent: Spinner as FunctionComponent,
})(Gastos);
