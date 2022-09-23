import Link from 'next/link';
import { config } from '@/data/config';
import Icon, { type Icons } from '@/icons/Icon';
import { Auth, getAuth, signOut } from 'firebase/auth';
import { useAuthUser } from 'next-firebase-auth';
import { useEffect, useState } from 'react';
import MobileNav from './MobileNav';
import { Avatar, Button, Group, Navbar, Text } from '@mantine/core';
import { useRouter } from 'next/router';
import VerifyEmailAlert from './VerifyEmailAlert';

type DataProps = {
  link: string;
  label: string;
  icon: Icons;
};

export default function Header() {
  const [showVerifyEmailAlert, setShowVerifyEmailAlert] = useState(false);

  const [auth, setAuth] = useState<Auth | null>(null);

  useEffect(() => {
    setAuth(getAuth());
  }, []);
  const [renderAuth, setRenderAuth] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setRenderAuth(true);
    }
  }, []);

  const AuthUser = useAuthUser();
  const router = useRouter();

  const data: DataProps[] = [
    { link: '/inicio', label: 'Inicio', icon: 'home' },
    { link: '/piezas', label: 'Piezas', icon: 'dooropen' },
    { link: '/arrendatarios', label: 'Arrendatarios', icon: 'user' },
    { link: '/finanzas', label: 'Finanzas', icon: 'money' },
  ];
  if (AuthUser.claims?.admin && AuthUser?.emailVerified) {
    data.push({
      link: '/administracion',
      label: 'Administración',
      icon: 'wrench2',
    });
  }
  const links = data.map((item) => (
    <Link href={item.link} key={item.label}>
      <a
        className={`group flex font-medium p-2.5 text-neutral-600 hover:bg-blue-100 rounded-md ${
          router.asPath === item.link
            ? 'font-bold bg-blue-100 text-blue-600'
            : 'hover:bg-blue-50 hover:text-black'
        }`}
      >
        <Icon
          kind={item.icon}
          divCss='pr-3 flex justify-center items-center'
          svgCss={`h-5 w-5 text-neutral-600 ${
            router.asPath === item.link
              ? 'text-blue-600'
              : 'group-hover:text-black'
          }`}
        />
        <span>{item.label}</span>
      </a>
    </Link>
  ));
  // console.log(AuthUser);

  useEffect(() => {
    if (AuthUser.email !== null && !AuthUser.emailVerified)
      setShowVerifyEmailAlert(true);
  }, [AuthUser.email]);

  return (
    <>
      {AuthUser.email !== null &&
        !AuthUser.emailVerified &&
        showVerifyEmailAlert && (
          <VerifyEmailAlert
            auth={auth as Auth}
            isVisible={showVerifyEmailAlert}
            setIsVisible={() => setShowVerifyEmailAlert(false)}
          />
        )}
      <header className='py-4 px-4 flex justify-between'>
        <div className='flex'>
          <Link href='/'>
            <a
              className='flex text-neutral-900 font-bold text-xl max-w-[1rem] items-center'
              title={config.appName}
            >
              <Icon kind='home' divCss='pr-3' svgCss='h-5 w-5 ' />
              {config.appName}
            </a>
          </Link>
        </div>
        <div className='flex'>
          <div>
            <MobileNav router={router}>
              <Navbar width={{ sm: 300 }} className='border-none flex'>
                <Navbar.Section className='flex flex-col'>
                  {links}
                </Navbar.Section>
                <Navbar.Section className='mt-6 border-t pt-6'>
                  <div>
                    {renderAuth
                      ? AuthUser.email && (
                          <Group>
                            <Link href='/usuario' passHref>
                              <a
                                title='Ir a Perfil de usuario'
                                className={`px-3 py-4 bg-blue-50 hover:bg-blue-100
                          rounded-md w-full ${
                            router.asPath === '/usuario' ? 'bg-blue-200' : ''
                          }`}
                              >
                                <Group>
                                  <Avatar radius='xl' color='primary' />
                                  <div>
                                    <Text color='blue' size='xs'>
                                      Usuario
                                    </Text>
                                    <Text
                                      weight='bold'
                                      variant='link'
                                      size='md'
                                    >
                                      {AuthUser.email
                                        ? AuthUser.email
                                        : 'Invitado'}
                                    </Text>
                                  </div>
                                </Group>
                              </a>
                            </Link>
                            <Button
                              className='btn mt-2 flex'
                              onClick={() => signOut(auth as Auth)}
                            >
                              <Icon
                                kind='logout'
                                divCss='pr-2 flex justify-center items-center'
                                svgCss='h-5 w-5'
                              />
                              Cerrar Sesión
                            </Button>
                          </Group>
                        )
                      : null}
                  </div>
                </Navbar.Section>
              </Navbar>
            </MobileNav>
          </div>
        </div>
      </header>
    </>
  );
}
