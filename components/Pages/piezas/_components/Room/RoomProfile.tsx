import Icon from '@/icons/Icon';
import { Stack } from '@mantine/core';

export default function RoomProfile({ roomProfile }) {
  return (
    <div className='w-full bg-white px-4 py-20 rounded-md'>
      <Stack spacing={0} align='center' justify='center'>
        <Icon kind='door' svgCss='h-6 h-6' />
        <h2 className='pt-3 font-bold'>Pieza {roomProfile?.id}</h2>
        <p className='text-sm text-neutral-500'>{roomProfile?.renter}</p>
      </Stack>
    </div>
  );
}
