import 'dayjs/locale/es-mx';
import { Select, Textarea, TextInput } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import CurrencyInput from '@/components/Pages/_shared/_components/_forms/CurrencyInput';
import SelectItem from '@/components/Pages/_shared/_components/_forms/SelectItem';
import { Calendar } from 'tabler-icons-react';
import { DropzoneButton } from '@/components/Pages/_shared/_components/_forms/CustomDropzone';
import { FinanceFormProps } from '../../_types/types';
import ReceiptImages from './ReceiptImages';

export default function FinanceForm({
  errors,
  type = 'none',
  categoryItems,
  categoryItemValue,
  setCategoryItemValue,
  addedByItems,
  addedByItemValue,
  setAddedByItemValue,
  itemName,
  setItemName,
  itemAmmount,
  setItemAmmount,
  addedByDate,
  setAddedByDate,
  notesValue,
  setNotesValue,
  uploadFiles,
  setUploadFiles,
  imagesUrls,
  selectImage,
  setSelectImage,
}: Partial<FinanceFormProps>) {
  return (
    <div>
      <div className='pb-6'>
        <Select
          required
          label='Categoría:'
          description='Servicios o Mantención'
          value={categoryItemValue || ''}
          onChange={setCategoryItemValue}
          data={categoryItems || []}
        />
      </div>
      <div className='pb-3'>
        <TextInput
          placeholder={`Nombre de ${type === 'payment' ? 'Pago' : 'Gasto'}`}
          label='Nombre'
          description='Nombre de Servicio, Mantención, etc'
          data-autofocus
          required
          value={itemName}
          onChange={(event) => setItemName(event.currentTarget.value)}
          error={errors ? errors?.itemName : null}
        />
      </div>
      <div className='pb-3'>
        <CurrencyInput
          label='Monto:'
          value={itemAmmount}
          onChange={setItemAmmount}
          error={errors ? errors?.itemAmmount : null}
        />
      </div>
      <div className='pb-6'>
        <Select
          clearable
          allowDeselect
          label='Pagado Por:'
          placeholder='Seleccione una opción'
          itemComponent={SelectItem}
          value={addedByItemValue || ''}
          onChange={setAddedByItemValue}
          data={addedByItems || []}
          error={errors ? errors?.addedByItemValue : null}
        />
      </div>
      <div className='pb-6'>
        <DatePicker
          dropdownType='modal'
          icon={<Calendar size={16} />}
          locale='es-mx'
          classNames={{
            monthPickerControlActive: 'bg-blue-500 hover:bg-blue-600',
            yearPickerControlActive: 'bg-blue-500 hover:bg-blue-600',
          }}
          placeholder={`Fecha de ${type === 'payment' ? 'Pago' : 'Gasto'}`}
          label={`Fecha de ${type === 'payment' ? 'Pago' : 'Gasto'}:`}
          value={addedByDate as Date}
          onChange={setAddedByDate}
          error={errors ? errors?.addedByDate : null}
        />
      </div>
      <div className='pb-6'>
        <Textarea
          autosize
          minRows={4}
          placeholder='Aqui puedes añadir una nota con detalles extras, si lo necesitas.'
          label='Notas (opcional):'
          value={notesValue}
          onChange={(event) => setNotesValue(event.currentTarget.value)}
        />
      </div>
      {!!imagesUrls && imagesUrls.length > 0 && (
        <ReceiptImages
          imagesUrls={imagesUrls}
          selectImage={selectImage}
          setSelectImage={setSelectImage}
        />
      )}
      <div className='pb-0.5'>
        <label className='font-bold text-sm'>
          Adjuntar Imágenes (opcional):
        </label>
        <DropzoneButton
          filesPreview={uploadFiles}
          setFilesPreview={setUploadFiles}
        />
      </div>
    </div>
  );
}
