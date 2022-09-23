import { defaultCSS } from '@/components/Forms/defaultCSS';
import Icon from '@/icons/Icon';
import {
  Alert,
  Button,
  Container,
  Paper,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';

import { Auth, getAuth } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { CircleCheck, CircleX } from 'tabler-icons-react';
import { SendResetEmail } from '../_shared/firebase';

export default function Recovery() {
  const [auth, setAuth] = useState<Auth | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorCode, setErrorCode] = useState('');

  useEffect(() => {
    let _ignore = false;
    setAuth(getAuth());
    return () => {
      _ignore = true;
    };
  }, []);

  const form = useForm({
    initialValues: {
      email: '',
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });

  return (
    <Container size={420} my={40}>
      <Title
        align='center'
        sx={(theme) => ({
          fontFamily: `${theme.fontFamily}`,
          fontWeight: 900,
        })}
      >
        Reiniciar Contraseña
      </Title>
      <Paper withBorder shadow='md' p={30} mt={30} radius='md'>
        <form
          onSubmit={form.onSubmit(async (values) => {
            setIsLoading(true);

            try {
              await SendResetEmail(auth, values.email);
              setIsError(false);
              setIsSuccess(true);
              setIsLoading(false);
            } catch (error) {
              setErrorCode(error.code);
              setIsSuccess(false);
              setIsError(true);
              setIsLoading(false);
            }
          })}
        >
          {isSuccess && (
            <Alert
              icon={<CircleCheck size={16} />}
              title='Éxito!'
              color='teal'
              withCloseButton
              variant='filled'
              classNames={{ root: 'mt-4 mb-4' }}
              onClose={() => setIsSuccess(false)}
            >
              Se ha enviado un correo para recuperar la contraseña. Sigue la
              intrucciones en el correo para cambiarla.
            </Alert>
          )}
          {isError && (
            <Alert
              icon={<CircleX size={16} />}
              title='Error!'
              color='red'
              withCloseButton
              variant='filled'
              classNames={{ root: 'mt-4 mb-4' }}
              onClose={() => setIsError(false)}
            >
              {errorCode === 'auth/user-not-found'
                ? 'Este correo no existe en nuestra base de datos.'
                : 'Ha ocurrido un error. Por favor intente nuevamente más tarde.'}
            </Alert>
          )}
          <Text mb={14}>Ingresa el email de tu cuenta actual.</Text>
          <TextInput
            label='Email'
            id='email'
            name='email'
            placeholder='tu@email.com'
            autoComplete='username'
            autoCorrect='off'
            className='pb-3'
            classNames={defaultCSS.input}
            icon={
              <Icon kind='mail' svgCss='h-[15px] w-[15px] text-neutral-500' />
            }
            required
            {...form.getInputProps('email')}
          />
          <Button
            type='submit'
            className='btn'
            mt='xl'
            loading={isLoading}
            fullWidth
          >
            Enviar email de reinicio de contraseña
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
