import Icon from '@/icons/Icon';
import { Skeleton } from '@mantine/core';
import {
  collection,
  getFirestore,
  onSnapshot,
  query,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';

const SETTINGS_COLLECTION = 'settings';

export default function Splits({ currentFinances, isLoading }) {
  const moneyToSplit = currentFinances?.finances;

  const [settingsSplits, setSettingsSplits] = useState(3);

  useEffect(() => {
    const db = getFirestore();
    const q = query(collection(db, SETTINGS_COLLECTION));
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const docs = querySnapshot?.docs?.map((doc1) => {
          return (
            {
              ...(doc1?.data() as any), // {splits: number, key: string}
              key: doc1?.id,
            } ?? []
          );
        });
        // console.log('docs[0]?.splits', docs[0]?.splits);

        setSettingsSplits(docs[0]?.splits);
      },
      (error) => {
        console.log(`Error getting documents: `, error);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  // console.log(settingsSplits);

  const splitsAmmount: number[] = [];

  for (let i = 1; i <= settingsSplits; i++) {
    // console.log('i', i);
    splitsAmmount.push(i);
  }
  // console.log('arr', splitsAmmount);

  const finalSplits = splitsAmmount.map((val) => {
    return {
      name: `Parte ${val}`,
      percentage: 1 / settingsSplits,
      ammount: moneyToSplit / settingsSplits,
    };
  });

  // console.log('newArr', finalSplits);
  // const profitSplits = [
  //   {
  //     name: 'Parte 1',
  //     percentage: 1 / settingsSplits,
  //     ammount: moneyToSplit / settingsSplits,
  //   },
  //   {
  //     name: 'Parte 2',
  //     percentage: 1 / settingsSplits,
  //     ammount: moneyToSplit / settingsSplits,
  //   },
  //   {
  //     name: 'Parte 3',
  //     percentage: 1 / settingsSplits,
  //     ammount: moneyToSplit / settingsSplits,
  //   },
  // ];

  return (
    <section>
      <div className='mt-6'>
        <div className='flex justify-center items-center'>
          <Icon kind='userpart' divCss='pr-3' svgCss='h-5 w-5 text-black' />
          <h2 className='font-medium text-center'>Reparto de Ganancias.</h2>
        </div>
        <div className='mt-4 flex justify-center'>
          <div className=' flex flex-wrap justify-around gap-2'>
            {finalSplits?.length > 0 &&
              finalSplits?.map((split: any, index) => (
                <div
                  key={split.name + split.percentage + index}
                  // style={{
                  //   width: `${(split.percentage * 100) / 2}`,
                  // }}
                  className='flex flex-col'
                >
                  <div
                    className={`w-full flex flex-col bg-white py-4 px-5 ${
                      index === 0 ? 'rounded-l-lg' : ''
                    } ${
                      index === finalSplits?.length - 1 ? 'rounded-r-lg' : ''
                    }`}
                  >
                    <span className='flex items-center justify-center text-sm font-medium pb-3 text-blue-600'>
                      {split.name}
                    </span>
                    <span className='text-center text-sm font-bold'>
                      <Skeleton
                        visible={isLoading}
                        className='after:bg-blue-100'
                      >
                        {new Intl.NumberFormat('es-CL', {
                          style: 'currency',
                          currency: 'CLP',
                        }).format(split.ammount || 0)}{' '}
                        CLP
                      </Skeleton>
                    </span>
                    <span className='pt-4 text-center text-sm text-neutral-500 truncate'>
                      {(split.percentage * 100).toFixed(2)} %
                    </span>
                  </div>
                </div>
              ))}
            {finalSplits.length === 0 && (
              <div className='p-4 text-center'>
                Los Repartos aún no han sido configurados. Contácta a un
                administrador.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
