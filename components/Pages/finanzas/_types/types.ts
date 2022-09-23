import { Icons } from '@/icons/Icon';
import { FieldValue } from 'firebase/firestore';
import { AddDoc } from '@/components/Pages/_shared/firebase';
import {
  AppDate,
  CollectionName,
} from '@/components/Pages/_shared/_types/types';
import { type SelectItem } from '@mantine/core';
import { type Dispatch, type SetStateAction } from 'react';

export type NextStep =
  | 'renterMonthlyPayment'
  | 'internetBill'
  | 'electricityBill'
  | 'waterBill'
  | 'gasBill'
  | 'maintenanceBill'
  | 'customPayment'
  | 'customExpense'
  | 'none';

export type FinanceConfig = {
  recurrent: {
    icon: Icons;
    title: string;
    nextStep: NextStep;
  }[];
  other: {
    icon: Icons;
    title: string;
    desc: string;
    nextStep: NextStep;
  }[];
};

export type FinanceType = 'payment' | 'expense' | 'none';

export type FinanceProps = {
  type: FinanceType;
  // categoryItemIcon: Icons;
  categoryItemValue: string;
  addedByItemValue: string;

  itemName: string;
  itemAmmount: number;
  addedByDate: any;
  // addedByDate: Date;
  notesValue: string;
  key?: string;
  addedByItemValueID?: number | string;
  addedByItemValueKEY?: string;
  addedByMonthIndex?: number;
  addedByYear?: number;
  receiptId?: string;
  createdBy?: string;
  created_at?: string | Date;
  last_updated_at?: string | Date | FieldValue;
  uploadImagesUrls?: string[];
};
export type FinanceFormConfigProps = {
  payment: {
    initialValues: FinanceProps;
    firestoreFn: typeof AddDoc;
    collectionName: CollectionName;
  };
  expense: {
    initialValues: FinanceProps;
    firestoreFn: typeof AddDoc;
    collectionName: CollectionName;
  };
  none: {
    initialValues: FinanceProps;
    firestoreFn: typeof AddDoc;
    collectionName: CollectionName;
  };
};

export type FinanceFormProps = {
  errors: any;
  type: FinanceType;
  categoryItems: SelectItem[];
  categoryItemValue: string;
  setCategoryItemValue: any;
  addedByItems: SelectItem[];
  addedByItemValue: string;
  setAddedByItemValue: any;
  itemName: string;
  setItemName: any;
  itemAmmount: number;
  setItemAmmount: any;
  addedByDate: AppDate;
  setAddedByDate: any;
  notesValue: string;
  setNotesValue: any;
  uploadFiles: any;
  setUploadFiles: any;
  imagesUrls: string[];
  selectImage: string[];
  setSelectImage: Dispatch<SetStateAction<string[]>>;
};

export type FinancesProps = {
  payments: number;
  expenses: number;
  last_updated_at: any;
};
