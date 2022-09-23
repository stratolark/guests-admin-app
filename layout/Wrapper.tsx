import { useMediaQuery } from '@mantine/hooks';
import { useAuthUser, withAuthUser } from 'next-firebase-auth';
import { useRouter } from 'next/router';
import React from 'react';
import FixedBottomNav from './components/FixedBottomNav';
import Footer from './components/Footer';
import Main from './components/Main';
import MobileHeader from './components/MobileHeader';
import SideNav from './components/SideNav';

function Wrapper({ children }: { children: React.ReactNode }) {
  const AuthUser = useAuthUser();
  const router = useRouter();
  const viewportMatch = useMediaQuery('(min-width: 1024px)', false);

  return (
    <>
      <MobileHeader AuthUser={AuthUser} />
      {AuthUser?.email && !viewportMatch && <FixedBottomNav />}
      <Main>
        {AuthUser?.email && viewportMatch && <SideNav router={router} />}
        <div className='lg:mt-24 lg:ml-[19rem] lg:mr-auto lg:w-[42rem] xl:mr-auto xl:ml-auto'>
          {children}
        </div>
      </Main>
      <Footer />
    </>
  );
}

export default withAuthUser<any>()(Wrapper);
