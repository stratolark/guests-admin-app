import { Icons } from '@/icons/Icon';

export type AppDate = { seconds: number; nanoseconds: number } | Date;

export type AppLinks =
  | '/inicio'
  | '/piezas'
  | '/arrendatarios'
  | '/finanzas'
  | '/usuario'
  | '/administracion';
export type AppLinksNames =
  | 'Inicio'
  | 'Piezas'
  | 'Arrendatarios'
  | 'Finanzas'
  | 'Usuario'
  | 'Configuración'
  | 'Administración';
export type FinanceLinks =
  | '/finanzas/ingresos'
  | '/finanzas/gastos'
  | '/finanzas/analisis';
export type FinanceLinksNames = 'Pagos (Ingresos)' | 'Gastos' | 'Análisis';

export type NotificationSubject =
  | 'Arrendatario'
  | 'Pieza'
  | 'Datos'
  | 'Pago'
  | 'Gasto';
export type DeleteFormRedirects = '/arrendatarios' | '/piezas';
export type CollectionName =
  | 'renters'
  | 'rooms'
  | 'payments'
  | 'expenses'
  | 'Finances'
  | 'settings';
export type NotificationColor = 'teal' | 'red' | 'yellow' | 'blue';

export type QuickStartLinks = {
  href: AppLinks | FinanceLinks;
  name: AppLinksNames | FinanceLinksNames;
  description: string;
  icon: Icons;
}[];
export type QuickStartProps = {
  links: QuickStartLinks;
};
