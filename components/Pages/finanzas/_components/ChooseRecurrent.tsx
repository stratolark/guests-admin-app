import Icon from '@/icons/Icon';
import { FinanceConfig } from '../_types/types';

type ChooseRecurrentProps = {
  config: FinanceConfig;
  setNextStep: any;
};

export default function ChooseRecurrent({
  config,
  setNextStep,
}: ChooseRecurrentProps) {
  return (
    <div>
      <div className='pb-6'>
        {config?.recurrent && (
          <>
            <h2 className='font-bold'>Recurrentes:</h2>
            {config?.recurrent.map((item, index) => (
              <div
                key={item.title + '-' + index}
                className='btn-recurrent items-center'
                title={`Elegir ${item.title}`}
                onClick={() => setNextStep(item.nextStep)}
              >
                <Icon
                  kind={item.icon}
                  divCss='pr-3'
                  svgCss='h-5 w-5 text-white'
                />
                <div>
                  <h3 className='font-bold'>{item.title}</h3>
                </div>
                <Icon
                  kind='chevronright'
                  divCss='pl-3'
                  svgCss='h-5 w-5 text-white'
                />
              </div>
            ))}
          </>
        )}
      </div>
      <div>
        {config?.other && (
          <>
            <h2 className='font-bold'>Personalizado:</h2>
            {config?.other?.map((item, index) => (
              <div
                key={item.title + '-' + index}
                className='btn-recurrent'
                title={`Elegir ${item.title}`}
                onClick={() => setNextStep(item.nextStep)}
              >
                <Icon
                  kind={item.icon}
                  divCss='pt-2 pr-3'
                  svgCss='h-5 w-5 text-white'
                />
                <div className='pl-3'>
                  <h3 className='font-bold'>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
                <Icon
                  kind='chevronright'
                  divCss='pt-2 pl-3'
                  svgCss='h-5 w-5 text-white'
                />
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
