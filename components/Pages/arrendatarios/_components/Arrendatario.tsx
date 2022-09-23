import { FixedButton } from '@/components/FixedButton';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import RenterForm from './_forms/RenterForm';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import Search from '../../_shared/_components/Search';
import { useDebouncedValue } from '@mantine/hooks';
import queryFilter from '@/lib/utils/queryFilter';
import { RenterProps } from '../_types/types';
import RenterCard from './RenterCard';
import { useAuthUser } from 'next-firebase-auth';

dayjs.extend(localizedFormat);

type ArrendatariosProps = {
  renterList: RenterProps[];
  renterListLength: number;
};
export default function Arrendatario({
  renterList,
  renterListLength,
}: ArrendatariosProps) {
  const AuthUser = useAuthUser();
  const [opened, setOpened] = useState(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const [debouncedSearchValue] = useDebouncedValue(searchValue, 300);
  const [filteredRenterList, setFilteredRenterList] = useState(renterList);

  useEffect(() => {
    setFilteredRenterList(queryFilter(renterList, debouncedSearchValue));
  }, [debouncedSearchValue, renterList]);

  // TODO: add todo state when typing

  return (
    <div>
      <h1 className='page-title'>Arrendatarios</h1>
      <section className='pb-6'>
        <Search
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          handleEscapeKeyPress={() => setSearchValue('')}
        />
      </section>
      <section>
        <h2 className='pb-6'>
          <span className='font-bold pr-3'>Lista de Arrendatarios:</span>
          <span className='text-sm italic text-neutral-400 '>
            {filteredRenterList?.length !== 0
              ? filteredRenterList?.length
              : '0'}{' '}
            {filteredRenterList?.length > 1 ? 'arrendatarios' : 'arrendatario'}
          </span>
        </h2>
        <div className='pb-6'>
          {renterList?.length !== 0 &&
            filteredRenterList?.map((renter: RenterProps) => (
              <RenterCard renter={renter} key={renter.key} />
            ))}
          {filteredRenterList?.length === 0 && renterList?.length !== 0 && (
            <div className='text-center py-12'>
              <h3 className='font-bold text-xl'>
                Lo sentimos, no hay arrendatarios con ese nombre :(
              </h3>
            </div>
          )}
          {renterList?.length === 0 && (
            <>
              <div className='pt-12 flex items-center justify-center'>
                <p className='text-center'>
                  Aún no haz añadido ningún Arrendatario. Intenta haciendo click
                  al botón &apos;Añadir Arrendatario&apos;. O contacta a un
                  administrador.
                </p>
              </div>
            </>
          )}
          {renterList?.length !== 0 && filteredRenterList?.length !== 0 && (
            <div className='pt-2 pb-4 text-sm italic text-neutral-400 text-center'>
              Fin de Lista
            </div>
          )}
        </div>
      </section>
      {(AuthUser?.claims?.admin || AuthUser?.claims?.manager) &&
        AuthUser?.emailVerified && (
          <>
            <div>
              <RenterForm
                type='add'
                opened={opened}
                setOpened={() => setOpened(false)}
                renterListLength={renterListLength}
              />
            </div>
            <FixedButton
              text='Añadir Arrendatario'
              onClick={() => setOpened(true)}
            />
          </>
        )}
    </div>
  );
}
