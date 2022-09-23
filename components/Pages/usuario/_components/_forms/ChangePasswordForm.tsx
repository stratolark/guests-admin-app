import Icon from '@/icons/Icon';
import { Alert, Button, PasswordInput, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  reload,
  updatePassword,
  User,
} from 'firebase/auth';
import { AuthUserContext } from 'next-firebase-auth';
import { useState } from 'react';
import { CircleCheck, CircleX } from 'tabler-icons-react';
import { defaultCSS } from '../../../../Forms/defaultCSS';

interface ChangePasswordFormProps {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
}

export default function ChangePasswordForm({
  authUser,
}: {
  authUser: AuthUserContext;
}) {
  const [isPasswordChangeSuccessful, setIsPasswordChangeSuccessful] =
    useState(false);
  const [isPasswordChangeFailure, setIsPasswordChangeFailure] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const form = useForm<ChangePasswordFormProps>({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      newPasswordConfirm: '',
    },
  });

  return (
    <div>
      {isPasswordChangeSuccessful && (
        <Alert
          icon={<CircleCheck size={16} />}
          title='Éxito!'
          color='teal'
          withCloseButton
          variant='filled'
          classNames={{ root: 'mt-4 mb-4' }}
          onClose={() => setIsPasswordChangeSuccessful(false)}
        >
          Contraseña actualizada con éxito!
        </Alert>
      )}
      {isPasswordChangeFailure && (
        <Alert
          icon={<CircleX size={16} />}
          title='Error!'
          color='red'
          withCloseButton
          variant='filled'
          classNames={{ root: 'mt-4 mb-4' }}
          onClose={() => setIsPasswordChangeFailure(false)}
        >
          Ha ocurrido un error actualizando la contraseña. Por favor, revisa que
          los datos requiridos sean correctos o inténtalo de nuevo más tarde.
        </Alert>
      )}
      <form
        onSubmit={form.onSubmit(async (values: ChangePasswordFormProps) => {
          if (values.newPassword === '' && values.newPassword.length < 8) {
            form.setFieldError(
              'newPassword',
              'La contraseña debe tener al menos 8 caracteres'
            );
            return;
          }
          try {
            setIsFormLoading(true);
            const userCredential = EmailAuthProvider.credential(
              authUser.email as string,
              values.currentPassword
            );
            await reauthenticateWithCredential(
              authUser.firebaseUser as User,
              userCredential
            );
            await updatePassword(
              authUser.firebaseUser as User,
              values.newPasswordConfirm
            );
            await reload(authUser.firebaseUser as User);
            setIsPasswordChangeSuccessful(true);
            setIsFormLoading(false);
            form.reset();
          } catch (error) {
            setIsPasswordChangeFailure(true);
            setIsFormLoading(false);
            form.reset();
          }
        })}
      >
        <div className='px-4 py-4 bg-white rounded-md'>
          <div className='hidden'>
            <TextInput
              type='text'
              id='username-imput'
              name='username-imput'
              autoComplete='username email'
              classNames={defaultCSS.hidden}
            />
          </div>
          <PasswordInput
            className='pb-3'
            classNames={defaultCSS.input}
            placeholder='Tu Contraseña Actual'
            label='Contraseña Actual'
            autoComplete='none'
            autoCorrect='off'
            name='current-password-imput'
            id='current-password-imput'
            error={
              form.values.newPassword !== '' &&
              form.values.currentPassword.length === 0 && (
                <span>La contraseña actual debe estar presente.</span>
              )
            }
            icon={
              <Icon kind='lock' svgCss='h-[15px] w-[15px] text-neutral-500' />
            }
            required
            {...form.getInputProps('currentPassword', { type: 'input' })}
          />
          <PasswordInput
            className='pb-3'
            classNames={defaultCSS.input}
            placeholder='Tu Contraseña Nueva'
            label='Contraseña Nueva'
            autoComplete='new-password'
            autoCorrect='off'
            name='new-password'
            id='new-password'
            error={
              form.values.newPassword !== '' &&
              form.values.newPassword.length < 8 && (
                <span>La contraseña debe tener al menos 8 caracteres.</span>
              )
            }
            icon={
              <Icon kind='lock' svgCss='h-[15px] w-[15px] text-neutral-500' />
            }
            required
            {...form.getInputProps('newPassword', { type: 'input' })}
          />
          <PasswordInput
            className='pb-3'
            classNames={defaultCSS.input}
            placeholder='Confirmar Contraseña Nueva'
            label='Confirmar Contraseña Nueva'
            autoComplete='confirm-new-password'
            autoCorrect='off'
            name='confirm-new-password'
            id='confirm-new-password'
            error={
              /* prettier-ignore */
              (form.values.newPassword !== form.values.newPasswordConfirm) && (
                <span>Las contraseñas deben ser iguales.</span>
              )
            }
            icon={
              <Icon kind='lock' svgCss='h-[15px] w-[15px] text-neutral-500' />
            }
            required
            {...form.getInputProps('newPasswordConfirm', { type: 'input' })}
          />
          <div className='flex justify-end pt-2'>
            <Button
              loading={isFormLoading}
              className='btn !bg-blue-500 hover:!bg-blue-600'
              type='submit'
            >
              Cambiar
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
