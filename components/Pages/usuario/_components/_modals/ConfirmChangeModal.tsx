import { defaultCSS } from '@/components/Forms/defaultCSS';
import Icon from '@/icons/Icon';
import { Button, Group, Modal, PasswordInput, TextInput } from '@mantine/core';

export default function ConfirmChangeModal({
  open,
  setOpen,
  handleEmailChange,
  confirmPassword,
  setConfirmPassword,
  isFormLoading,
}): JSX.Element {
  return (
    <Modal
      opened={open}
      onClose={() => {
        setOpen(false);
      }}
      title='Confirmar cambio de Email'
    >
      <div>
        <Group position='center' mt={30}>
          Para cambiar tu email, debes confirmar tu contraseña actual.
          <form className='w-full'>
            <div className='hidden'>
              <TextInput
                type='text'
                id='username'
                name='username'
                autoComplete='username email'
                classNames={defaultCSS.hidden}
              />
            </div>
            <PasswordInput
              className='w-full pb-3'
              classNames={defaultCSS.input}
              placeholder='Tu Contraseña Actual'
              label='Contraseña Actual'
              autoComplete='none'
              autoCorrect='off'
              name='current-password'
              id='current-password'
              icon={
                <Icon kind='lock' svgCss='h-[15px] w-[15px] text-neutral-500' />
              }
              required
              value={confirmPassword}
              onChange={(e) => {
                {
                  setConfirmPassword(e.target.value);
                }
              }}
            />
          </form>
        </Group>
        <Group position='right' mt={50}>
          <Button
            onClick={() => {
              setOpen(false);
            }}
            variant='outline'
          >
            Cancelar
          </Button>
          <Button
            disabled={confirmPassword.length === 0}
            loading={isFormLoading}
            onClick={() => handleEmailChange()}
          >
            Guardar
          </Button>
        </Group>
      </div>
    </Modal>
  );
}
