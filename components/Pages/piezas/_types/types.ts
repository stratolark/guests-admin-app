import { type Icons } from '@/icons/Icon';
import { type FieldValue } from 'firebase/firestore';
import { AddDoc, UpdateDoc } from '@/components/Pages/_shared/firebase';
import { RenterProps } from '../../arrendatarios/_types/types';
export type Services = [
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
  'TV Cable'
];
export type RoomProps = {
  id: number;
  number: string;
  isRented: 'Sí' | 'No';
  assignRenter: string;
  hasRenterPayed: 'Sí' | 'No';
  hasBathroom: 'Sí' | 'No';
  monthlyPayment: number;
  nextPayment: string;
  bathroomType:
    | ['Privado (interno)' | 'Privado (externo)' | 'Compartido']
    | ['']
    | ''
    | 'Privado (interno)'
    | 'Privado (externo)'
    | 'Compartido';
  services: Partial<Services | []>;
  key?: string;
  created_at?: string | Date;
  last_updated_at?: string | Date | FieldValue;
  assignRenterData?: Partial<RenterProps>;
  isRoomAvailable?: 'Sí' | 'No';
};

export type RoomFormConfigProps = {
  add: {
    formInitialValues: RoomProps;
    modalTitle: 'Añadir Pieza';
    callToActionBtn: 'Confirmar';
    defaultRoomId: number;
    firestoreFn: typeof AddDoc;
  };
  edit: {
    formInitialValues: RoomProps;
    modalTitle: 'Editar Datos De Pieza';
    callToActionBtn: 'Guardar';
    defaultRoomId: number;
    firestoreFn: typeof UpdateDoc;
  };
};

export type FieldsProps = {
  hasIcon?: boolean;
  icon: Icons;
  name: string;
  value: string;
};
