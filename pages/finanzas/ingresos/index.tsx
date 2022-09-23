import ReceiptsPageTemplate from '@/components/Pages/finanzas/_templates/ReceiptsPageTemplate';
import Spinner from '@/components/Spinner';
import {
  AuthAction,
  withAuthUser,
  withAuthUserTokenSSR,
} from 'next-firebase-auth';
import { FunctionComponent } from 'react';

const COLLECTION_NAME = 'payments';
const PAYMENT_TITLES = {
  title: 'Pagos (Ingresos)',
  singular: 'pago (ingreso)',
  plural: 'pagos (ingresos)',
};
function Pagos() {
  return (
    <ReceiptsPageTemplate
      type='Pagos (Ingresos)'
      collectionName={COLLECTION_NAME}
      receiptTitles={PAYMENT_TITLES}
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
})(Pagos);
