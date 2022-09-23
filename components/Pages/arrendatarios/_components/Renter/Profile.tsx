import { Avatar, Group, Spoiler, Stack } from '@mantine/core';

export default function Profile({
  renter,
  renterId,
  renterEmail,
  renterRUT,
  renterPhone,
}) {
  return (
    <div className='w-full bg-white p-4 rounded-md'>
      <Stack spacing={0} align='center'>
        <span className='self-end'>#{renterId}</span>
        <Avatar size={72} radius='xl' mt={12} />
        <h2 className='pt-3 font-bold'>{renter}</h2>
        <p className='text-sm text-neutral-500'>{renterEmail}</p>
        <Spoiler
          transitionDuration={0}
          classNames={{
            root: 'text-center mt-2 mb-3',
            content: 'my-2',
            control: '!py-2',
          }}
          maxHeight={5}
          showLabel='Ver más datos'
          hideLabel='Ver menos datos'
        >
          <div className='grid grid-flow-col gap-16'>
            <div>
              <span className='font-bold'>RUT</span>
              <p className='text-sm text-neutral-500'>{renterRUT}</p>
            </div>
            <div>
              <span className='font-bold'>Teléfono</span>
              <p className='text-sm text-neutral-500'>{renterPhone}</p>
            </div>
          </div>
        </Spoiler>
      </Stack>
    </div>
  );
}
