import { QuickStartLinks } from '../_types/types';

export const startData = {
  currentDate: 'Marzo 25, 2022',
  rentedRooms: 7,
  profit: 480000,
};
export const startLinks: QuickStartLinks = [
  {
    href: '/piezas',
    name: 'Piezas',
    description: 'Ver información de piezas',
    icon: 'dooropen',
  },
  {
    href: '/finanzas',
    name: 'Finanzas',
    description: 'Administrar Pagos, Gastos y más',
    icon: 'money',
  },
  {
    href: '/arrendatarios',
    name: 'Arrendatarios',
    description: 'Ver información de arrendatarios',
    icon: 'renter',
  },
  {
    href: '/usuario',
    name: 'Usuario',
    description: 'Ver tu perfil de usuario',
    icon: 'user',
  },
];

export const financeLinks: QuickStartLinks = [
  {
    href: '/finanzas/ingresos',
    name: 'Pagos (Ingresos)',
    description: 'Ver y añadir pagos',
    icon: 'payment',
  },
  {
    href: '/finanzas/gastos',
    name: 'Gastos',
    description: 'Ver y añadir gastos',
    icon: 'expense',
  },
  // {
  //   href: '/finanzas/analisis',
  //   name: 'Análisis',
  //   description: 'Ver detalles de pagos, gastos, y ganancias reales',
  //   icon: 'stock',
  // },
];
