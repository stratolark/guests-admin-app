import 'dayjs/locale/es-mx';
import { Divider, Skeleton } from '@mantine/core';
import { Plus, TrendingDown, TrendingUp } from 'tabler-icons-react';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import relativeTime from 'dayjs/plugin/relativeTime';
import Link from 'next/link';
dayjs.extend(relativeTime);
type MonthlyFinancesProps = {
  currentFinances: {
    payments: number;
    expenses: number;
    finances: number;
    last_updated_at: any;
  };
  isLoading: boolean;
};
export default function MonthlyFinances({
  currentFinances,
  isLoading,
}: MonthlyFinancesProps) {
  const monthlyFinanceData = [
    {
      name: 'Ingresos',
      link: '/finanzas/ingresos',
      icon: <TrendingUp size={22} strokeWidth={1.7} color={'green'} />,
      ammount: currentFinances?.payments,
      sign: '+',
      ammountColor: 'text-green-600',
    },
    {
      name: 'Gastos',
      link: '/finanzas/gastos',
      icon: <TrendingDown size={22} strokeWidth={1.7} color={'red'} />,
      ammount: currentFinances?.expenses,
      sign: '-',
      ammountColor: 'text-rose-600',
    },
    {
      name: 'Ganancias',
      link: false,
      icon: <Plus size={22} strokeWidth={1.7} color={'blue'} />,
      ammount: currentFinances?.finances,
      sign: currentFinances?.finances > 0 ? '+' : '',
      ammountColor:
        currentFinances?.finances > 0 ? 'text-blue-600' : 'text-gray-600',
    },
  ];
  return (
    <section>
      <div className='bg-white rounded-md py-4 px-6'>
        {monthlyFinanceData?.length !== 0 &&
          monthlyFinanceData?.map((finance, index) => (
            <div key={finance.name + index}>
              <div className='py-[1.13rem] flex items-center'>
                <div className='w-1/2 flex items-center'>
                  <div className=' pl-0 pr-4'>{finance.icon}</div>
                  {finance.link ? (
                    <Link href={finance.link as string}>
                      <a className='font-bold text-base'>{finance.name}</a>
                    </Link>
                  ) : (
                    <h3 className='font-bold text-base'>{finance.name}</h3>
                  )}
                </div>
                <div
                  className={`w-1/2 text-right pr-4 font-bold ${finance.ammountColor}`}
                >
                  <Skeleton visible={isLoading} className='after:bg-blue-100'>
                    {finance.sign}
                    {new Intl.NumberFormat('es-CL', {
                      style: 'currency',
                      currency: 'CLP',
                    }).format(finance.ammount || 0)}
                  </Skeleton>
                </div>
              </div>
              {index !== monthlyFinanceData?.length - 1 && (
                <Divider my={10} className='opacity-50' />
              )}
              {currentFinances?.last_updated_at &&
                index === monthlyFinanceData?.length - 1 && (
                  <p className='pt-1.5 pb-2 text-neutral-400 text-sm text-center'>
                    Actualizado{' '}
                    {dayjs(
                      new Date(currentFinances?.last_updated_at?.seconds * 1000)
                    )
                      .locale('es')
                      .fromNow()}
                  </p>
                )}
            </div>
          ))}
      </div>
    </section>
  );
}
