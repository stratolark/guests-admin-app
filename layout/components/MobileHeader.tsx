import Link from 'next/link';
import { config } from '@/data/config';
import Icon from '@/icons/Icon';
import { Auth, getAuth, signOut } from 'firebase/auth';
import { AuthUserContext } from 'next-firebase-auth';
import { useEffect, useState } from 'react';
import { Avatar, Divider, Group, Menu } from '@mantine/core';
import VerifyEmailAlert from './VerifyEmailAlert';
import { ChevronDown } from 'tabler-icons-react';
import { NextLink } from '@mantine/next';

export default function MobileHeader({
  AuthUser,
}: {
  AuthUser: AuthUserContext;
}) {
  const [openMenu, setOpenMenu] = useState(false);
  const [showVerifyEmailAlert, setShowVerifyEmailAlert] = useState(false);

  const [auth, setAuth] = useState<Auth | null>(null);

  useEffect(() => {
    setAuth(getAuth());
  }, []);

  useEffect(() => {
    if (AuthUser?.email !== null && !AuthUser?.emailVerified)
      setShowVerifyEmailAlert(true);
  }, [AuthUser?.email]);

  return (
    <>
      {AuthUser?.email !== null &&
        !AuthUser?.emailVerified &&
        showVerifyEmailAlert && (
          <VerifyEmailAlert
            auth={auth as Auth}
            isVisible={showVerifyEmailAlert}
            setIsVisible={() => setShowVerifyEmailAlert(false)}
          />
        )}
      <aside className='z-[99] w-full py-4 px-4 flex justify-between items-center lg:bg-white lg:fixed lg:top-0 lg:border-b-[1px] lg:border-neutral-200'>
        <div className='flex py-1.5'>
          <Link href='/'>
            <a
              className='flex text-neutral-900 font-bold text-xl max-w-[1rem] items-center'
              title={config.appName}
            >
              <Icon kind='home' divCss='pr-3' svgCss='h-5 w-5' />
              {config.appName}
            </a>
          </Link>
        </div>
        {AuthUser?.email !== null && (
          <div className='flex'>
            <div>
              <Menu
                transitionDuration={0}
                width={240}
                shadow='md'
                withArrow
                position='bottom-end'
                opened={openMenu}
                onChange={setOpenMenu}
              >
                <Menu.Target>
                  <Group className='cursor-pointer !gap-1'>
                    <Avatar
                      src={AuthUser?.photoURL ?? null}
                      className='h-[38px] w-[38px]'
                      radius='xl'
                      alt='Foto de perfil'
                    />
                    <ChevronDown size={15} />
                  </Group>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    component={NextLink}
                    href='/usuario'
                    title='Ir a Perfil'
                    className='hover:!bg-blue-100'
                  >
                    <div className='flex items-center'>
                      <Avatar
                        src={AuthUser?.photoURL ?? ''}
                        radius='xl'
                        alt='Foto de perfil'
                      />
                      <div className='ml-3 flex flex-col'>
                        <span className='text-base'>
                          {AuthUser?.displayName ??
                            AuthUser?.email?.split('@')[0]}
                          {!AuthUser?.email ?? ''}
                        </span>
                        <span className='text-sm text-neutral-500'>
                          {AuthUser?.email}
                        </span>
                      </div>
                    </div>
                  </Menu.Item>
                  <Divider my={5} className='!border-t-neutral-200' />
                  {AuthUser?.claims?.admin && AuthUser?.emailVerified && (
                    <>
                      <Menu.Item
                        className='hover:!bg-blue-100'
                        icon={
                          <Icon kind='wrench2' divCss='mr-2' svgCss='h-4 w-4' />
                        }
                        title='Administración'
                        component={NextLink}
                        href='/administracion'
                      >
                        <div className='flex items-center'>
                          <span>Administración</span>
                        </div>
                      </Menu.Item>
                      <Divider my={5} className='!border-t-neutral-200' />
                    </>
                  )}
                  <Menu.Item
                    className='hover:!bg-blue-100'
                    icon={
                      <Icon
                        kind='logout'
                        divCss='mr-2'
                        svgCss='h-4 w-4 text-blue-500'
                      />
                    }
                    title='Cerrar Sesión'
                    onClick={() => {
                      setOpenMenu(false);
                      signOut(auth as Auth);
                    }}
                  >
                    <div className='text-blue-500 font-medium flex items-center'>
                      <span>Cerrar Sesión</span>
                    </div>
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
// export default withAuthUser()(MobileHeader);
