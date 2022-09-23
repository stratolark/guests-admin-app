import Link from 'next/link';

export default function Custom404() {
  return (
    <div className='flex justify-center items-center px-4 flex-col h-[85vh]'>
      <h1 className='text-2xl font-bold text-center'>
        404 - La página que busca no ha sido encontrada
      </h1>
      <Link href='/'>
        <a
          title='Volver a Inicio'
          className='pt-6 text-blue-600 hover:underline'>
          {'<'} Volver a Inicio
        </a>
      </Link>
    </div>
  );
}
