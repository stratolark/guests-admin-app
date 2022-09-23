import { ActionIcon, TextInput } from '@mantine/core';
import { Search as SearchIcon, X } from 'tabler-icons-react';
export default function Search({
  searchValue,
  setSearchValue,
  handleEscapeKeyPress,
  placeholder = 'Buscar',
}) {
  return (
    <div>
      <TextInput
        icon={<SearchIcon size={18} />}
        radius='xl'
        size='md'
        variant='filled'
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        classNames={{
          input: '!border-[1px] !border-neutral-300 !bg-neutral-50',
        }}
        placeholder={placeholder}
        rightSection={
          searchValue !== '' ? (
            <ActionIcon
              onClick={() => setSearchValue('')}
              title='Limpiar'
              size={24}
              radius='xl'
              variant='filled'
              color='blue-500'
            >
              <X size={14} className='text-white' />
            </ActionIcon>
          ) : null
        }
        rightSectionWidth={42}
        onKeyUp={(e) => {
          if (e.key === 'Escape') {
            return handleEscapeKeyPress();
          }
        }}
      />
    </div>
  );
}
