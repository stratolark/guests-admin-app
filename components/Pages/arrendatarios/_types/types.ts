import { type FieldValue } from 'firebase/firestore';
import { AddDoc, UpdateDoc } from '@/components/Pages/_shared/firebase';
// import { AppDate } from '@/components/Pages/_shared/_types/types';

export type RenterProps = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  rut: string;
  phone: string;
  rentStatus: 'activo' | 'inactivo';
  room: string;
  rentStart: any;
  rentEnd: any;
  roomValue?: number;
  key?: string;
  created_at?: string | Date;
  last_updated_at?: string | Date | FieldValue;
};

export type FormConfigProps = {
  add: {
    formInitialValues: RenterProps;
    modalTitle: 'Añadir Arrendatario';
    defaultUserId: number;
    callToActionBtn: 'Confirmar';
    firestoreFn: typeof AddDoc;
  };
  edit: {
    formInitialValues: RenterProps;
    modalTitle: 'Editar Datos De Arrendatario';
    defaultUserId: number;
    callToActionBtn: 'Guardar';
    firestoreFn: typeof UpdateDoc;
  };
};
