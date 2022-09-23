import * as Yup from 'yup';
import { useForm, yupResolver } from '@mantine/form';

import {
  TextInput,
  PasswordInput,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
} from '@mantine/core';
import Link from 'next/link';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import Icon from '@/icons/Icon';
import { defaultCSS } from './defaultCSS';

const LoginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email('El e-mail debe ser un email válido. Ejemplo: tu@email.com')
    .required('Requerido'),
  password: Yup.string().required('Requerido'),
  rememberMe: Yup.boolean().oneOf([true, false]),
});

export function Login() {
  const form = useForm({
    validateInputOnChange: true,
    validate: yupResolver(LoginValidationSchema),
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  function FirebaseLogin(values: any) {
    form.clearErrors();
    const { email, password } = values;
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        console.log('Login Sucessfull');
      })
      .catch(() => {
        form.setErrors({
          email: 'Email o Contraseña incorrecta.',
          password: 'Email o Contraseña incorrecta.',
        });
      });
  }

  return (
    <Container size={420} my={40}>
      <Title
        align='center'
        sx={(theme) => ({
          fontFamily: `${theme.fontFamily}`,
          fontWeight: 900,
        })}
      >
        Bienvenido!
      </Title>
      <Text color='dimmed' size='sm' align='center' mt={5}>
        ¿Aún no tienes una cuenta?{' '}
        <Link href='/registrarse' passHref>
          <Anchor<'a'> size='sm'>Crear Cuenta</Anchor>
        </Link>
      </Text>
      <Paper
        withBorder
        shadow='md'
        p={30}
        mt={30}
        radius='md'
        className='min-w-[20rem] max-w-[20rem]'
      >
        <form onSubmit={form.onSubmit(async (values) => FirebaseLogin(values))}>
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
          <PasswordInput
            label='Contraseña'
            id='password'
            name='password'
            placeholder='Tu contraseña'
            autoComplete='current-password'
            autoCorrect='off'
            required
            className='pb-3'
            classNames={defaultCSS.input}
            icon={
              <Icon kind='lock' svgCss='h-[15px] w-[15px] text-neutral-500' />
            }
            mt='xs'
            {...form.getInputProps('password')}
          />
          <Group position='apart' mt='md'>
            <div>
              <Link href='/recovery'>
                <Anchor<'a'> size='sm' title='Olvidaste tu contraseña?'>
                  Olvidaste tu contraseña?
                </Anchor>
              </Link>
            </div>
          </Group>
          <Button type='submit' className='btn' fullWidth mt='xl'>
            Iniciar Sesión
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
