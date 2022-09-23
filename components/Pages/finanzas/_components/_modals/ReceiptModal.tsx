import {
  getStorageDownloadURL,
  SetDocField,
  UpdateDoc,
  UploadImageToStorage,
} from '@/components/Pages/_shared/firebase';
import { FileProps } from '@/components/Pages/_shared/_components/_forms/CustomDropzone';
import { month } from '@/data/months';
import { Button, Group, LoadingOverlay, Modal } from '@mantine/core';
import { useForm } from '@mantine/form';
import dayjs from 'dayjs';
import { increment, serverTimestamp } from 'firebase/firestore';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Check, X } from 'tabler-icons-react';
import { type FinanceProps, type FinanceType } from '../../_types/types';
import { collectionTable } from '../ReceiptPage';
import FinanceForm from '../_forms/FinanceForm';

type ReceiptModalProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  doc: FinanceProps;
  type: FinanceType;
};

export default function ReceiptModal({
  open,
  setOpen,
  doc,
  type,
}: ReceiptModalProps) {
  const [hasOverlay, setHasOverlay] = useState(false);
  const [itemName, setItemName] = useState('');
  const [categoryItemValue, setCategoryItemValue] = useState(
    doc?.categoryItemValue
  );
  const [addedByItemValue, setAddedByItemValue] = useState('');
  const [addedBySelectItems, setAddedBySelectItems] = useState<any>([]);
  const [itemAmmount, setItemAmmount] = useState(0);
  const [addedByDate, setAddedByDate] = useState<any>(new Date());
  const [notesValue, setNotesValue] = useState('');
  const [filesPreview, setFilesPreview] = useState<FileProps[] | []>([]);
  const [selectedImage, setSelectedImage] = useState<string[]>(
    doc?.uploadImagesUrls || []
  );

  const categoryItemsData = [
    {
      value: 'other',
      label: 'Otros',
    },
  ];

  if (type === 'payment') {
    categoryItemsData.unshift({
      value: 'renting',
      label: 'Arriendo',
    });
  }

  if (type === 'expense') {
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

  function setEditFormData() {
    setItemName(doc?.itemName || '');
    setCategoryItemValue(doc?.categoryItemValue || '');
    setItemAmmount(doc?.itemAmmount || 0);
    setAddedByItemValue(doc?.addedByItemValue || '');
    if (type === 'payment' && doc?.categoryItemValue === 'renting') {
      const [renterName, renterEmail, renterRoom] =
        doc?.addedByItemValue.split(' - ');

      setAddedBySelectItems([
        {
          avatarColor: `${
            doc?.categoryItemValue === 'renting' ? 'teal' : 'gray'
          }`,
          value: `${renterName} - ${renterEmail} - ${renterRoom}`,
          label: `${renterName} - ${renterRoom}`,
          description: renterEmail,
          group: `${
            doc?.categoryItemValue === 'renting' ? 'Arrendatario' : ''
          }`,
        },
      ]);
    }
    if (type === 'payment' && doc?.categoryItemValue === 'other') {
      setAddedBySelectItems([
        { value: doc?.addedByItemValue, label: doc?.addedByItemValue },
      ]);
    }
    if (type === 'expense') {
      setAddedBySelectItems([
        { value: doc?.addedByItemValue, label: doc?.addedByItemValue },
      ]);
    }
    setAddedByDate(dayjs(doc?.addedByDate?.seconds * 1000).toDate());
    setNotesValue(doc?.notesValue || '');
    setSelectedImage(doc?.uploadImagesUrls || []);
  }

  useEffect(() => {
    // @ts-ignore
    let _ignore = false;
    setEditFormData();
    return () => {
      _ignore = true;
    };
  }, [type, doc]);

  const formConfig = {
    initialValues: {
      itemName,
      categoryItemValue,
      addedByItemValue,
      itemAmmount,
      addedByDate,
      notesValue,
      filesPreview,
      receiptImages: selectedImage,
    },
  };
  const form = useForm({
    initialValues: formConfig.initialValues,

    validate: {
      itemName: (value) =>
        value === '' ? 'Este campo no puede estar vacío.' : null,
      addedByItemValue: (value) =>
        value === null ? 'Este campo no puede estar vacío.' : null,

      itemAmmount: (value) =>
        isNaN(value)
          ? 'Debes ingregar un monto válido y mayor o igual a cero.'
          : null,
      addedByDate: (value) =>
        value === null ? 'Este campo no puede estar vacío.' : null,
    },
  });

  useEffect(() => {
    let _ignore = false;
    form.setFieldValue('itemName', itemName);
    form.setFieldValue('categoryItemValue', categoryItemValue);
    form.setFieldValue('addedByItemValue', addedByItemValue);
    form.setFieldValue('itemAmmount', itemAmmount);
    form.setFieldValue('addedByDate', addedByDate);
    form.setFieldValue('notesValue', notesValue);
    form.setFieldValue('filesPreview', filesPreview);
    form.setFieldValue('receiptImages', selectedImage);
    return () => {
      _ignore = true;
    };
  }, [
    itemName,
    categoryItemValue,
    addedByItemValue,
    itemAmmount,
    addedByDate,
    notesValue,
    filesPreview,
    selectedImage,
  ]);

  useEffect(() => {
    let _ignore = false;
    form.validate();
    return () => {
      _ignore = true;
    };
  }, [form.values]);

  function handleFormReset() {
    setItemName(doc?.itemName || '');
    setCategoryItemValue(doc?.categoryItemValue);
    setAddedByItemValue(doc?.addedByItemValue);
    setItemAmmount(doc?.itemAmmount || 0);
    setAddedByDate(dayjs(doc?.addedByDate?.seconds * 1000).toDate());
    setNotesValue(doc?.notesValue);
    setFilesPreview([]);
    setSelectedImage(doc?.uploadImagesUrls || []);
  }
  return (
    <Modal
      opened={open}
      onClose={() => {
        setOpen(false);
        handleFormReset();
      }}
      overflow='outside'
      title={`Editar ${type === 'payment' ? 'Pago' : 'Gasto'}`}
    >
      <form
        onSubmit={form.onSubmit(async (values) => {
          setHasOverlay(true);
          // upload images first and get the urls
          const newImagesUrls = await Promise.all(
            filesPreview.map(async (file: FileProps) => {
              const uploadImages = await UploadImageToStorage(
                file,
                type,
                `${type}_${new Date().getTime()}`
              );
              const getImagesUrl = await getStorageDownloadURL(
                uploadImages.ref.fullPath
              );

              return getImagesUrl;
            })
          );
          // TODO: remove images from storage that are not in the newImagesUrls
          // merge images urls with form values
          const updatedImagesUrls = Array.from(
            new Set([...newImagesUrls, values.receiptImages])
          ).flat();
          // update the document
          await UpdateDoc(
            {
              addedByDate: values.addedByDate,
              addedByItemValue: values.addedByItemValue,
              categoryItemValue: values.categoryItemValue,
              addedByMonthIndex: values.addedByDate.getMonth(),
              addedByYear: dayjs(new Date(values.addedByDate)).year(),
              itemAmmount: values.itemAmmount,
              itemName: values.itemName,
              last_updated_at: serverTimestamp(),
              notesValue: values.notesValue,
              uploadImagesUrls: updatedImagesUrls,
            },
            <Check size={18} />,
            <X size={18} />,
            collectionTable[type],
            doc?.key as string
          );
          // update Finances collect6ion
          // check for itemAmmount is Positive
          const finalItemAmmount = () => {
            let num: number;
            if (values.itemAmmount > doc?.itemAmmount) {
              // get the difference between the two values
              // the increment is the difference
              num = values.itemAmmount - doc?.itemAmmount;
              return num;
            }
            if (values.itemAmmount < doc?.itemAmmount) {
              // the decrement is the difference
              // but we need to make it negative to rest from the current doc value
              num = doc?.itemAmmount - values.itemAmmount;
              return -num;
            }
            // if equal, there is no change
            num = doc?.itemAmmount;
            return num;
          };
          const incrementBy =
            doc?.itemAmmount === values.itemAmmount ? 0 : finalItemAmmount();
          await SetDocField(
            {
              [collectionTable[type as string]]: increment(incrementBy) as any,
              last_updated_at: serverTimestamp(),
            },
            'Finances',
            `${month[values.addedByDate.getMonth()]}-${dayjs(
              new Date(values.addedByDate)
            ).year()}`
          );
          // cleanup the form
          handleFormReset();
          // close the modal
          setOpen(false);
          setHasOverlay(false);
        })}
      >
        <FinanceForm
          errors={form.errors}
          type={type}
          categoryItems={categoryItemsData || []}
          categoryItemValue={categoryItemValue || ''}
          setCategoryItemValue={setCategoryItemValue}
          addedByItems={addedBySelectItems}
          addedByItemValue={addedByItemValue}
          setAddedByItemValue={setAddedByItemValue}
          itemName={itemName}
          setItemName={setItemName}
          itemAmmount={itemAmmount}
          setItemAmmount={setItemAmmount}
          addedByDate={addedByDate}
          setAddedByDate={setAddedByDate}
          notesValue={notesValue}
          setNotesValue={setNotesValue}
          uploadFiles={filesPreview}
          setUploadFiles={setFilesPreview}
          imagesUrls={doc?.uploadImagesUrls as string[]}
          selectImage={selectedImage}
          setSelectImage={setSelectedImage}
        />
        <Group position='right' mt={30}>
          <Button
            onClick={() => {
              setOpen(false);
              handleFormReset();
            }}
            variant='outline'
          >
            Cancelar
          </Button>
          <Button
            // disabled={recurrentNextStep === 'none'}
            type='submit'
          >
            Confirmar
          </Button>
        </Group>
        <LoadingOverlay visible={hasOverlay} />
      </form>
    </Modal>
  );
}
