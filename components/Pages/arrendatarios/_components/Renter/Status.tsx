import Icon, { Icons } from '@/icons/Icon';

export type FieldsProps = {
  icon: Icons;
  name: string;
  value: string | number;
};

export default function Status({
  statusFields,
}: {
  statusFields: FieldsProps[];
}) {
  return (
    <div className='grid grid-cols-2 gap-2'>
      {!!statusFields &&
        statusFields?.map((field, index) => (
          <div
            key={field.name + index}
            className='min-h-[10rem] bg-white p-4 rounded-md'
          >
            <Icon kind={field.icon} divCss='my-2' svgCss='h-4 w-4' />
            <span className='text-sm text-neutral-500'>{field.name}</span>
            <p className='font-bold'>{field.value}</p>
          </div>
        ))}
    </div>
  );
}
