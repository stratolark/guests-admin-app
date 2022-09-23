// import 'dayjs/locale/es-mx';
import Icon from '@/icons/Icon';
import {
  Button,
  Checkbox,
  Divider,
  Modal,
  NumberInput,
  Select,
  type SelectItem as SelectItemType,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { serverTimestamp } from 'firebase/firestore';

import {
  AddDoc,
  GetDocs,
  UpdateDoc,
  UpdateDocField,
} from '@/components/Pages/_shared/firebase';
import SelectItem from '@/components/Pages/_shared/_components/_forms/SelectItem';
import { useEffect, useState } from 'react';
import { Check, Hash, X } from 'tabler-icons-react';
import { RoomFormConfigProps, RoomProps } from '../../_types/types';
import { RenterProps } from '@/components/Pages/arrendatarios/_types/types';

type RoomFormProps = {
  opened: boolean;
  setOpened: any;
  latestRoomID?: number;
  roomData?: RoomProps;
  type: 'add' | 'edit';
};
export default function RoomForm({
  opened,
  setOpened,
  latestRoomID = 1,
  roomData = {
    id: 1,
    number: '',
    isRented: 'No',
    hasRenterPayed: 'No',
    assignRenter: '',
    nextPayment: 'en 7 días',
    hasBathroom: 'Sí',
    bathroomType: [''],
    monthlyPayment: 160000,
    services: [],
    assignRenterData: {},
  },
  type = 'add',
}: RoomFormProps) {
  // TODO: create a hooks for this
  const [docsList, setDocsList] = useState<RenterProps[]>([]);
  const [errors, setErrors] = useState('');
  const [isRented, setIsRented] = useState(roomData?.isRented);
  const [renterData, setRenterData] = useState<Partial<RenterProps>>();
  const formConfig: RoomFormConfigProps = {
    add: {
      formInitialValues: {
        id: latestRoomID,
        number: '',
        isRented: 'No',
        hasRenterPayed: 'No',
        assignRenter: '',
        nextPayment: 'en 7 días',
        hasBathroom: 'Sí',
        bathroomType: 'Privado (interno)',
        monthlyPayment: 160000,
        services: [
          'Agua',
          'Electricidad',
          'Calefont',
          'Cama',
          'Internet',
          'Cocina',
          'Escritorio',
          'Closet',
          'Silla',
          'Lavandería',
          'Microondas',
          'Refrigerador',
          'Hervidor',
          'Mesa de Noche',
        ],
        assignRenterData: {} as Partial<RenterProps>,
        isRoomAvailable: 'Sí',
      },
      modalTitle: 'Añadir Pieza',
      callToActionBtn: 'Confirmar',
      defaultRoomId: latestRoomID,
      firestoreFn: AddDoc,
    },
    edit: {
      formInitialValues: {
        id: roomData?.id,
        number: roomData?.number,
        isRented: roomData?.isRented === 'Sí' ? 'Sí' : 'No',
        hasRenterPayed: roomData?.hasRenterPayed,
        assignRenter: roomData?.assignRenter,
        nextPayment: roomData?.nextPayment,
        hasBathroom: roomData?.hasBathroom || 'No',
        bathroomType: roomData?.bathroomType || [''],
        monthlyPayment: roomData?.monthlyPayment,
        services: roomData?.services ? roomData?.services : [],
        assignRenterData:
          (roomData?.assignRenterData as Partial<RenterProps>) || {},
        isRoomAvailable: roomData?.isRoomAvailable || 'Sí',
      },
      modalTitle: 'Editar Datos De Pieza',
      callToActionBtn: 'Guardar',
      defaultRoomId: roomData?.id,
      firestoreFn: UpdateDoc,
    },
  };

  const form = useForm<RoomProps>({
    initialValues: formConfig[type].formInitialValues,
    validate: {
      bathroomType: (value) =>
        value === null || undefined ? 'Este campo no puede estar vacío.' : null,
      monthlyPayment: (value) =>
        isNaN(value)
          ? 'Debes ingregar un monto válido y mayor o igual a cero.'
          : null,
      assignRenter: (value) => {
        if (isRented === 'Sí' && !value) {
          if (value === '' || null || undefined) {
            return 'Debes asignar un arrendatario.';
          }
        }
      },
    },
  });

  useEffect(() => {
    let _ignore = false;
    async function getRenters() {
      try {
        const renters: any[] = await GetDocs<RenterProps>('renters');
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
  }, [isRented === 'Sí']);

  let rentersListData: any[] | RenterProps[] = [];
  if (docsList.length > 0) {
    rentersListData = docsList?.map((renter: RenterProps) => ({
      type: 'renter',
      avatarColor: `${renter.rentStatus === 'activo' ? 'teal' : 'gray'}`,
      value: `${renter.firstName} ${renter.lastName}`,
      label: `${renter.firstName} ${renter.lastName} - ${
        renter.rentStatus === 'activo' ? renter.room : 'Sin Pieza'
      }`,
      description: `${renter.email}`,
      group: `${
        renter.rentStatus[0].toUpperCase() + renter.rentStatus.substring(1)
      } ${renter.rentStatus === 'activo' ? '(Arrendatarios)' : ''}`,
    }));
  }

  useEffect(() => {
    if (type === 'add') {
      form.setFieldValue('id', latestRoomID);
      form.setFieldValue('number', `Pieza ${latestRoomID}`);
    }
  }, [latestRoomID]);

  useEffect(() => {
    setIsRented('No');
  }, []);

  useEffect(() => {
    form.validate();
  }, []);

  useEffect(() => {
    setIsRented(form.values.isRented);
  }, [form.values.isRented]);

  useEffect(() => {
    form.validate();
  }, [isRented]);

  useEffect(() => {
    if (!form.values.assignRenter) {
      form.setFieldValue('assignRenter', '');
      form.validate();
    }
  }, [form.values.assignRenter]);

  useEffect(() => {
    // add new renter data at room creation form
    if (
      type === 'add' &&
      form.values.isRented === 'Sí' &&
      form.values.assignRenter !== ''
    ) {
      const selectedRenter = docsList?.find(
        (doc) => `${doc.firstName} ${doc.lastName}` === form.values.assignRenter
      );

      setRenterData({
        firstName: selectedRenter?.firstName,
        lastName: selectedRenter?.lastName,
        id: selectedRenter?.id,
        key: selectedRenter?.key,
        rentStatus: 'activo',
        room: `Pieza ${form.values.id}`,
        roomValue: form.values.monthlyPayment,
      });
    }
    // add room but without renter assign at creation form
    if (
      type === 'add' &&
      form.values.isRented === 'No' &&
      form.values.assignRenter === ''
    ) {
      setRenterData({
        firstName: '',
        lastName: '',
        id: 0,
        key: '',
        rentStatus: 'inactivo',
        room: 'Sin Pieza',
        roomValue: 0,
      });
    }
    // edit renter data to another renter
    if (
      type === 'edit' &&
      form.values.isRented === 'Sí' &&
      form.values.assignRenter !== ''
    ) {
      const selectedRenter = docsList?.find(
        (doc) => `${doc.firstName} ${doc.lastName}` === form.values.assignRenter
      );

      setRenterData({
        firstName: selectedRenter?.firstName,
        lastName: selectedRenter?.lastName,
        id: selectedRenter?.id,
        key: selectedRenter?.key,
        rentStatus: 'activo',
        room: `Pieza ${form.values.id}`,
        roomValue: form.values.monthlyPayment,
      });
    }
    // edit renter data to remove renter from room
    if (
      type === 'edit' &&
      form.values.isRented === 'No' &&
      form.values.assignRenter === ''
    ) {
      setRenterData({
        firstName: '',
        lastName: '',
        id: 0,
        key: '',
        rentStatus: 'inactivo',
        room: 'Sin Pieza',
        roomValue: 0,
      });
    }
  }, [
    type,
    roomData,
    docsList,
    form.values.assignRenter,
    form.values.monthlyPayment,
  ]);

  useEffect(() => {
    form.setFieldValue('assignRenterData', renterData);
  }, [renterData]);

  useEffect(() => {
    form.setFieldValue('assignRenter', '');
  }, [form.values.isRented]);

  useEffect(() => {
    if (type === 'edit') {
      form.setFieldValue('assignRenter', roomData?.assignRenter);
    }
  }, [form.values.isRented && roomData?.assignRenter]);

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
          // TODO: error when updating renter data missing one arg
          onSubmit={form.onSubmit(async (values) => {
            // ADD ROOM
            if (type === 'add') {
              if (
                type === 'add' &&
                values.isRented === 'Sí' &&
                values.assignRenter !== ''
              ) {
                const doc = docsList.filter(
                  (val) =>
                    `${val.firstName} ${val.lastName}` ===
                    form.values.assignRenter
                );
                await UpdateDocField<Partial<RenterProps>>(
                  {
                    rentStatus: 'activo',
                    room: `Pieza ${values.id}`,
                    roomValue: values.monthlyPayment,
                  },
                  'renters',
                  doc[0]?.key
                );
              }

              await formConfig[type].firestoreFn(
                {
                  ...values,
                  created_at: new Date(),
                  last_updated_at: serverTimestamp(),
                },
                <Check size={18} />,
                <X size={18} />,
                'Pieza',
                'rooms'
              );
              form.reset();
            }
            // EDIT ROOM
            if (type === 'edit') {
              // add renter data to room document
              if (
                type === 'edit' &&
                values.isRented === 'Sí' &&
                values.assignRenter !== ''
              ) {
                const doc = docsList.filter(
                  (val) =>
                    `${val.firstName} ${val.lastName}` ===
                    form.values.assignRenter
                );
                await UpdateDocField<Partial<RenterProps>>(
                  {
                    rentStatus: 'activo',
                    room: `Pieza ${values.id}`,
                    roomValue: values.monthlyPayment,
                  },
                  'renters',
                  doc[0]?.key
                );
              }
              // remove renter from room document
              if (
                type === 'edit' &&
                values.isRented === 'No' &&
                values.assignRenter === '' &&
                roomData?.assignRenter !== ''
              ) {
                await UpdateDocField<Partial<RenterProps>>(
                  {
                    rentStatus: 'inactivo',
                    room: ``,
                    roomValue: 0,
                  },
                  'renters',
                  roomData?.assignRenterData?.key
                );
              }
              await formConfig[type].firestoreFn<RoomProps>(
                { ...values, last_updated_at: serverTimestamp() },
                <Check size={18} />,
                <X size={18} />,
                'rooms',
                roomData?.key
              );
            }
          })}
        >
          <div className='pb-6'>
            <Select
              disabled
              icon={<Hash size={14} />}
              label='Nombre y Número de Pieza:'
              description='Elegido automáticamente'
              classNames={{ label: '!text-neutral-400' }}
              defaultValue={`Pieza ${latestRoomID}`}
              data={[
                {
                  value: `Pieza ${formConfig[type].defaultRoomId}`,
                  label: `Pieza ${formConfig[type].defaultRoomId}`,
                },
              ]}
              {...form.getInputProps('number', { type: 'input' })}
            />
          </div>
          <div className='pb-6'>
            <Select
              // clearable
              required
              // allowDeselect
              label='Baño:'
              placeholder='Elige Sí o No'
              data={[
                { value: 'Sí', label: 'Sí' },
                { value: 'No', label: 'No' },
              ]}
              {...form.getInputProps('hasBathroom', { type: 'input' })}
            />
          </div>
          {form.values.hasBathroom === 'Sí' && (
            <div className='pb-6'>
              <Select
                // clearable
                required
                // allowDeselect
                label='Tipo De Baño:'
                placeholder='Privado o Compartido'
                defaultValue={formConfig[type].formInitialValues.bathroomType}
                data={[
                  { value: 'Privado (interno)', label: 'Privado (interno)' },
                  { value: 'Privado (externo)', label: 'Privado (externo)' },
                  { value: 'Compartido', label: 'Compartido' },
                ]}
                {...form.getInputProps('bathroomType')}
              />
            </div>
          )}
          <div className='pb-6'>
            <NumberInput
              required
              rightSection={'🇨🇱 CLP'}
              rightSectionWidth={100}
              classNames={{ rightSection: '!w-[100px]' }}
              label='Valor Mensual:'
              description='Valor en Pesos Chilenos CLP'
              defaultValue={
                formConfig[type].formInitialValues.monthlyPayment || 160000
              }
              parser={(value) => value?.replace(/\$\s?|(\.*)/g, '')}
              formatter={(value) =>
                !Number.isNaN(parseFloat(value as string))
                  ? `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
                  : '$ '
              }
              stepHoldDelay={500}
              stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
              {...form.getInputProps('monthlyPayment')}
            />
          </div>
          <div className='pb-6'>
            <Checkbox.Group
              defaultValue={[
                ...(formConfig[type].formInitialValues.services as
                  | string[]
                  | []),
              ]}
              label='Servicios Incluídos:'
              {...form.getInputProps('services', { type: 'checkbox' })}
            >
              <Checkbox value='Agua' label='Agua' />
              <Checkbox value='Electricidad' label='Electricidad' />
              <Checkbox value='Calefont' label='Calefont' />
              <Checkbox value='Internet' label='Internet' />
              <Checkbox value='Cocina' label='Cocina' />
              <Checkbox value='Cama' label='Cama' />
              <Checkbox value='Escritorio' label='Escritorio' />
              <Checkbox value='Closet' label='Closet' />
              <Checkbox value='Silla' label='Silla' />
              <Checkbox value='Lavandería' label='Lavandería' />
              <Checkbox value='Microondas' label='Microondas' />
              <Checkbox value='Refrigerador' label='Refrigerador' />
              <Checkbox value='Hervidor' label='Hervidor' />
              <Checkbox value='Mesa de Noche' label='Mesa de Noche' />
              <Checkbox value='TV Cable' label='TV Cable' />
            </Checkbox.Group>
          </div>
          <Divider mb={18} />
          <div className='pb-6'>
            <Select
              label='Estado de Arriendo:'
              description='Si esta arrendada, se pueda asignar al arrendatario de inmediato'
              placeholder='Elige entre Arrendada o Vacante'
              classNames={{ label: 'font-bold' }}
              data={[
                { value: 'Sí', label: 'Arrendada' },
                { value: 'No', label: 'Vacante' },
              ]}
              {...form.getInputProps('isRented', { type: 'input' })}
            />
          </div>
          {form.values.isRented === 'Sí' && (
            <>
              <div className='mb-6 p-4 bg-blue-50 rounded-md'>
                <Select
                  clearable
                  allowDeselect
                  searchable
                  defaultValue={formConfig[type].formInitialValues.assignRenter}
                  required={form.values.isRented === 'Sí'}
                  nothingFound='Nombre No Encontrado'
                  label='Asignar Arrendatario a pieza:'
                  description='Si el arrendatario no está registrado, puede registrarlo más tarde en el página de arrendatarios.'
                  placeholder='Elige a un arrendatario(a)'
                  classNames={{ label: 'font-bold' }}
                  itemComponent={SelectItem}
                  data={docsList[0]?.id ? rentersListData : []}
                  icon={<Icon kind='user' svgCss='h-3 w-3' />}
                  {...form.getInputProps('assignRenter', { type: 'input' })}
                  maxDropdownHeight={280}
                />
              </div>
            </>
          )}
          <div>
            <Select
              label='Pieza Habilitada'
              placeholder='Sí o No'
              classNames={{ label: 'font-bold' }}
              description='Si la pieza está habilitada para ser arrendada.'
              data={[
                { value: 'Sí', label: 'Sí' },
                { value: 'No', label: 'No' },
              ]}
              {...form.getInputProps('isRoomAvailable', { type: 'input' })}
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
