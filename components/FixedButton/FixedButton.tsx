import Icon from '@/icons/Icon';

export default function FixedButton({ text = 'FixedButton', onClick }) {
  return (
    <div className='z-[13] fixed bottom-0 right-0 mx-3 mb-20 lg:mb-10 lg:mr-12'>
      <button
        onClick={onClick}
        className='flex items-center bg-blue-500 rounded-md p-3 text-white font-bold hover:bg-blue-600'
      >
        <Icon kind='add' svgCss='h-4 w-4 text-white' />
        <span className='pl-2'>{text}</span>
      </button>
    </div>
  );
}
