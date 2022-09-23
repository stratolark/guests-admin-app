import { ActionIcon, Divider, Menu } from '@mantine/core';
import { useAuthUser } from 'next-firebase-auth';
import { DotsVertical, Edit, Trash } from 'tabler-icons-react';

export default function ReceiptMenu({
  handleEdit,
  handleDelete,
}: {
  handleEdit: () => void;
  handleDelete: () => void;
}) {
  const authUser = useAuthUser();
  return (
    <Menu position='bottom-end' shadow='md'>
      <Menu.Target>
        <div>
          <ActionIcon>
            <DotsVertical size={18} />
          </ActionIcon>
        </div>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Opciones</Menu.Label>
        <Menu.Item
          title='Editar'
          aria-label='Editar'
          icon={<Edit size={14} />}
          onClick={() => handleEdit()}
        >
          Editar
        </Menu.Item>
        {authUser?.claims?.admin && authUser?.emailVerified && (
          <>
            <Divider />
            <Menu.Label>Zona de Peligro</Menu.Label>
            <Menu.Item
              title='Eliminar'
              aria-label='Eliminar'
              color='red'
              className='!text-rose-500'
              icon={<Trash size={14} />}
              onClick={() => handleDelete()}
            >
              Eliminar recibo
            </Menu.Item>
          </>
        )}
      </Menu.Dropdown>
    </Menu>
  );
}
