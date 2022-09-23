import Icon from '@/icons/Icon';
import Link from 'next/link';

export default function Back({ link, title }) {
  return (
    <Link href={link}>
      <a
        className='text-sm flex items-center text-blue-500 font-bold hover:underline'
        title='Volver'
      >
        <Icon
          kind='chevronright'
          divCss='pr-2'
          svgCss='rotate-180 h-[13px] w-[13px] text-blue-500'
        />
        Volver a {title}
      </a>
    </Link>
  );
}
