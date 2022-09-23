import { defaultCSS } from '@/components/Forms/defaultCSS';
import Icon from '@/icons/Icon';
import { Alert, Button, TextInput } from '@mantine/core';
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  reload,
  updateEmail,
  User,
} from 'firebase/auth';
import { AuthUserContext } from 'next-firebase-auth';
import { useState } from 'react';
import { CircleCheck, CircleX } from 'tabler-icons-react';
import { object, string } from 'yup';
import ConfirmChangeModal from '../_modals/ConfirmChangeModal';

type UserInfoFormProps = {
  authUser: AuthUserContext;
};

export default function ChangeUserEmailForm({ authUser }: UserInfoFormProps) {
  const [isEmailChangeSuccessful, setIsEmailChangeSuccessful] = useState(false);
  const [isEmailChangeFailure, setIsEmailChangeFailure] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [changeEmailModalOpen, setChangeEmailModalOpen] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailInput, setEmailInput] = useState(authUser.email ?? '');
  const userEmailSchema = object({
    emailInput: string().email().required(),
  });

  const isEmailValid = userEmailSchema.isValidSync({ emailInput });

  async function handleEmailChange() {
    if (!isEmailValid) {
      return;
    }
    try {
      setIsFormLoading(true);
      const userCredential = EmailAuthProvider.credential(
        authUser.email as string, // current email before change
        confirmPassword
      );
      await reauthenticateWithCredential(
        authUser.firebaseUser as User,
        userCredential
      );
      await updateEmail(authUser.firebaseUser as User, emailInput);
      await reload(authUser.firebaseUser as User);
      setIsEmailChangeSuccessful(true);
      setIsFormLoading(false);
    } catch (error) {
      setIsEmailChangeFailure(true);
      setIsFormLoading(false);
    }
    setChangeEmailModalOpen(false);
  }

  return (
    <div>
      {isEmailChangeSuccessful && (
        <Alert
          icon={<CircleCheck size={16} />}
          title='Éxito!'
          color='teal'
          withCloseButton
          variant='filled'
          classNames={{ root: 'mt-4 mb-4' }}
          onClose={() => setIsEmailChangeSuccessful(false)}
        >
          Email actualizado con éxito!
        </Alert>
      )}
      {isEmailChangeFailure && (
        <Alert
          icon={<CircleX size={16} />}
          title='Error!'
          color='red'
          withCloseButton
          variant='filled'
          classNames={{ root: 'mt-4 mb-4' }}
          onClose={() => setIsEmailChangeFailure(false)}
        >
          Ha ocurrido un error actualizando el email. Por favor, revisa que los
          datos requiridos sean correctos o inténtalo de nuevo más tarde.
        </Alert>
      )}
      <form>
        <div className='p-4 bg-white rounded-md'>
          <TextInput
            className='pb-3'
            classNames={defaultCSS.input}
            placeholder='Tu Email'
            label='Email'
            name='email'
            id='email'
            icon={
              <Icon kind='mail' svgCss='h-[15px] w-[15px] text-neutral-500' />
            }
            error={
              !isEmailValid && (
                <span>
                  El Email debe ser valido. Ejemplo: ejemplo@ejemplo.com
                </span>
              )
            }
            required
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
          />
          <div className='pt-4 flex justify-end'>
            <Button
              className='btn !bg-blue-500 hover:!bg-blue-600'
              type='button'
              onClick={() => setChangeEmailModalOpen(true)}
              loading={isFormLoading}
              disabled={!isEmailValid}
            >
              Cambiar
            </Button>
            <ConfirmChangeModal
              isFormLoading={isFormLoading}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              open={changeEmailModalOpen}
              setOpen={setChangeEmailModalOpen}
              handleEmailChange={handleEmailChange}
            />
          </div>
        </div>
      </form>
    </div>
  );
}
