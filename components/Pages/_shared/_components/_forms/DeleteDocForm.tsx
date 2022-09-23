import { Button, LoadingOverlay, Modal, TextInput } from '@mantine/core';
import Router from 'next/router';
import { DeleteDoc } from '@/components/Pages/_shared/firebase';
import {
  CollectionName,
  DeleteFormRedirects,
  NotificationSubject,
} from '@/components/Pages/_shared/_types/types';

import { useState } from 'react';
import { AlertCircle, AlertTriangle, X } from 'tabler-icons-react';

type DeleteDocFormProps = {
  deleteDataFrom: {
    title: string;
    desc: string;
    notificationSubject: NotificationSubject;
    redirectTo?: DeleteFormRedirects;
  };
  opened: any;
  setOpened: any;
  collectionName: CollectionName;
  docKey: string;
  onSubmit?: () => void;
};

export default function DeleteDocForm({
  deleteDataFrom,
  opened,
  setOpened,
  collectionName,
  docKey,
  onSubmit,
}: DeleteDocFormProps) {
  const [deleteValue, setDeleteValue] = useState('');
  const [visible, setVisible] = useState(false);
  return (
    <Modal
      opened={opened}
      onClose={() => setOpened()}
      title={`Eliminar Datos de ${deleteDataFrom.title}`}
    >
      <LoadingOverlay visible={visible} />
      <p>
        ¿Estas seguro que deseas eliminar los datos {deleteDataFrom.desc}{' '}
        actual? Esta acción es destructiva y NO puede ser revertida.
      </p>
      <div>
        <p className='font-bold pt-6 pb-3'>
          Para continuar con la eliminación de datos por favor escribe a
          continuación: &apos;Si, Quiero&apos;
        </p>
        <TextInput
          // data-autofocus
          icon={<AlertTriangle size={16} />}
          placeholder='Si, quiero'
          value={deleteValue}
          onChange={(event) => setDeleteValue(event.currentTarget.value)}
        />
      </div>
      <div className='pt-8 flex justify-end'>
        <Button onClick={() => setOpened()} variant='outline' className='mr-3'>
          No, no los borres
        </Button>
        <Button
          type='submit'
          disabled={deleteValue !== 'Si, Quiero'}
          onClick={() => {
            setVisible((v) => !v);
            onSubmit?.();
            setTimeout(() => {
              setVisible((v) => !v);
              DeleteDoc(
                <AlertCircle size={18} />,
                <X size={18} />,
                deleteDataFrom.notificationSubject,
                collectionName,
                docKey
              );
              if (
                Router.asPath !== '/finanzas/gastos' &&
                Router.asPath !== '/finanzas/ingresos'
              ) {
                Router.push(deleteDataFrom.redirectTo ?? Router.asPath);
              }
              setOpened();
            }, 1200);
          }}
          color='red'
        >
          Borrar Datos
        </Button>
      </div>
    </Modal>
  );
}
