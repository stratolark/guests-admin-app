import { useEffect, useState } from 'react';
import { Drawer, Group, Burger } from '@mantine/core';

export default function MobileNav({ children, router }) {
  const [opened, setOpened] = useState(false);
  const title = opened ? 'Cerrar Navegación' : 'Abrir Navegación';

  useEffect(() => {
    const onRouteChangeStart = () => {
      setOpened(false);
    };
    router.events.on('routeChangeStart', onRouteChangeStart);
    return () => {
      router.events.off('routeChangeStart', onRouteChangeStart);
    };
  }, [router.events]);

  return (
    <>
      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        title='Menu'
        position='right'
        padding='xl'
        size='lg'
        transitionDuration={200}
        transitionTimingFunction='ease'
      >
        {children}
      </Drawer>
      <Group position='center'>
        <Burger
          opened={opened}
          onClick={() => setOpened((o) => !o)}
          title={title}
        />
      </Group>
    </>
  );
}
