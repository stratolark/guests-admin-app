import { month } from '@/data/months';
import Icon from '@/icons/Icon';
import { Badge, Divider } from '@mantine/core';
import 'dayjs/locale/es';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { FinanceProps } from '@/components/Pages/finanzas/_types/types';
dayjs.extend(localizedFormat);

export default function Payments({
  paymentDocs,
}: {
  paymentDocs: FinanceProps[] | any[];
}) {
  return (
    <div className='grid gap-2'>
      {paymentDocs !== undefined && !!paymentDocs && paymentDocs?.length !== 0 && (
        <>
          <div className='bg-white p-4 rounded-md'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center'>
                <Icon kind='nextpayment' svgCss='h-4 w-4' />
                <span className='ml-3 font-bold'>Próximo Pago</span>
              </div>
              <Badge variant='filled' color='yellow'>
                Pendiente
              </Badge>
            </div>
            <div className='flex items-center justify-between mt-2'>
              <div>
                <span>
                  {dayjs(new Date(paymentDocs[0]?.created_at.seconds * 1000))
                    .add(1, 'month')
                    .locale('es')
                    .fromNow()}
                </span>
              </div>
              <div>
                {month[paymentDocs[0]?.addedByMonthIndex + 1]},{' '}
                {paymentDocs[0]?.addedByYear}
              </div>
            </div>
          </div>
          <Divider label='Pagos' labelPosition='center' my={10} />
        </>
      )}
      {paymentDocs !== undefined &&
        !!paymentDocs &&
        paymentDocs?.length !== 0 &&
        paymentDocs?.map((paymentDoc: any) => (
          <div key={paymentDoc.key} className='bg-white p-4 rounded-md'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center'>
                <Icon kind='invoicedollar' svgCss='h-4 w-4' />
                <span className='ml-3'>
                  {paymentDoc.categoryItemValue === 'renting'
                    ? 'Arriendo'
                    : 'Otros'}
                </span>
              </div>
              <Badge variant='filled' color='teal'>
                Pagado
              </Badge>
            </div>
            <div className='flex items-center justify-between mt-2'>
              <span className='font-bold'>
                {paymentDoc.itemAmmount > 0
                  ? new Intl.NumberFormat('es-CL', {
                      style: 'currency',
                      currency: 'CLP',
                    }).format(paymentDoc.itemAmmount) + ' pesos'
                  : 'No Especificado'}
              </span>
              <div>
                {month[paymentDoc.addedByMonthIndex]}, {paymentDoc.addedByYear}
              </div>
            </div>
            <div>
              <div className='mt-3 grid gap-0.5 text-xs text-neutral-500'>
                <span>
                  {dayjs(new Date(paymentDoc.created_at.seconds * 1000))
                    .locale('es')
                    .format('LLLL')}
                </span>
                <span>Id: {paymentDoc.receiptId}</span>
              </div>
            </div>
          </div>
        ))}
      {paymentDocs === undefined ||
        (paymentDocs?.length === 0 && (
          <div className='bg-white text-center p-8'>
            Aún no hay pagos registrados.
          </div>
        ))}
    </div>
  );
}
