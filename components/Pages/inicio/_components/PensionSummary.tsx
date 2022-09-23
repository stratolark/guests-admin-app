import { month } from '@/data/months';
import { Skeleton } from '@mantine/core';
import { FinancesProps } from '@/components/Pages/finanzas/_types/types';
import Icon, { type Icons } from '@/icons/Icon';

type PensionSummaryProps = {
  roomLength: number;
  financeData: FinancesProps | undefined;
  renterLength: number;
  isLoading: boolean;
};

type SummaryDataProps = {
  data: any;
  title: string;
  icon: Icons;
};

export default function PensionSummary({
  roomLength,
  financeData,
  renterLength,
  isLoading,
}: PensionSummaryProps) {
  const summaryData: SummaryDataProps[] = [
    {
      data: renterLength,
      title: 'Arrendatarios Activos',
      icon: 'renter',
    },
    {
      data: `+${new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
      }).format(financeData?.payments || 0)}`,
      title: 'en ingresos',
      icon: 'finance',
    },
    {
      data: roomLength,
      title: 'Habitaciones habilitadas',
      icon: 'roomrented',
    },
    {
      data: `-${new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
      }).format(financeData?.expenses || 0)}`,
      title: 'en gastos',
      icon: 'expense',
    },
  ];
  return (
    <div className='bg-white rounded-md py-6 px-6 mb-8'>
      <div>
        <h1 className='flex items-center text-lg font-bold'>
          <span>
            <Icon kind='calendar' svgCss='h-4 w-4' />
          </span>
          <span className='ml-3'>
            {`${month[new Date().getMonth()]} ${new Date().getFullYear()}`}
          </span>
        </h1>
      </div>
      <div className='mt-4 mb-3 grid grid-cols-2 grid-row-2 gap-8'>
        {summaryData?.map((item, index) => (
          <div key={item.title + index}>
            <Icon kind={item.icon} divCss='mb-1.5' svgCss='h-4 w-4' />
            <h2 className='grid'>
              <Skeleton
                visible={isLoading}
                height={48}
                className='inline-block after:!bg-blue-100'
              >
                {item.data} {item.title}
              </Skeleton>
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
}
