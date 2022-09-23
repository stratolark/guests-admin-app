import { sendEmailVerification } from 'firebase/auth';
import { AlertCircle, Check, MailForward, X } from 'tabler-icons-react';
import {
  defaultClasses,
  errorClasses,
  successClasses,
} from '@/components/Pages/_shared/firebase';

import { showNotification, updateNotification } from '@mantine/notifications';
import { useState } from 'react';
import { Loader } from '@mantine/core';

export default function VerifyEmailAlert({
  auth,
  isVisible = true,
  setIsVisible,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  function handleSendVerificationEmail() {
    setIsLoading(true);
    sendEmailVerification(auth?.currentUser)
      .then(() => {
        showNotification({
          id: 'load-data',
          loading: true,
          title: `Enviando correo de verificación a ${auth?.currentUser?.email}`,
          message: 'Por favor, espera.',
          autoClose: false,
          disallowClose: true,
          classNames: defaultClasses,
        });

        setTimeout(() => {
          updateNotification({
            id: 'load-data',
            color: 'teal',
            title: 'Correo de verificación enviado',
            message:
              'Por favor, revisa tu correo electrónico y sigue las instrucciones para verificar tu cuenta.',
            icon: <Check />,
            autoClose: 3000,
            classNames: successClasses,
          });
          setIsLoading(false);
          setIsSent(true);
        }, 3000);
        console.log('email sent');
      })
      .catch((error) => {
        showNotification({
          id: 'error-data',
          loading: false,
          icon: <X size={18} />,
          color: 'red',
          title: `Lo sentimos, ha ocurrido un error. Inténtelo nuevamente.`,
          message: 'Esta notificación se cerrará automaticámente.',
          autoClose: 5000,
          classNames: errorClasses,
        });
        setIsLoading(false);
        console.log('Error when sending Verification Email', error);
      });
  }
  return (
    <div className='bg-blue-500 py-4 px-6 text-white lg:ml-[17rem] lg:mt-[4.5625rem] xl:ml-[20rem]'>
      <h4 className='font-bold pb-1 flex items-center'>
        {isSent ? <Check size={16} /> : <AlertCircle size={16} />}
        <span className='pl-3'>
          {isSent ? 'Correo de verificación enviado' : 'Verifica tu email'}
        </span>
      </h4>
      <p className='text-sm pb-4 leading-relaxed'>
        {isSent
          ? 'Por favor, revisa tu correo electrónico y sigue las instrucciones para verificar tu cuenta. Una vez que completes la verificación, actualiza la página para remover esta notificación.'
          : 'Para acceder a todas las funciones de la aplicación debes verificar tu email.'}
        {isSent && (
          <span className='inline-block pt-3 text-xs'>
            (Si no verificas tu email de inmediato, seguiras viendo esta
            notificación.)
          </span>
        )}
      </p>
      {!isSent && (
        <button
          disabled={
            isLoading ||
            (auth?.currentUser?.email === null &&
              !auth?.currentUser?.emailVerified)
          }
          title={
            auth?.currentUser?.email === null &&
            !auth?.currentUser?.emailVerified
              ? 'Email ya verificado'
              : 'Enviar correo de verificación'
          }
          onClick={() => handleSendVerificationEmail()}
          className='text-sm bg-white text-black rounded px-4 py-2 font-bold hover:bg-neutral-100 flex items-center disabled:text-neutral-400 disabled:cursor-not-allowed'
        >
          {isLoading && (
            <Loader className='stroke-neutral-400' size='xs' mr={10} />
          )}
          <span className='pr-3'>
            {isLoading ? 'Enviando correo' : 'Enviar Mail de Verificación'}
          </span>
          <MailForward size={16} />
        </button>
      )}
      {isVisible && isSent && (
        <button
          type='button'
          onClick={() => setIsVisible()}
          className='pt-3 text-sm text-white underline'
        >
          Cerrar
        </button>
      )}
    </div>
  );
}
