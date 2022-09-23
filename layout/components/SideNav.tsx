import Icon, { Icons } from '@/icons/Icon';
import { Navbar } from '@mantine/core';
import Link from 'next/link';

type DataProps = {
  link: string;
  label: string;
  icon: Icons;
};

export default function SideNav({ router }) {
  const data: DataProps[] = [
    { link: '/inicio', label: 'Inicio', icon: 'home' },
    { link: '/piezas', label: 'Piezas', icon: 'dooropen' },
    { link: '/arrendatarios', label: 'Arrendatarios', icon: 'renter' },
    { link: '/finanzas', label: 'Finanzas', icon: 'money' },
  ];

  const financeLinks: DataProps[] = [
    {
      link: '/finanzas/ingresos',
      label: 'Ingresos',
      icon: 'payment',
    },
    {
      link: '/finanzas/gastos',
      label: 'Gastos',
      icon: 'expense',
    },
  ];

  const links = data.map((item) => (
    <Link href={item.link} key={item.label}>
      <a className='grid text-neutral-600'>
        <span
          className={`group rounded-md py-3 px-3 flex ${
            router.pathname === item.link ? 'bg-blue-100' : 'hover:bg-blue-50'
          }`}
        >
          <Icon
            kind={item.icon}
            divCss='pr-3 flex justify-center items-center'
            svgCss={`h-5 w-5 text-neutral-600`}
          />
          <span
            className={`${
              router.asPath === item.link ? 'font-bold text-black' : ''
            }`}
          >
            {item.label}
          </span>
        </span>
        {item.link === '/finanzas' &&
          financeLinks.map((finance) => (
            <span
              className={`rounded-md ${
                router.asPath === finance.link
                  ? 'bg-blue-100'
                  : 'hover:bg-blue-50'
              }`}
              key={finance.link}
            >
              <Link href={finance.link}>
                <div className='py-3 px-3 flex'>
                  <Icon
                    kind={finance.icon}
                    divCss='ml-5 pr-3 flex justify-center items-center'
                    svgCss={`h-[1.18rem] w-[1.18rem] text-neutral-600`}
                  />
                  <span
                    className={`${
                      router.asPath === finance.link
                        ? 'font-bold text-black'
                        : ''
                    }`}
                  >
                    {finance.label}
                  </span>
                </div>
              </Link>
            </span>
          ))}
      </a>
    </Link>
  ));
  return (
    <aside className='hidden lg:block lg:z-50 lg:fixed lg:top-[4.4375rem] lg:inset-x-0 lg:w-[17rem] xl:pl-1 xl:w-[20rem] bg-white'>
      <Navbar p='md'>
        <Navbar.Section grow>{links}</Navbar.Section>
      </Navbar>
    </aside>
  );
}
