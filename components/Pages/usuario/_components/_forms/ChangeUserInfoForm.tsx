import { Alert, Button, TextInput } from '@mantine/core';
import { defaultCSS } from '../../../../Forms/defaultCSS';
import { useForm } from '@mantine/form';
import { AuthUserContext } from 'next-firebase-auth';
import { reload, User } from 'firebase/auth';
import { UpdateUserProfile } from '@/components/Pages/_shared/firebase';
import { useState } from 'react';
import { CircleCheck, CircleX } from 'tabler-icons-react';

type UserInfoFormProps = {
  authUser: AuthUserContext;
};

export default function ChangeUserInfoForm({ authUser }: UserInfoFormProps) {
  const [isNameChangeSuccessful, setIsNameChangeSuccessful] = useState(false);
  const [isNameChangeFailure, setIsNameChangeFailure] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const form = useForm({
    initialValues: {
      firstName: authUser?.displayName?.split(' ')[0] ?? '',
      lastName: authUser?.displayName?.split(' ')[1] ?? '',
    },
  });
  return (
    <div>
      {isNameChangeSuccessful && (
        <Alert
          icon={<CircleCheck size={16} />}
          title='Éxito!'
          color='teal'
          withCloseButton
          variant='filled'
          classNames={{ root: 'mt-4 mb-4' }}
          onClose={() => setIsNameChangeSuccessful(false)}
        >
          Nombre actualizado con éxito!
        </Alert>
      )}
      {isNameChangeFailure && (
        <Alert
          icon={<CircleX size={16} />}
          title='Error!'
          color='red'
          withCloseButton
          variant='filled'
          classNames={{ root: 'mt-4 mb-4' }}
          onClose={() => setIsNameChangeFailure(false)}
        >
          Ha ocurrido un error actualizando el nombre. Por favor, revisa que los
          datos requiridos sean correctos o inténtalo de nuevo más tarde.
        </Alert>
      )}
      <form
        onSubmit={form.onSubmit(async (values) => {
          const { firstName, lastName } = values;
          const displayName =
            firstName === '' && lastName === ''
              ? ''
              : `${firstName} ${lastName}`;
          try {
            setIsFormLoading(true);
            await UpdateUserProfile(authUser, {
              displayName,
            });
            await reload(authUser.firebaseUser as User);
            setIsFormLoading(false);
            setIsNameChangeSuccessful(true);
          } catch (error) {
            setIsNameChangeFailure(true);
            setIsFormLoading(false);
          }
        })}
      >
        <div className='p-4 bg-white rounded-md'>
          <div className='flex gap-4'>
            <TextInput
              className='pb-3'
              classNames={defaultCSS.input}
              placeholder='Tu Nombre'
              label='Nombre'
              name='nombre'
              id='nombre'
              {...form.getInputProps('firstName', { type: 'input' })}
            />
            <TextInput
              className='pb-3'
              classNames={defaultCSS.input}
              placeholder='Tu Apellido'
              label='Apellido'
              name='apellido'
              id='apellido'
              {...form.getInputProps('lastName', { type: 'input' })}
            />
          </div>
          <div className='pt-4 flex justify-end'>
            <Button
              className='btn !bg-blue-500 hover:!bg-blue-600'
              type='submit'
              loading={isFormLoading}
            >
              Guardar
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
