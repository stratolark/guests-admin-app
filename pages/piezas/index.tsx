import Spinner from '@/components/Spinner';
import {
  collection,
  FirestoreError,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import {
  AuthAction,
  withAuthUser,
  withAuthUserTokenSSR,
} from 'next-firebase-auth';
import PageError from '@/components/Pages/_shared/_components/PageError';
import { FunctionComponent, useEffect, useState } from 'react';

import Pieza from '../../components/Pages/piezas/_components/Pieza';
import { RoomProps } from '@/components/Pages/piezas/_types/types';

function Piezas() {
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<FirestoreError | null>(null);
  const [roomsList, setRoomsList] = useState<RoomProps[] | []>([]);
  const [latestRoomID, setLatestRoomID] = useState(1);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(getFirestore(), 'rooms'),
        orderBy('id', 'desc')
        // limit(100)
      ),
      (querySnapshot) => {
        const docs = querySnapshot?.docs?.map((doc1) => {
          return (
            {
              ...(doc1?.data() as RoomProps),
              key: doc1?.id,
            } || []
          );
        });
        setLatestRoomID(querySnapshot?.docs?.length === 0 ? 0 : docs[0]?.id);
        setRoomsList(docs);
        setIsLoading(false);
      },
      (error) => {
        console.log('Error getting documents: ', error);
        setErrors(error);
        setIsLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const roomsListLength = roomsList?.length === 0 ? 1 : latestRoomID + 1;

  if (errors) {
    console.log('errors:', errors);
  }

  return (
    <>
      {isLoading && <Spinner />}
      {errors && <PageError />}
      {!isLoading && !errors && (
        <Pieza roomsList={roomsList} latestRoomID={roomsListLength} />
      )}
    </>
  );
}

export const getServerSideProps = withAuthUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})();

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  LoaderComponent: Spinner as FunctionComponent,
})(Piezas);
