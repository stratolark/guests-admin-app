import Icon, { Icons } from '@/icons/Icon';
import Link from 'next/link';
import { NextRouter, useRouter } from 'next/router';

type NavListProps = {
  name: string;
  icon: Icons;
};

const navItemList: NavListProps[] = [
  { name: 'Inicio', icon: 'home' },
  { name: 'Piezas', icon: 'dooropen' },
  { name: 'Arrendatarios', icon: 'renter' },
  { name: 'Finanzas', icon: 'money' },
  // { name: 'Usuario', icon: 'user' },
];

type BottomNavListProps = {
  navList: NavListProps[];
  router: NextRouter;
};
function BottomNavList({ navList, router }: BottomNavListProps) {
  return (
    <ul className='grid grid-cols-4 auto-cols-auto'>
      {navList.map((item, index) => (
        <li key={item.name + index} className=''>
          <Link href={`/${item.name.toLowerCase()}`}>
            <a
              title={item.name}
              className={`grid justify-center px-5 pt-2.5 pb-2.5 ${
                router.asPath === `/${item.name.toLowerCase()}`
                  ? 'white bg-blue-100 cursor-pointer font-bold'
                  : 'hover:bg-blue-100 hover:cursor-pointer text-neutral-600'
              }`}
            >
              <span>
                <Icon
                  kind={item.icon}
                  divCss='flex justify-center'
                  svgCss='h-[1.15rem] w-[1.15rem]'
                />
              </span>
              <span className='text-xs pt-1'>{item.name}</span>
            </a>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function FixedBottomNav() {
  const router = useRouter();
  return (
    <header className='z-[100] bg-neutral-50 border-t-[1px] border-neutral-300  w-full fixed bottom-0'>
      <nav>
        <BottomNavList navList={navItemList} router={router} />
      </nav>
    </header>
  );
}
