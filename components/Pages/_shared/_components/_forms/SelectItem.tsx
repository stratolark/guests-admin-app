import Icon from '@/icons/Icon';
import { Avatar, Group, Text } from '@mantine/core';
import { forwardRef } from 'react';

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
  avatarColor: string;
  avatarNumber?: number | string;
  label: string;
  description: string;
  type: 'renter' | 'room';
}
function SelectItem(
  {
    avatarColor,
    avatarNumber,
    label,
    description,
    type = 'renter',
    ...others
  }: ItemProps,
  ref
) {
  return (
    <div ref={ref} {...others}>
      <Group noWrap>
        {type === 'renter' && (
          <Avatar color={avatarColor}>{avatarNumber}</Avatar>
        )}
        {type === 'room' && (
          <Avatar color={avatarColor}>
            <Icon kind='door' svgCss='h-5 w-5' />
          </Avatar>
        )}
        <div>
          <Text size='sm'>{label}</Text>
          <Text size='xs' color='dimmed'>
            {description}
          </Text>
        </div>
      </Group>
    </div>
  );
}
export default forwardRef<HTMLDivElement, ItemProps>(SelectItem);
