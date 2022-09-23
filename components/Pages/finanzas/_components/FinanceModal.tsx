import { Button, Group, LoadingOverlay, Modal } from '@mantine/core';
import { nanoid } from 'nanoid';
import { useForm } from '@mantine/form';
import dayjs from 'dayjs';
import { FirestoreError, increment, serverTimestamp } from 'firebase/firestore';

import { useAuthUser } from 'next-firebase-auth';
import {
  AddDoc,
  GetDocs,
  getStorageDownloadURL,
  SetDocField,
  UploadImageToStorage,
} from '@/components/Pages/_shared/firebase';
import { useEffect, useState } from 'react';
import { Check, X } from 'tabler-icons-react';
import { FinanceFormConfigProps, NextStep } from '../_types/types';
import ChooseRecurrent from './ChooseRecurrent';
import { expenseConfig, paymentConfig } from './_data/config';
import FinanceForm from './_forms/FinanceForm';
import TypeBtn from './_forms/TypeBtn';
import { month } from '@/data/months';
import { RenterProps } from '../../arrendatarios/_types/types';
import { FileProps } from '../../_shared/_components/_forms/CustomDropzone';

export default function FinanceModal({ open, setOpen }) {
  const AuthUser = useAuthUser();

  const [hasOverlay, setHasOverlay] = useState(false);
  const [errors, setErrors] = useState<FirestoreError>();
  const [docsList, setDocsList] = useState<RenterProps[]>();
  const [modalTitle, setModalTitle] = useState('Elige que Añadir');
  const [hasChosenType, setHasChosenType] = useState<
    'payment' | 'expense' | 'none'
  >('none');
  const [recurrentNextStep, setRecurrentNextStep] = useState<NextStep>('none');

  const [itemName, setItemName] = useState('');
  const [categoryItemValue, setCategoryItemValue] = useState('');
  const [addedByItemValue, setAddedByItemValue] = useState('');
  const [addedBySelectItems, setAddedBySelectItems] = useState<any>([]);
  const [itemAmmount, setItemAmmount] = useState(0);
  const [addedByDate, setAddedByDate] = useState(new Date());
  const [notesValue, setNotesValue] = useState('');

  const categoryItemsData = [
    {
      value: 'other',
      label: 'Otros',
    },
  ];

  if (hasChosenType === 'payment') {
    categoryItemsData.unshift({
      value: 'renting',
      label: 'Arriendo',
    });
  }

  if (hasChosenType === 'payment' && categoryItemValue === 'renting') {
    categoryItemsData.pop();
  }

  if (hasChosenType === 'payment' && categoryItemValue === 'other') {
    categoryItemsData.shift();
  }

  if (hasChosenType === 'expense') {
    categoryItemsData.unshift(
      {
        value: 'service',
        label: 'Servicios',
      },
      {
        value: 'maintenance',
        label: 'Mantención',
      }
    );
  }
  const addedByItemsData = [
    {
      value: 'admin@admin.user',
      label: 'admin@admin.user',
    },
  ];

  useEffect(() => {
    let _ignore = false;
    async function getRenters() {
      try {
        const renters = await GetDocs<RenterProps>('renters');
        setDocsList(renters[0]?.id ? renters : []);
      } catch (error) {
        console.log(error);
        setErrors(error);
      }
    }
    getRenters();
    return () => {
      _ignore = true;
    };
  }, [
    hasChosenType === 'payment' && recurrentNextStep === 'renterMonthlyPayment',
  ]);

  useEffect(() => {
    const rentersListData = docsList?.map((renter: RenterProps) => ({
      avatarColor: `${renter.rentStatus === 'activo' ? 'teal' : 'gray'}`,
      value: `${renter.firstName} ${renter.lastName} - ${renter.email} - ${
        renter.rentStatus === 'activo' ? renter.room : 'Sin Pieza'
      }`,
      label: `${renter.firstName} ${renter.lastName} - ${
        renter.rentStatus === 'activo' ? renter.room : 'Sin Pieza'
      }`,
      description: `${renter.email}`,
      group: `${
        renter.rentStatus[0].toUpperCase() + renter.rentStatus.substring(1)
      } ${renter.rentStatus === 'activo' ? '(Arrendatarios)' : ''}`,
    }));

    if (
      hasChosenType === 'payment' &&
      recurrentNextStep === 'renterMonthlyPayment'
    ) {
      setAddedBySelectItems(rentersListData);
    }
    if (hasChosenType === 'payment' && recurrentNextStep === 'customPayment') {
      setAddedBySelectItems(addedByItemsData);
    }
    if (
      hasChosenType === 'expense' &&
      recurrentNextStep !== 'renterMonthlyPayment'
    ) {
      setAddedBySelectItems(addedByItemsData);
    }

    if (errors) console.log('errors', errors);
  }, [errors, docsList, hasChosenType, recurrentNextStep]);

  const formConfig: FinanceFormConfigProps = {
    payment: {
      initialValues: {
        type: 'payment',
        categoryItemValue: categoryItemValue,
        addedByItemValue: addedByItemValue,
        itemName: itemName,
        itemAmmount: itemAmmount,
        addedByDate: addedByDate,
        notesValue: notesValue,
      },
      firestoreFn: AddDoc,
      collectionName: 'payments',
    },
    expense: {
      initialValues: {
        type: 'expense',
        categoryItemValue: categoryItemValue,
        addedByItemValue: addedByItemValue,
        itemName: itemName,
        itemAmmount: itemAmmount,
        addedByDate: addedByDate,
        notesValue: notesValue,
      },
      firestoreFn: AddDoc,
      collectionName: 'expenses',
    },
    none: {
      initialValues: {
        type: 'none',
        categoryItemValue: '',
        addedByItemValue: '',
        itemName: '',
        itemAmmount: 0,
        addedByDate: new Date(),
        notesValue: '',
      },
      firestoreFn: AddDoc,
      collectionName: 'payments',
    },
  };

  const form = useForm({
    initialValues: formConfig[hasChosenType].initialValues,
    validate: {
      itemName: (value) =>
        value === ''
          ? 'El nombre del servicio o mantención no puede estar vacío.'
          : null,
      addedByItemValue: (value) =>
        value === '' ? 'Este campo no puede estar vacío.' : null,

      itemAmmount: (value) =>
        isNaN(value)
          ? 'Debes ingregar un monto válido y mayor o igual a cero.'
          : null,
      addedByDate: (value) =>
        value === null || undefined ? 'Este campo no puede estar vacío.' : null,
    },
  });
  useEffect(() => {
    form.setFieldValue('type', hasChosenType);
  }, [hasChosenType]);

  // DEFAULT values
  useEffect(() => {
    form.setFieldValue('itemName', itemName);
    form.setFieldValue('categoryItemValue', categoryItemValue);
    // TODO: get current sign in uer as addedByItemValue
    // get all registered user with a certain role, and he compare them to the current AuthUser.email, if the match then preselect them
    form.setFieldValue('addedByItemValue', addedByItemValue);
    form.setFieldValue('itemAmmount', itemAmmount);
    form.setFieldValue('addedByDate', addedByDate);
    form.setFieldValue('notesValue', notesValue);
  }, [
    recurrentNextStep,
    itemName,
    categoryItemValue,
    addedByItemValue,
    itemAmmount,
    addedByDate,
    notesValue,
  ]);
  // PRESET values
  useEffect(() => {
    if (recurrentNextStep === 'renterMonthlyPayment') {
      setItemName('Pago Mensual Arrendatario');
      setCategoryItemValue('renting');
      setNotesValue('Recurrente - Mensual');
    }
  }, [recurrentNextStep]);
  useEffect(() => {
    if (recurrentNextStep === 'internetBill') {
      setItemName('Internet');
      setCategoryItemValue('service');
      setNotesValue('Recurrente - Mensual');
    }
  }, [recurrentNextStep]);
  useEffect(() => {
    if (recurrentNextStep === 'electricityBill') {
      setItemName('Electricidad');
      setCategoryItemValue('service');
      setNotesValue(
        'Recurrente - Varía de acuerdo a uso y número de arrendatarios.'
      );
    }
  }, [recurrentNextStep]);

  useEffect(() => {
    if (recurrentNextStep === 'waterBill') {
      setItemName('Agua');
      setCategoryItemValue('service');
      setNotesValue(
        'Recurrente - Varía de acuerdo a uso y número de arrendatarios.'
      );
    }
  }, [recurrentNextStep]);

  useEffect(() => {
    if (recurrentNextStep === 'gasBill') {
      setItemName('Gas Licuado');
      setCategoryItemValue('service');
      setNotesValue('Recurrente - Varios tanques de gas.');
    }
  }, [recurrentNextStep]);

  useEffect(() => {
    if (recurrentNextStep === 'maintenanceBill') {
      setItemName('Mantención');
      setCategoryItemValue('maintenance');
      // setCategoryItemIcon('toolbox');
    }
  }, [recurrentNextStep]);
  useEffect(() => {
    if (recurrentNextStep === 'customPayment') {
      setItemName('');
      setCategoryItemValue('other');
    }
  }, [recurrentNextStep]);
  useEffect(() => {
    if (recurrentNextStep === 'customExpense') {
      setItemName('');
      setCategoryItemValue('other');
    }
  }, [recurrentNextStep]);
  useEffect(() => {
    if (recurrentNextStep !== 'none') {
      setModalTitle('Añadir Detalles');
    }
  }, [recurrentNextStep]);

  const [filesPreview, setFilesPreview] = useState<FileProps[] | []>([]);

  function handleFormReset() {
    setItemAmmount(0);
    setAddedByItemValue('');
    setAddedByDate(new Date());
    setNotesValue('');
    setAddedBySelectItems([]);
    setHasChosenType('none');
    setHasChosenType('none');
    setFilesPreview([]);
  }

  return (
    <Modal
      overflow='outside'
      opened={open}
      onClose={() => {
        setOpen(false);
        setHasChosenType('none');
        setModalTitle('Elige que Añadir');
        setRecurrentNextStep('none');
        handleFormReset();
      }}
      title={modalTitle}
    >
      <form
        onSubmit={form.onSubmit(async (values) => {
          setHasOverlay((v) => !v);

          const addedByItemValueID = (docsList as RenterProps[]).filter(
            (val) =>
              `${val.firstName} ${val.lastName}` ===
              form.values.addedByItemValue.split(' - ')[0]
          );

          const newImages = Promise.all(
            filesPreview.map(async (file: FileProps) => {
              const uploadImages = await UploadImageToStorage(
                file,
                formConfig[hasChosenType].initialValues.type,
                `${values.type as string}_${new Date().getTime()}`
              );
              const getImagesUrl = await getStorageDownloadURL(
                uploadImages?.ref?.fullPath ?? ''
              );

              return getImagesUrl;
            })
          );

          await formConfig[hasChosenType].firestoreFn(
            {
              //TODO: add unique ID to the doc
              ...values,
              addedByMonthIndex: values.addedByDate.getMonth(),
              addedByYear: dayjs(new Date(values.addedByDate)).year(),
              createdBy: AuthUser.email || '',
              created_at: new Date(),
              last_updated_at: serverTimestamp(),
              receiptId: nanoid(26),
              addedByItemValueID:
                hasChosenType === 'payment'
                  ? addedByItemValueID[0]?.id || 0
                  : AuthUser?.id || '',
              addedByItemValueKEY:
                hasChosenType === 'payment'
                  ? addedByItemValueID[0]?.key || ''
                  : AuthUser?.email || '',
              uploadImagesUrls: (
                await newImages.then((res) => res)
              ).map((res) => res),
            },
            <Check size={18} />,
            <X size={18} />,
            hasChosenType === 'payment' ? 'Pago' : 'Gasto',
            formConfig[hasChosenType].collectionName
          );
          const typeOfFinances =
            hasChosenType === 'payment'
              ? { payments: increment(values.itemAmmount) }
              : { expenses: increment(values.itemAmmount) };
          const currentMonth = month[values.addedByDate.getMonth()];
          const currentYear = dayjs(new Date(values.addedByDate)).year();
          await SetDocField(
            {
              ...typeOfFinances,
              last_updated_at: serverTimestamp(),
            },
            'Finances',
            `${currentMonth}-${currentYear}`
          );

          setHasOverlay((v) => !v);
          setOpen(false);
          setHasChosenType('none');
          setModalTitle('Elige que Añadir');
          setRecurrentNextStep('none');
          handleFormReset();
        })}
      >
        {hasChosenType === 'none' && (
          <Group position='apart' my='xl' grow>
            <TypeBtn
              icon='payment'
              title='Pago (Ingreso)'
              onClick={() => {
                setHasChosenType('payment');
                setModalTitle('Elige el Tipo de Pago (Ingreso)');
              }}
            />
            <TypeBtn
              icon='expense'
              title='Gasto'
              onClick={() => {
                setHasChosenType('expense');
                setModalTitle('Elige el Tipo de Gasto');
              }}
            />
          </Group>
        )}
        {hasChosenType === 'payment' && (
          <>
            {recurrentNextStep === 'none' && (
              <ChooseRecurrent
                config={paymentConfig}
                setNextStep={setRecurrentNextStep}
              />
            )}
            {recurrentNextStep !== 'none' && (
              <FinanceForm
                errors={form.errors}
                type='payment'
                categoryItems={categoryItemsData}
                categoryItemValue={
                  formConfig[hasChosenType].initialValues.categoryItemValue
                }
                setCategoryItemValue={setCategoryItemValue}
                itemName={formConfig[hasChosenType].initialValues.itemName}
                setItemName={setItemName}
                itemAmmount={
                  formConfig[hasChosenType].initialValues.itemAmmount
                }
                setItemAmmount={setItemAmmount}
                addedByItems={addedBySelectItems}
                addedByItemValue={
                  formConfig[hasChosenType].initialValues.addedByItemValue
                }
                setAddedByItemValue={setAddedByItemValue}
                addedByDate={
                  formConfig[hasChosenType].initialValues.addedByDate
                }
                setAddedByDate={setAddedByDate}
                notesValue={formConfig[hasChosenType].initialValues.notesValue}
                setNotesValue={setNotesValue}
                uploadFiles={filesPreview}
                setUploadFiles={setFilesPreview}
              />
            )}
          </>
        )}
        {hasChosenType === 'expense' && (
          <>
            {recurrentNextStep === 'none' && (
              <ChooseRecurrent
                config={expenseConfig}
                setNextStep={setRecurrentNextStep}
              />
            )}
            {recurrentNextStep !== 'none' && (
              <FinanceForm
                errors={form.errors}
                type='expense'
                categoryItems={categoryItemsData}
                categoryItemValue={
                  formConfig[hasChosenType].initialValues.categoryItemValue
                }
                setCategoryItemValue={setCategoryItemValue}
                itemName={formConfig[hasChosenType].initialValues.itemName}
                setItemName={setItemName}
                itemAmmount={
                  formConfig[hasChosenType].initialValues.itemAmmount
                }
                setItemAmmount={setItemAmmount}
                addedByItems={addedBySelectItems}
                addedByItemValue={
                  formConfig[hasChosenType].initialValues.addedByItemValue
                }
                setAddedByItemValue={setAddedByItemValue}
                addedByDate={
                  formConfig[hasChosenType].initialValues.addedByDate
                }
                setAddedByDate={setAddedByDate}
                notesValue={formConfig[hasChosenType].initialValues.notesValue}
                setNotesValue={setNotesValue}
                uploadFiles={filesPreview}
                setUploadFiles={setFilesPreview}
              />
            )}
          </>
        )}

        <Group position='right' mt={50}>
          <Button
            onClick={() => {
              if (hasChosenType === 'payment' && recurrentNextStep !== 'none') {
                setModalTitle(`Elige el Tipo de Pago (Ingreso)`);
                setHasChosenType('payment');
                setRecurrentNextStep('none');
                handleFormReset();
              }
              if (hasChosenType === 'expense' && recurrentNextStep !== 'none') {
                setModalTitle(`Elige el Tipo de Gasto`);
                setHasChosenType('expense');
                setRecurrentNextStep('none');
                handleFormReset();
              }
              if (hasChosenType === 'payment' && recurrentNextStep === 'none') {
                setModalTitle('Elige que Añadir');
                setHasChosenType('none');
              }
              if (hasChosenType === 'expense' && recurrentNextStep === 'none') {
                setModalTitle('Elige que Añadir');
                setHasChosenType('none');
              }
              if (hasChosenType === 'none' && recurrentNextStep === 'none') {
                setOpen(false);
                setHasChosenType('none');
                setModalTitle('Elige que Añadir');
                setRecurrentNextStep('none');
              }
            }}
            variant='outline'
          >
            {hasChosenType === 'none' ? 'Cancelar' : 'Atrás'}
          </Button>
          <Button disabled={recurrentNextStep === 'none'} type='submit'>
            {recurrentNextStep === 'none' ? 'Continuar' : 'Confirmar'}
          </Button>
        </Group>
        <LoadingOverlay visible={hasOverlay} />
      </form>
    </Modal>
  );
}
