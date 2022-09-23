import { Check } from 'tabler-icons-react';
export default function Services({ roomData }) {
  return (
    <div>
      <div className='grid grid-cols-2 gap-2'>
        {roomData?.services?.length === 0 && 'Sin Servicios Asignados'}
        {roomData?.services?.length > 0 &&
          roomData?.services?.map((service: any, index: number) => (
            <div
              key={service + index}
              className='flex-auto bg-white rounded-md py-3 px-2'
            >
              <div className='flex items-center font-medium justify-center'>
                <Check size={14} className='-ml-1.5 mr-1.5 text-blue-400' />
                {service}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
