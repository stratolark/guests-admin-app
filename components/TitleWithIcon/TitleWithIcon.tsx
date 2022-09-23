import Icon, { type Icons } from '@/icons/Icon';
import { Title, type TitleOrder } from '@mantine/core';

export type TitleWithIconProps = {
  icon: Icons;
  title: string;
  order: TitleOrder;
  className: string;
  wrapper?: string;
};

export default function TitleWithIcon({
  icon = 'question',
  title = '',
  order = 1,
  className = '',
  wrapper = '',
}: TitleWithIconProps) {
  return (
    <div className={`flex items-center ${wrapper}`}>
      <Icon kind={icon} divCss='pr-2' svgCss='h-[18px] w-[18px] text-black' />
      <Title order={order} className={className}>
        {title}
      </Title>
    </div>
  );
}
