import dayjs from 'dayjs';
import { useAuthUser } from 'next-firebase-auth';
import { FinanceProps } from '../_types/types';
import ReceiptMenu from './ReceiptMenu';

type SingleReceiptProps = {
  doc: FinanceProps;
  categories: {
    [key: string]: string;
  };
  handleEdit: () => void;
  handleDelete: () => void;
  [x: string]: any;
};

export default function SingleReceipt({
  doc,
  categories,
  handleEdit,
  handleDelete,
  ...rest
}: SingleReceiptProps) {
  const auth = useAuthUser();
  return (
    <div className='flex mt-2 bg-white rounded py-5 pl-6 pr-0 mb-5' {...rest}>
      <div className='w-full'>
        <div className='flex pb-4'>
          <div className='w-2/3'>
            <div className='grid'>
              <h3 className='leading-tight font-bold'>{doc?.itemName}</h3>
              <span className='mt-1.5 text-neutral-500 text-xs'>
                Id: {doc?.key}
              </span>
            </div>
            <p className='pt-3 text-sm text-neutral-600'>
              {dayjs(new Date(doc?.addedByDate?.seconds * 1000))
                .locale('es')
                .format('LLLL')}
            </p>
          </div>
          <div className='w-1/3'>
            <p
              className={`text-right font-bold ${
                doc?.type === 'payment' ? 'text-green-500' : ''
              } ${doc?.type === 'expense' ? 'text-rose-500' : ''}`}
            >
              {doc?.type === 'payment' && '+'}
              {doc?.type === 'expense' && '-'}
              {new Intl.NumberFormat('es-CL', {
                style: 'currency',
                currency: 'CLP',
              }).format(doc?.itemAmmount || 0)}
            </p>
          </div>
        </div>
        <div className='text-sm p-2'>
          <div className='flex justify-between pb-1'>
            <p className='w-1/3 text-neutral-500'>Pagado por:</p>
            <span className='w-2/3'>{doc?.addedByItemValue}</span>
          </div>
          <div className='flex justify-between pb-1'>
            <p className='w-1/3 text-neutral-500'>Categoría:</p>
            <span className='w-2/3'>{categories[doc?.categoryItemValue]}</span>
          </div>
          <div className='flex justify-between pb-1'>
            <p className='w-1/3 text-neutral-500'>Notas:</p>
            <span className='w-2/3'>
              {doc?.notesValue === '' ? 'Sin notas' : doc?.notesValue}
            </span>
          </div>
          {doc?.uploadImagesUrls && (
            <>
              {doc?.uploadImagesUrls?.length !== 0 && (
                <div className='flex pt-3 '>
                  <p className='w-1/3 text-neutral-500'>Imágenes:</p>
                  <div className='w-2/3 flex flex-wrap'>
                    {doc?.uploadImagesUrls?.map((url, index) => (
                      <a
                        key={url + index}
                        href={url}
                        target='_blank'
                        rel='noreferrer'
                        className='mr-3 mb-1.5 underline text-blue-500 text-center'
                        title={`Imagen ${index + 1}`}
                      >
                        <span> Imagen {index + 1}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <div className='pl-3 pr-4 flex-auto'>
        {(auth?.claims?.manager || auth?.claims?.admin) &&
          auth?.emailVerified && (
            <ReceiptMenu
              handleDelete={() => handleDelete()}
              handleEdit={() => handleEdit()}
            />
          )}
      </div>
    </div>
  );
}
