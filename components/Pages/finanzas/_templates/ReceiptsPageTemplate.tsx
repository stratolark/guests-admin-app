import { Back } from '@/components/Back';
import { FinanceProps } from '@/components/Pages/finanzas/_types/types';
import Spinner from '@/components/Spinner';
import { Button } from '@mantine/core';
import {
  collection,
  FirestoreError,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { MoodSad } from 'tabler-icons-react';
import ReceiptPage from '../_components/ReceiptPage';

type ReceiptPageTemplateProps = {
  type: 'Gastos' | 'Pagos (Ingresos)';
  collectionName: string;
  receiptTitles: {
    title: string;
    singular: string;
    plural: string;
  };
};

export default function ReceiptsPageTemplate({
  type,
  collectionName,
  receiptTitles,
}: ReceiptPageTemplateProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<FirestoreError>();
  const [receiptsDocs, setReceiptsDocs] = useState<FinanceProps[]>([]);

  useEffect(() => {
    const db = getFirestore();
    const q = query(
      collection(db, collectionName),
      orderBy('addedByDate', 'desc')
    );
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const docs = querySnapshot?.docs?.map((doc1) => {
          return (
            {
              ...(doc1?.data() as FinanceProps),
              key: doc1?.id,
            } || []
          );
        });
        setReceiptsDocs(docs || []);
        setIsLoading(false);
      },
      (error) => {
        console.log(`Error getting documents for ${type}: `, error);
        setErrors(error);
        setIsLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className='page-container'>
      <Head>
        <title>{type} - Finanzas / Pensión</title>
      </Head>
      <Back link='/finanzas' title='Finanzas' />
      <h1 className='font-bold text-xl py-4'>{type}</h1>
      {!!isLoading && <Spinner />}
      {!isLoading && receiptsDocs?.length > 0 && errors !== null && (
        <ReceiptPage financialDocs={receiptsDocs} pageTitles={receiptTitles} />
      )}
      {!isLoading && receiptsDocs?.length === 0 && errors !== null && (
        <div className='w-full text-center my-5'>
          Aún no hay datos registrados. Intenta agregar uno nuevo en la página
          de Finanzas.
        </div>
      )}
      {!isLoading && receiptsDocs?.length === 0 && errors && (
        <div className='grid my-8'>
          <div className='flex items-center justify-center my-8'>
            <MoodSad size={62} strokeWidth={1.5} className='text-gray-500' />
          </div>
          <p className='mb-7 text-lg font-bold text-center text-gray-500'>
            Ha ocurrido un error cargando los datos. Por Inténtalo de nuevo.
          </p>
          <Button
            classNames={{
              root: '!my-6',
            }}
            onClick={() => window.location.reload()}
          >
            Volver a intentar
          </Button>
        </div>
      )}
    </div>
  );
}
