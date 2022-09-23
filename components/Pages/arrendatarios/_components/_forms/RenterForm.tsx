import 'dayjs/locale/es';
import {
  Button,
  Modal,
  Select,
  TextInput,
  type SelectItem as SelectItemType,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { At, Calendar, Check, Hash, Phone, X } from 'tabler-icons-react';
import { DatePicker } from '@mantine/dates';
import { serverTimestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';

import Icon from '@/icons/Icon';
import { rutTools, phoneTools } from 'prettyutils';

import {
  AddDoc,
  GetDocs,
  UpdateDoc,
  UpdateDocField,
} from '@/components/Pages/_shared/firebase';
import SelectItem from '@/components/Pages/_shared/_components/_forms/SelectItem';
import { AppDate } from '@/components/Pages/_shared/_types/types';
import { FormConfigProps, RenterProps } from '../../_types/types';
import { RoomProps } from '@/components/Pages/piezas/_types/types';
type RenterFormProps = {
  opened: boolean;
  setOpened: any;
  renterListLength?: number;
  userData?: RenterProps;
  type: 'add' | 'edit';
};

export default function RenterForm({
  opened,
  setOpened,
  renterListLength = 1,
  userData = {
    id: renterListLength,
    firstName: '',
    lastName: '',
    rentStatus: 'inactivo',
    room: '',
    email: '',
    rut: '',
    rentStart: new Date(),
    phone: '',
    rentEnd: new Date(),
    key: '',
  },
  type = 'add',
}: RenterFormProps) {
  const [rutValue, setRutValue] = useState('');
  const [phone, setPhone] = useState('');
  const [rentStartValue, setRentStartValue] = useState<AppDate>(new Date());
  const [rentEndValue, setRentEndValue] = useState<AppDate>(new Date());
  const [rentStatus, setRentStatus] = useState(userData?.rentStatus);
  const formConfig: FormConfigProps = {
    add: {
      formInitialValues: {
        id: renterListLength,
        firstName: '',
        lastName: '',
        rentStatus: 'inactivo',
        room: '',
        email: '',
        rut: '',
        rentStart: new Date(),
        phone: '',
        rentEnd: new Date(),
      },
      modalTitle: 'Añadir Arrendatario',
      defaultUserId: renterListLength,
      callToActionBtn: 'Confirmar',
      firestoreFn: AddDoc,
    },
    edit: {
      formInitialValues: {
        id: userData?.id,
        firstName: userData?.firstName,
        lastName: userData?.lastName,
        rentStatus: userData?.rentStatus,
        room: userData?.room,
        email: userData?.email,
        rut: userData?.rut,
        rentStart: userData?.rentStart,
        phone: userData?.phone,
        rentEnd: userData?.rentEnd,
      },
      modalTitle: 'Editar Datos De Arrendatario',
      defaultUserId: userData?.id,
      callToActionBtn: 'Guardar',
      firestoreFn: UpdateDoc,
    },
  };

  const form = useForm<RenterProps>({
    initialValues: formConfig[type].formInitialValues,
    validate: {
      firstName: (value) =>
        value === '' || null || undefined
          ? 'Este campo no puede estar vacío.'
          : null,
      lastName: (value) =>
        value === '' || null || undefined
          ? 'Este campo no puede estar vacío..'
          : null,
      email: (value) =>
        /^\S+@\S+$/.test(value)
          ? null
          : 'El e-mail debe ser un email válido. Ejemplo: tu@email.com',
      room: (value) => {
        if (rentStatus === 'activo' && !value) {
          if (value === '' || null || undefined) {
            return 'Debes asignar una Pieza.';
          }
        }
      },
    },
  });

  // onMount set RUT and Phone from userData
  useEffect(() => {
    setRutValue(userData?.rut);
    setPhone(userData?.phone);
    if (type === 'add') {
      setRentStartValue(new Date());
      setRentEndValue(new Date());
    }
    if (type === 'edit') {
      setRentStartValue(new Date(userData?.rentStart.seconds * 1000));
      setRentEndValue(new Date(userData?.rentEnd.seconds * 1000));
    }
  }, [
    userData?.rut,
    userData?.phone,
    userData?.rentStart.seconds,
    userData?.rentEnd.seconds,
    type,
  ]);
  useEffect(() => {
    setRentStatus('inactivo');
  }, []);
  useEffect(() => {
    setRentStatus(form.values.rentStatus);
  }, [form.values.rentStatus]);

  useEffect(() => {
    form.validateField('firstName');
    form.validateField('lastName');
    form.validateField('email');
    if (form.values.rentStatus === 'activo') {
      form.validateField('room');
    }
  }, [form.values]);

  useEffect(() => {
    if (form.values.rentStatus === 'inactivo') {
      form.setFieldValue('room', '');
      form.validateField('room');
    }
    if (!form.values.rentStatus) {
      form.setFieldValue('room', '');
      form.validateField('room');
    }
  }, [form.values.rentStatus]);

  useEffect(() => {
    if (!form.values.room) {
      form.setFieldValue('room', '');
      form.validateField('room');
    }
  }, [form.values.room]);

  useEffect(() => {
    form.validateField('room');
  }, [rentStatus]);

  // UPDATE form fields of controlled components
  useEffect(() => {
    if (type === 'add') {
      form.setFieldValue('id', renterListLength);
    }
  }, [renterListLength]);
  useEffect(() => {
    form.setFieldValue('phone', phone);
  }, [phone]);
  useEffect(() => {
    form.setFieldValue('rut', rutValue);
  }, [rutValue]);
  useEffect(() => {
    form.setFieldValue('rentStart', rentStartValue);
  }, [rentStartValue]);
  useEffect(() => {
    form.setFieldValue('rentEnd', rentEndValue);
  }, [rentEndValue]);

  const [docsList, setDocsList] = useState<RoomProps[]>([]);
  const [errors, setErrors] = useState('');

  useEffect(() => {
    let _ignore = false;
    async function getRooms() {
      try {
        const rooms = await GetDocs<RoomProps>('rooms');
        setDocsList(rooms[0]?.id ? rooms : []);
      } catch (error) {
        console.log(error);
        setErrors(error);
      }
    }
    getRooms();
    return () => {
      _ignore = true;
    };
  }, [form.values.rentStatus === 'activo']);

  const roomsListData: SelectItemType[] = docsList?.map((room: RoomProps) => ({
    type: 'room',
    avatarColor: `${room.isRented === 'Sí' ? 'teal' : 'gray'}`,
    value: `Pieza ${room.id}`,
    label: `Pieza ${room.id} - ${
      room.isRented === 'Sí' ? 'Arrendada' : 'Vacante'
    }`,
    description: `${room.assignRenter}`,
    group: `${room.isRented === 'Sí' ? 'Arrendadas' : 'Vacante'}`,
  }));

  if (errors) console.log('errors', errors);
  return (
    <Modal
      opened={opened}
      onClose={() => {
        setOpened();
        form.reset();
      }}
      title={formConfig[type].modalTitle}
    >
      <div>
        <form
          onSubmit={form.onSubmit(async (values) => {
            // CREATING NEW RENTER
            if (type === 'add') {
              // get room docs list
              const roomData = docsList.filter(
                (val) => `Pieza ${val.id}` === form.values.room
              );
              // adding ROOM data to Renter at ADD RenterForm
              if (type === 'add' && values.rentStatus === 'activo') {
                await UpdateDocField<Partial<RoomProps>>(
                  {
                    assignRenter: `${values.firstName} ${values.lastName}`,
                    isRented: 'Sí',
                    assignRenterData: {
                      firstName: values.firstName,
                      lastName: values.lastName,
                      id: values.id,
                      rentStatus: 'activo',
                      room: values.room,
                      roomValue: roomData[0]?.monthlyPayment,
                    },
                  },
                  'rooms',
                  roomData[0]?.key
                );
              }

              await formConfig[type].firestoreFn(
                {
                  ...values,
                  roomValue: roomData[0]?.monthlyPayment || 0,
                  created_at: new Date(),
                  last_updated_at: serverTimestamp(),
                },
                <Check size={18} />,
                <X size={18} />,
                'Arrendatario',
                'renters'
              );
              setRutValue('');
              setPhone('');
              setRentStartValue(new Date());
              setRentEndValue(new Date());
              form.reset();
            }
            // UPDATING RENTER
            if (type === 'edit') {
              // room data
              const roomData = docsList.filter(
                (val) => `Pieza ${val.id}` === form.values.room
              );
              // updating ROOM data with Renter data at EDIT RenterForm if rentStatus is ACTIVO
              if (type === 'edit' && values.rentStatus === 'activo') {
                // Update Selected Room with Current Renter Data
                await UpdateDocField<Partial<RoomProps>>(
                  {
                    assignRenter: `${values.firstName} ${values.lastName}`,
                    isRented: 'Sí',
                    assignRenterData: {
                      firstName: values.firstName,
                      lastName: values.lastName,
                      id: values.id,
                      rentStatus: 'activo',
                      room: values.room,
                      roomValue: roomData[0]?.monthlyPayment,
                    },
                  },
                  'rooms',
                  roomData[0]?.key
                );
              }

              // Updating ROOM data if rentStatus is INACTIVE
              if (type === 'edit' && values.rentStatus === 'inactivo') {
                const selectedRoomData = docsList.filter(
                  (val) => `Pieza ${val.id}` === userData?.room
                );
                if (values.room === '' && userData?.room !== '') {
                  await UpdateDocField<Partial<RoomProps>>(
                    {
                      assignRenter: '',
                      isRented: 'No',
                      assignRenterData: {
                        firstName: '',
                        lastName: '',
                        id: 0,
                        rentStatus: 'inactivo',
                        room: '',
                        roomValue: 0,
                      },
                    },
                    'rooms',
                    selectedRoomData[0]?.key
                  );
                }
              }

              await formConfig[type].firestoreFn<RenterProps>(
                {
                  ...values,
                  roomValue: roomData[0]?.monthlyPayment || 0,
                  last_updated_at: serverTimestamp(),
                },
                <Check size={18} />,
                <X size={18} />,
                'renters',
                userData?.key
              );
            }
          })}
        >
          <h3 className='font-bold pb-3 uppercase'>Datos</h3>
          <div className='pb-6'>
            <Select
              disabled
              icon={<Hash size={14} />}
              label='ID:'
              description='Elegido automáticamente'
              defaultValue={formConfig[type].formInitialValues.id.toString()}
              data={[formConfig[type].formInitialValues.id.toString()]}
            />
          </div>
          <div className='pb-6 flex'>
            <TextInput
              classNames={{ root: 'lg:!w-full' }}
              placeholder='Nombre'
              label='Nombre:'
              // data-autofocus
              required
              {...form.getInputProps('firstName')}
            />
            <TextInput
              className='ml-3'
              classNames={{ root: 'lg:!w-full' }}
              placeholder='Apellido'
              label='Apellido:'
              required
              {...form.getInputProps('lastName')}
            />
          </div>
          <div className='pb-6'>
            <TextInput
              icon={<At size={16} />}
              classNames={{ label: 'font-bold' }}
              placeholder='Entra un Email'
              autoComplete='username'
              autoCorrect='off'
              label='Email:'
              required
              {...form.getInputProps('email')}
            />
          </div>
          <div className='pb-6'>
            <TextInput
              icon={
                <Icon
                  kind='card'
                  divCss='py-1'
                  svgCss='h-[14px] w-[14px] text-neutral-400'
                />
              }
              placeholder='Entra un RUT'
              label='RUT (Opcional):'
              value={rutValue}
              onChange={(event) =>
                setRutValue(rutTools.format(event.currentTarget.value))
              }
            />
          </div>
          <div className='pb-6'>
            <TextInput
              icon={<Phone size={16} />}
              placeholder='Entra una Telefóno'
              label='Telefóno o Celular (Opcional):'
              value={phone}
              onChange={(event) =>
                setPhone(phoneTools.format(event.currentTarget.value))
              }
            />
          </div>
          <h3 className='font-bold pt-3 pb-3 uppercase'>Arriendo</h3>
          <div className='pb-6'>
            <Select
              label='Estado de Arriendo:'
              placeholder='Activo o Inactivo'
              data={[
                { value: 'activo', label: 'Activo' },
                { value: 'inactivo', label: 'Inactivo' },
              ]}
              {...form.getInputProps('rentStatus', { type: 'input' })}
            />
          </div>
          {form.values.rentStatus === 'activo' && (
            <div className='mb-6 p-4 bg-blue-50 rounded-md'>
              <Select
                clearable
                allowDeselect
                searchable
                required={form.values.rentStatus === 'activo'}
                nothingFound='Nombre No Encontrado'
                defaultValue={formConfig[type].formInitialValues.room}
                label='Asignar Pieza a arrendatario:'
                description='Basado en Disponibles'
                placeholder='Elige una pieza'
                classNames={{ label: 'font-bold' }}
                itemComponent={SelectItem}
                icon={<Icon kind='door' svgCss='h-3 w-3' />}
                data={docsList[0]?.id ? roomsListData : []}
                maxDropdownHeight={280}
                {...form.getInputProps('room', { type: 'input' })}
              />
            </div>
          )}
          <div className='pb-6'>
            <DatePicker
              icon={<Calendar size={16} />}
              locale='es'
              classNames={{
                label: 'font-bold',
                monthPickerControlActive: 'bg-blue-500 hover:bg-blue-600',
                yearPickerControlActive: 'bg-blue-500 hover:bg-blue-600',
              }}
              placeholder='Elige una Fecha'
              label='Inicio de Arriendo'
              inputFormat='DD/MM/YYYY'
              value={rentStartValue as Date}
              onChange={setRentStartValue as any}
            />
          </div>
          <div className='pb-6'>
            <DatePicker
              icon={<Calendar size={16} />}
              locale='es'
              classNames={{
                dropdown: 'border-[1px] border-blue-300',
                label: 'font-bold',
                monthPickerControlActive: 'bg-blue-500 hover:bg-blue-600',
              }}
              placeholder='Elige una Fecha'
              label='Fin de Arriendo (opcional)'
              inputFormat='DD/MM/YYYY'
              value={rentEndValue as Date}
              onChange={setRentEndValue as any}
            />
          </div>
          <div className='pt-6 flex justify-end'>
            <Button
              onClick={() => {
                setOpened();
                form.reset();
              }}
              variant='outline'
              className='mr-3'
            >
              Cancelar
            </Button>
            <Button
              type='submit'
              onClick={() => {
                if (!!Object.keys(form.errors).length === false) {
                  setOpened();
                }
              }}
            >
              {formConfig[type].callToActionBtn}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
