import { stableSortDesc } from '@/lib/utils/sortDesc';
import { showNotification } from '@mantine/notifications';
import { sendPasswordResetEmail, updateProfile, User } from 'firebase/auth';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  UploadResult,
  uploadString,
} from 'firebase/storage';
import { nanoid } from 'nanoid';
import { AuthUserContext } from 'next-firebase-auth';
import { RenterProps } from '../arrendatarios/_types/types';
import { FinanceProps } from '../finanzas/_types/types';
import { RoomProps } from '../piezas/_types/types';
import { FileProps } from './_components/_forms/CustomDropzone';
import {
  CollectionName,
  NotificationColor,
  NotificationSubject,
} from './_types/types';

export function Notification(
  icon: any,
  message = 'Notificación',
  description = 'Esta notificación se cerrará automaticámente.',
  color: NotificationColor = 'teal',
  classes = {}
) {
  return showNotification({
    title: message,
    message: description,
    color: color,
    classNames: classes,
    icon: icon,
  });
}
const baseClasses = {
  title: '!text-white !font-bold',
  description: '!text-white',
};
export const defaultClasses = {
  root: '!py-4 !bg-blue-800',
  ...baseClasses,
  closeButton: '!text-white hover:!bg-blue-900',
};
export const successClasses = {
  root: '!py-4 !bg-teal-800',
  ...baseClasses,
  closeButton: '!text-white hover:!bg-teal-900',
};
export const warningClasses = {
  root: '!py-4 !bg-yellow-600',
  ...baseClasses,
  closeButton: '!text-white hover:!bg-yellow-700',
};
export const errorClasses = {
  root: '!py-4 !bg-rose-600',
  ...baseClasses,
  closeButton: '!text-white hover:!bg-rose-700',
};

//TODO: add GetDoc for client refresh
// export async function GetDoc(db = getFirestore()) {
// try {
//   await getDoc(collection(db, collectionName));

//   Notification(
//     successIcon,
//     `Datos de ${notificationSubject} agregados con éxito`,
//     'teal',
//     successClasses
//   );
// } catch (e) {
//   // setErrors with state
//   console.error('Error adding document: ', e);
//   Notification(
//     errorIcon,
//     'Lo sentimos, ha ocurrido un error. Inténtelo nuevamente.',
//     'red',
//     errorClasses
//   );
// }

// }

export async function SendResetEmail(auth: any, email: string) {
  await sendPasswordResetEmail(auth, email);
}

const storageBucket = 'avatars';

/**
 * should return a promise so we can use that promise to setState or
 * another function. I dont need to get the download url.
 * i only need to to set the profile url, and then reload the
 * auth user
 *
 * @export
 * @param {File} file
 * @param {string} userEmail
 */
export async function UploadDataUrlToStorage(file: string, userEmail: string) {
  try {
    const storage = getStorage();
    const storageRef = ref(storage, storageBucket);
    const imagesRef = ref(storageRef, `${nanoid()}_${userEmail}`);
    const metadata = {
      customMetadata: {
        'avatar-user': userEmail,
      },
    };
    const uploadTask = await uploadString(
      imagesRef,
      file,
      'data_url',
      metadata
    );
    return uploadTask;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function UploadImageToStorage(
  file: FileProps | File | any,
  bucket: string,
  nameId: string
): Promise<UploadResult> {
  try {
    const storage = getStorage();
    const storageRef = ref(storage, bucket);
    const imagesRef = ref(storageRef, `${nanoid()}_${nameId}`);
    const uploadTask = await uploadBytes(imagesRef, file);
    return uploadTask;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function getStorageDownloadURL(fileRef = ''): Promise<string> {
  try {
    const storage = getStorage();
    const storageRef = ref(storage, fileRef);
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function UpdateUserProfile(
  authUser: AuthUserContext,
  nameAndAvatarObj: {
    displayName?: User['displayName'];
    photoURL?: User['photoURL'];
  }
) {
  try {
    await updateProfile(authUser.firebaseUser as User, nameAndAvatarObj);
    // await reload(authUser.firebaseUser as User);
    console.log('Success, profile updated.');
  } catch (error) {
    console.log('There was an error updating the profile:', error);
    return error;
  }
}

export async function DeleteStorageObj(fileRef = '') {
  try {
    const storage = getStorage();
    const storageRef = ref(storage, fileRef);
    await deleteObject(storageRef);
  } catch (error) {
    console.log('Error when deleting object.', error);
    return error;
  }
}

export async function AddDoc(
  fieldsObject: RenterProps | RoomProps | FinanceProps,
  errorIcon: any,
  successIcon: any,
  notificationSubject: NotificationSubject,
  collectionName: CollectionName,
  db = getFirestore()
) {
  try {
    await addDoc(collection(db, collectionName), fieldsObject);

    Notification(
      successIcon,
      `Datos de ${notificationSubject} agregados con éxito`,
      'Esta notificación se cerrará automaticámente.',
      'teal',
      successClasses
    );
  } catch (e) {
    // setErrors with state
    console.error('Error adding document: ', e);
    Notification(
      errorIcon,
      'Lo sentimos, ha ocurrido un error. Inténtelo nuevamente.',
      'Esta notificación se cerrará automaticámente.',
      'red',
      errorClasses
    );
  }
}

// export async function GetDocs<T>(
//   setIsLoading: any,
//   setLatestDocID: any,
//   setDocsList: any,
//   setErrors: any,
//   collectionName: CollectionName,
//   db = getFirestore()
// ) {
//   setIsLoading(true);
//   try {
//     const querySnapshot = await getDocs(collection(db, collectionName));

//     const data: T[] =
//       querySnapshot.docs.map((a) => {
//         return { ...(a.data() as T), key: a.id };
//       }) || [];

//     const sortedData = data.length > 0 ? stableSortDesc(data) : [];

//     setLatestDocID(querySnapshot.docs.length === 0 ? 0 : sortedData[0].id);
//     setDocsList(sortedData || []);
//     setIsLoading(false);
//   } catch (err) {
//     setErrors(err);
//     setIsLoading(false);
//   }
// }

export async function GetDocs<T>(
  collectionName: CollectionName,
  db = getFirestore()
): Promise<T[] | []> {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));

    const data: T[] =
      querySnapshot.docs.map((a) => {
        return { ...(a.data() as T), key: a.id };
      }) ?? [];

    const sortedData = data.length > 0 ? stableSortDesc(data) : [];

    // setLatestDocID(querySnapshot.docs.length === 0 ? 0 : sortedData[0].id);
    return sortedData ?? [];
  } catch (err) {
    console.log(err);
    return err;
  }
}

export async function UpdateDoc<T>(
  fieldsObject: T,
  successIcon: any,
  errorIcon: any,
  collectionName: CollectionName,
  docKey = '',
  db = getFirestore()
) {
  // read write ruls only to those users who have
  // manager Role on their profile
  const docInputFields: Omit<T, 'id'> = fieldsObject;

  try {
    await updateDoc(doc(db, collectionName, docKey), docInputFields);

    Notification(
      successIcon,
      'Datos editados con éxito.',
      'Esta notificación se cerrará automaticámente.',
      'teal',
      successClasses
    );
  } catch (e) {
    console.error('Error Updating document: ', e);
    Notification(
      errorIcon,
      'Lo sentimos, ha ocurrido un error. Inténtelo nuevamente.',
      'Esta notificación se cerrará automaticámente.',
      'red',
      errorClasses
    );
  }
}

/**The update will fail if applied to a document that does not exist.
 */
export async function UpdateDocField<T>(
  fieldsObject: T,
  collectionName: CollectionName,
  docKey = '',
  db = getFirestore()
) {
  const docInputFields: Omit<T, 'id'> = fieldsObject;
  try {
    await updateDoc(doc(db, collectionName, docKey), docInputFields);
  } catch (e) {
    console.error('Error Updating document: ', e);
  }
}

// If the document does not yet exist, it will be created. If you provide merge or mergeFields, the provided data can be merged into an existing document.
export async function SetDocField<T>(
  fieldsObject: T,
  collectionName: CollectionName,
  docKey = '',
  db = getFirestore()
) {
  const docInputFields: Omit<T, 'id'> = fieldsObject;
  try {
    await setDoc(doc(db, collectionName, docKey), docInputFields, {
      merge: true,
    });
  } catch (e) {
    console.error('Error Updating document: ', e);
  }
}

/**
 *  Delete a document from FIrestore
 *
 * @export
 * @param {JSX} warningIcon - Icon to show when deleting a document
 * @param {JSX} errorIcon - Icon to show when there is an error a document
 * @param {string} [collection=''] - Collection name, must exists in firestore
 * @param {string} [docKey=''] - Document key to deleted
 */
export async function DeleteDoc(
  warningIcon: JSX.Element,
  errorIcon: JSX.Element,
  notificationSubject: NotificationSubject,
  collectionName: CollectionName,
  docKey = '',
  db = getFirestore()
) {
  // read write ruls only to those users who have
  // manager Role on their profile

  try {
    await deleteDoc(doc(db, collectionName, docKey));

    console.log('Document Deleted');
    Notification(
      warningIcon,
      `Datos de ${notificationSubject} eliminados con éxito`,
      'Esta notificación se cerrará automaticámente.',
      'yellow',
      warningClasses
    );
  } catch (e) {
    // TODO: test errors
    // setErrors with state
    console.error('Error Deleting document: ', e);
    Notification(
      errorIcon,
      'Lo sentimos, ha ocurrido un error. Inténtelo nuevamente.',
      'Esta notificación se cerrará automaticámente.',
      'red',
      errorClasses
    );
  }
}

/**
 *
 *
 * @export
 * @param {CollectionName} collectionName
 * @param {string} [docKey='']
 * @param {*} [db=getFirestore()]
 */
export async function deleteSingleDoc(
  collectionName: CollectionName,
  docKey = '',
  db = getFirestore()
) {
  try {
    await deleteDoc(doc(db, collectionName, docKey));
    console.log('Document Deleted');
  } catch (e) {
    // TODO: test errors
    // setErrors with state
    console.error('Error Deleting document: ', e);
  }
}
