import queryFilter from '@/lib/utils/queryFilter';
import { useDebouncedValue } from '@mantine/hooks';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import localizedFormat from 'dayjs/plugin/localizedFormat';
dayjs.extend(localizedFormat);
import Search from '@/components/Pages/_shared/_components/Search';
import { useEffect, useState } from 'react';
import { FinanceProps, FinanceType } from '../_types/types';
import { groupByKey } from 'utils/groupBykey';
import SingleReceipt from './SingleReceipt';
import { month } from '@/data/months';
import stable from 'stable';
import DeleteDocForm from '../../_shared/_components/_forms/DeleteDocForm';
import { UpdateDocField } from '../../_shared/firebase';
import { increment, serverTimestamp } from 'firebase/firestore';
import ReceiptModal from './_modals/ReceiptModal';

type ReceiptProps = {
  financialDocs: FinanceProps[] | [];
  pageTitles: {
    [key: string]: string;
  };
};

export const collectionTable = {
  payment: 'payments',
  expense: 'expenses',
  other: null,
};

export const receiptTable = {
  payment: 'payment',
  expense: 'expense',
  none: 'none',
};

export default function ReceiptPage({
  financialDocs,
  pageTitles,
}: ReceiptProps) {
  const categories = {
    renting: 'Arriendo',
    service: 'Servicios',
    maintenance: 'Mantención',
    other: 'Otros',
  };
  const [openFinanceModal, setOpenFinanceModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const [debouncedSearchValue] = useDebouncedValue(searchValue, 300);

  const [filteredRenterList, setFilteredRenterList] = useState(financialDocs);

  const [selectedDoc, setSelectedDoc] = useState<FinanceProps | any>(null);
  const [receiptType, setReceiptType] = useState<FinanceType>('none');

  useEffect(() => {
    let _ignore = false;
    setReceiptType(receiptTable[selectedDoc?.type as string]);
    return () => {
      _ignore = true;
    };
  }, [receiptType, selectedDoc]);

  useEffect(() => {
    setFilteredRenterList(queryFilter(financialDocs, debouncedSearchValue));
  }, [debouncedSearchValue, financialDocs]);

  const yearIndex: string = 'addedByYear';
  const newYearDocs = groupByKey(filteredRenterList, yearIndex);

  const yearArr: any = [];
  for (const doc in newYearDocs) {
    yearArr.push(newYearDocs[doc]);
  }

  type FinalYearArr = {
    year: number;
    months: {
      [key: string]: FinanceProps[];
    };
  };
  const finalYearArr: FinalYearArr[] = yearArr?.map((year: FinalYearArr[]) => {
    return {
      year: year[0][yearIndex],
      months: groupByKey<FinalYearArr>(year, 'addedByMonthIndex'),
    };
  });

  const orderedFinancialDocs = stable(finalYearArr, (a, b) => b.year - a.year);

  const currentMonth = dayjs().month().toString();

  function handleEditDoc(doc: FinanceProps) {
    // TODO: this might not be needed
    setReceiptType(receiptTable[selectedDoc?.type as string]);
    setSelectedDoc(doc);
    setOpenFinanceModal(true);
  }
  function handleDeleteDoc(doc: FinanceProps) {
    setSelectedDoc(doc);
    setOpenDeleteModal(true);
  }

  return (
    <section className='pb-8'>
      <div className='pb-4'>
        <Search
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          handleEscapeKeyPress={() => setSearchValue('')}
        />
      </div>
      <h2 className='pb-6'>
        <span className='font-bold pr-3'>Lista de {pageTitles?.title}:</span>
        <span className='text-sm italic text-neutral-400 '>
          {filteredRenterList?.length !== 0 ? filteredRenterList?.length : '0'}{' '}
          {filteredRenterList?.length > 1
            ? pageTitles?.plural
            : pageTitles?.singular}
        </span>
      </h2>
      <div>
        {financialDocs?.length === 0 && (
          <div className='w-full text-center my-5'>
            Aún no hay datos registrados. Intenta agregar uno nuevo en la página
            de Finanzas.
          </div>
        )}
        {financialDocs?.length > 0 && (
          <>
            {orderedFinancialDocs?.map((year, index) => (
              <div key={year + '-' + index}>
                <h2 className='font-bold text-xl pt-2.5'>{year.year}</h2>

                {stable(
                  [...Object.keys(year.months)],
                  (a: any, b: any) => b - a
                ).map((monthName, monthIdx) => (
                  <div key={monthName + '-' + monthIdx}>
                    <h2 className='font-semibold pb-2 pt-2.5 flex items-center'>
                      {month[monthName]}{' '}
                      {monthName === currentMonth ? '(Mes Actual)' : ''}
                      <span className='text-sm ml-2 text-neutral-400 font-normal'>
                        {year.months[monthName].length}{' '}
                        {year.months[monthName].length > 1
                          ? pageTitles?.plural
                          : pageTitles?.singular}{' '}
                      </span>
                    </h2>
                    <div>
                      {year.months[monthName].map((doc) => (
                        <SingleReceipt
                          handleDelete={() => handleDeleteDoc(doc)}
                          handleEdit={() => handleEditDoc(doc)}
                          doc={doc}
                          key={doc.key}
                          categories={categories}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </>
        )}
        {filteredRenterList?.length === 0 && financialDocs?.length !== 0 && (
          <div className='text-center py-12'>
            <h3 className='font-bold text-xl'>
              Lo sentimos, no hay datos con ese nombre :(
            </h3>
          </div>
        )}
        {financialDocs?.length > 0 && filteredRenterList?.length !== 0 && (
          <div className='pt-2 pb-4 text-sm italic text-neutral-400 text-center'>
            Fin de Lista
          </div>
        )}
      </div>
      <ReceiptModal
        open={openFinanceModal}
        setOpen={setOpenFinanceModal}
        doc={selectedDoc}
        type={receiptType}
      />
      <DeleteDocForm
        key={selectedDoc?.key}
        onSubmit={async () => {
          // TODO: remove uploaded images from storage
          await UpdateDocField(
            {
              [collectionTable[selectedDoc?.type as string]]: increment(
                -selectedDoc.itemAmmount
              ) as any,
              last_updated_at: serverTimestamp(),
            },
            'Finances',
            `${month[selectedDoc?.addedByMonthIndex]}-${
              selectedDoc?.addedByYear
            }`
          );
        }}
        deleteDataFrom={{
          title: selectedDoc?.itemName ?? 'Pago',
          desc: 'del pago',
          notificationSubject: 'Pago',
        }}
        opened={openDeleteModal}
        setOpened={setOpenDeleteModal}
        collectionName={collectionTable[selectedDoc?.type as string]}
        docKey={selectedDoc?.key ?? ''}
      />
    </section>
  );
}
