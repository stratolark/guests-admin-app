import { Center, Loader } from '@mantine/core';

export default function Spinner({ width = '100%', height = '85vh' }) {
  return (
    <Center style={{ width, height }}>
      <Loader />
    </Center>
  );
}
