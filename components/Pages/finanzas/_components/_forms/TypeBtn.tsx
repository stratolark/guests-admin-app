import Icon, { Icons } from '@/icons/Icon';
import { Stack, Text } from '@mantine/core';

type TypeBtnProps = {
  icon: Icons;
  title: 'Pago (Ingreso)' | 'Gasto';
  onClick: any;
  className?: any;
};

export default function TypeBtn({
  icon,
  title,
  onClick,
  className = '',
}: TypeBtnProps) {
  return (
    <button
      className={`cursor-pointer btn-card ${className}`}
      type='button'
      onClick={onClick}
    >
      <Stack spacing={1} align='start'>
        <Text weight={400} size='sm'>
          Añadir
        </Text>
        <Text size='xl' weight={600} className='truncate'>
          {title}
        </Text>
      </Stack>
      <Icon kind={icon} divCss='pt-6 pb-3' svgCss='h-8 w-8 text-blue-50' />
    </button>
  );
}
