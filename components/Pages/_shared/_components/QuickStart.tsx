import Icon from '@/icons/Icon';
import Link from 'next/link';
import { type QuickStartProps } from '../_types/types';

export default function QuickStart({ links }: QuickStartProps) {
  return (
    <div>
      <section className='pb-10'>
        <h2 className='page-title'>Explorar</h2>
        <div className=''>
          <div className='grid grid-cols-2 gap-3'>
            {links.map((link) => (
              <Link href={link.href} key={link.name}>
                <a
                  className='w-full grid min-h-[11rem] bg-white hover:bg-blue-100 rounded-md py-[0.875rem] px-5'
                  title={`Ir a ${link.name}`}
                >
                  <Icon
                    kind={link.icon}
                    divCss='h-[26px] flex items-center flex items-center'
                    svgCss='min-h-[18.4px] h-[1.15rem] w-[1.15rem]'
                  />
                  <span className='flex items-center w-full font-bold text-black'>
                    {link.name}
                  </span>
                  <span className='w-full text-sm text-neutral-500'>
                    {link.description}
                  </span>
                  <span className='py-3 flex shrink justify-end items-end'>
                    <Icon
                      kind='chevronright'
                      svgCss='h-[0.875rem] w-[0.875rem]'
                    />
                  </span>
                </a>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
