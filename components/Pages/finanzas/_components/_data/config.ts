import { FinanceConfig } from '../../_types/types';

export const paymentConfig: FinanceConfig = {
  recurrent: [
    {
      icon: 'renter',
      title: 'Pago Mensual Arrendatario',
      nextStep: 'renterMonthlyPayment',
    },
  ],
  other: [
    {
      icon: 'customize',
      title: 'Personalizado',
      desc: 'Añadir pago perzonalizado como cualquier dinero extra recibo para uso en la pensión',
      nextStep: 'customPayment',
    },
  ],
};

export const expenseConfig: FinanceConfig = {
  recurrent: [
    {
      icon: 'router',
      title: 'Internet y Tv Cable (Vtr)',
      nextStep: 'internetBill',
    },
    {
      icon: 'lightbulb',
      title: 'Elecricidad',
      nextStep: 'electricityBill',
    },
    {
      icon: 'waterdrop',
      title: 'Agua',
      nextStep: 'waterBill',
    },
    {
      icon: 'gastank',
      title: 'Gas Licuado',
      nextStep: 'gasBill',
    },
    {
      icon: 'toolbox',
      title: 'Mantención',
      nextStep: 'maintenanceBill',
    },
  ],
  other: [
    {
      icon: 'customize',
      title: 'Personalizado',
      desc: 'Añadir gasto perzonalizado como cualquier dinero extra cobrado para uso en la pensión',
      nextStep: 'customExpense',
    },
  ],
};
