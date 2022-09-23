import 'dayjs/locale/es-mx';
import Icon from '@/icons/Icon';
import { Popover } from '@mantine/core';
import { ChevronDown } from 'tabler-icons-react';
import { Calendar } from '@mantine/dates';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

export default function MonthSelector({
  openMonthPicker,
  setOpenMonthPicker,
  selectedMonth,
  onMonthChange,
}) {
  return (
    <section>
      <div className='flex justify-center'>
        <Popover
          opened={openMonthPicker}
          onClose={() => setOpenMonthPicker(false)}
          width={360}
          position='bottom'
          withArrow
        >
          <Popover.Target>
            <button
              onClick={() => setOpenMonthPicker((o: boolean) => !o)}
              className='flex items-center justify-center py-2 px-5 mb-2 cursor-pointer'
              title='Cambiar mes'
            >
              <Icon
                kind='calendar'
                divCss='pr-3'
                svgCss='text-neutral-600 h-4 w-4'
              />
              <h3 className='font-medium text-base pr-2'>
                {dayjs(selectedMonth).locale('es').format('MMMM YYYY')}
              </h3>
              <ChevronDown
                size={23}
                strokeWidth={2}
                className='text-neutral-600'
              />
            </button>
          </Popover.Target>
          <Popover.Dropdown>
            <div>
              <Calendar
                locale='es-mx'
                month={selectedMonth}
                fullWidth={true}
                allowLevelChange={false}
                initialLevel='month'
                onMonthChange={(value) => {
                  onMonthChange(value);
                  setOpenMonthPicker(false);
                }}
                classNames={{
                  yearPickerControlActive: 'bg-blue-500 hover:bg-blue-600',
                  monthPickerControlActive: 'bg-blue-500 hover:bg-blue-600',
                }}
              />
            </div>
          </Popover.Dropdown>
        </Popover>
      </div>
    </section>
  );
}
