import { Alert, Button, NumberInput } from '@mantine/core';
import {
  collection,
  type FirestoreError,
  getFirestore,
  query,
  onSnapshot,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { CircleCheck, CircleX } from 'tabler-icons-react';
import { SetDocField } from '../../_shared/firebase';

const COLLECTION_NAME = 'settings';
const DOCUMENT_NAME = 'config';

export default function SplitsMenu() {
  const [initialSplitsSettings, setInitialSplitsSettings] = useState(3);
  const [splitsInputValue, setSplitsInputValue] = useState<number | undefined>(
    3
  );
  const [splitsSuccess, setSplitsSuccess] = useState(false);
  const [splitsError, setSplitsError] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<FirestoreError>();

  useEffect(() => {
    const db = getFirestore();
    const q = query(collection(db, COLLECTION_NAME));
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const docs = querySnapshot?.docs?.map((doc1) => {
          return (
            {
              ...(doc1?.data() as any), // {splits: number, key: string}
              key: doc1?.id,
            } ?? []
          );
        });
        setInitialSplitsSettings(docs[0]?.splits);
        setSplitsInputValue(docs[0]?.splits);
        setIsLoading(false);
      },
      (error) => {
        console.log(`Error getting documents: `, error);
        setErrors(error);
        setIsLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  async function handleSlitsEdit() {
    try {
      setIsLoading(true);
      setSplitsError(false);
      await SetDocField(
        { splits: splitsInputValue },
        COLLECTION_NAME,
        DOCUMENT_NAME
      );
      setSplitsSuccess(true);
      console.log('Splits updated successfully');
      setIsLoading(false);
    } catch (error) {
      setSplitsSuccess(false);
      setSplitsError(true);
      setErrors(error);
      console.log(error);
      setIsLoading(false);
    }
  }
  if (errors) console.log('errors');
  return (
    <div className='mt-4 mb-12'>
      <p>
        Aquí puedes ajustar el número de repartos de las ganancias mensuales en
        Finanzas. Elige entre 1 y 10 repartos. Y luego presiona guardar.
      </p>
      {splitsSuccess && !splitsError && (
        <Alert
          icon={<CircleCheck size={16} />}
          title='Éxito!'
          color='teal'
          withCloseButton
          variant='filled'
          classNames={{ root: 'mt-4 mb-4' }}
          onClose={() => setSplitsSuccess(false)}
        >
          Se ha cambiado el número de Repartos.
        </Alert>
      )}
      {splitsError && !splitsSuccess && (
        <Alert
          icon={<CircleX size={16} />}
          title='Error!'
          color='red'
          withCloseButton
          variant='filled'
          classNames={{ root: 'mt-4 mb-4' }}
          onClose={() => setSplitsError(false)}
        >
          Ha ocurrido un error al cambiar número de Repartos. Por favor,
          inténtalo de nuevo más tarde.
        </Alert>
      )}
      <div>
        <NumberInput
          disabled={isLoading}
          value={splitsInputValue}
          onChange={(val) => setSplitsInputValue(val)}
          mt={18}
          defaultValue={initialSplitsSettings}
          max={10}
          min={1}
          description='Elige entre 1 y 10 repartos. 3 Repartos por defecto.'
          label={`Cantidad de Repartos en Finanzas: ${
            !isLoading && initialSplitsSettings !== undefined
              ? initialSplitsSettings + ` Actual`
              : 'Sin Configurar'
          }`}
        />
        <Button
          mt={18}
          loading={isLoading}
          disabled={initialSplitsSettings === splitsInputValue}
          onClick={() => handleSlitsEdit()}
        >
          Guardar
        </Button>
      </div>
    </div>
  );
}
