import { NumberInput } from '@mantine/core';

export default function CurrencyInput({ label, value, onChange, ...rest }) {
  return (
    <NumberInput
      required
      rightSection={'🇨🇱 CLP'}
      rightSectionWidth={100}
      classNames={{ label: 'font-bold', rightSection: 'w-[100px]' }}
      label={label}
      description='Valor en Pesos Chilenos CLP'
      // type='number'
      parser={(val) => val?.replace(/\$\s?|(\.*)/g, '')}
      formatter={(val) =>
        !Number.isNaN(parseFloat(val as string))
          ? `$ ${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
          : '$ '
      }
      stepHoldDelay={500}
      stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
      value={value}
      onChange={onChange}
      {...rest}
      //   {...form.getInputProps('monthlyPayment')}
    />
  );
}
