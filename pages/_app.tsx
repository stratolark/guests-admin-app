import '../styles/globlals.css';
import initAuth from '../utils/initAuth';
import Head from 'next/head';
import type { AppProps } from 'next/app';
import Layout from '../layout';
import { MantineProvider, createEmotionCache } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import colors from 'tailwindcss/colors';

initAuth();

export const mantineEmoCache = createEmotionCache({ key: 'mantine' });

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider
      emotionCache={mantineEmoCache}
      withGlobalStyles
      withNormalizeCSS
      theme={{
        primaryShade: 5,
        colors: {
          red: [
            colors.rose[50],
            colors.rose[100],
            colors.rose[200],
            colors.rose[300],
            colors.rose[400],
            colors.rose[500],
            colors.rose[600],
            colors.rose[700],
            colors.rose[800],
            colors.rose[900],
          ],
          neoBlue: [
            colors.blue[50],
            colors.blue[100],
            colors.blue[200],
            colors.blue[300],
            colors.blue[400],
            colors.blue[500],
            colors.blue[600],
            colors.blue[700],
            colors.blue[800],
            colors.blue[900],
          ],
        },
        primaryColor: 'neoBlue',
        fontFamily: 'Open Sans, sans-serif',
        components: {
          DatePicker: {
            classNames: {
              label: '!font-bold',
            },
          },
          TextInput: {
            classNames: {
              label: '!font-bold',
            },
          },
          Textarea: {
            classNames: {
              label: '!font-bold',
            },
          },
          Checkbox: {
            classNames: {
              label: '!font-bold',
            },
          },
          NumberInput: {
            classNames: {
              label: '!font-bold',
            },
          },
          Select: {
            classNames: {
              label: '!font-bold',
            },
          },
          Modal: {
            classNames: {
              title: 'font-bold !text-lg',
              modal: 'my-0 !ml-0 lg:!w-[32rem] mr-0 p-6',
            },
          },
        },
      }}
    >
      <NotificationsProvider
        autoClose={5000}
        position='top-right'
        zIndex={9999}
      >
        <Layout>
          <>
            <Head>
              <meta
                content='width=device-width, initial-scale=1'
                name='viewport'
              />
            </Head>
            <Component {...pageProps} />
          </>
        </Layout>
      </NotificationsProvider>
    </MantineProvider>
  );
}

export default MyApp;
