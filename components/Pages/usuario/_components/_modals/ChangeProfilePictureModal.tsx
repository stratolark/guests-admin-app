import { Button, Group, LoadingOverlay, Modal, Slider } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useRef,
  useState,
} from 'react';
import AvatarEditor from 'react-avatar-editor';
import { ZoomIn, ZoomOut } from 'tabler-icons-react';
import debounce from 'lodash/debounce';
import { AuthUserContext } from 'next-firebase-auth';
import {
  DeleteStorageObj,
  getStorageDownloadURL,
  UpdateUserProfile,
  UploadDataUrlToStorage,
} from '@/components/Pages/_shared/firebase';
import { reload, User } from 'firebase/auth';

type ChangeProfilePictureModalProps = {
  setSelectedFile: Dispatch<SetStateAction<string | File>>;
  selectedFile: string | File;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  authUser: AuthUserContext;
};

export default function ChangeProfilePictureModal({
  setSelectedFile,
  selectedFile,
  open,
  setOpen,
  authUser,
}: ChangeProfilePictureModalProps) {
  const [hasOverlay, setHasOverlay] = useState(false);
  const [sliderVal, setSliderVal] = useState(10);
  const avatarEditorRef = useRef<AvatarEditor>();
  const [previewUrl, setPreviewUrl] = useState<string | File>('');

  function handleImageChange() {
    return debounce(
      () =>
        setPreviewUrl(
          avatarEditorRef.current
            ?.getImageScaledToCanvas()
            .toDataURL('image/png', 0.85) as string | File
        ),
      100
    );
  }
  const [debouncedImage] = useDebouncedValue<string | File>(previewUrl, 200);
  // TODO: add avatar url to navbar
  // TODO: add uploading avatar flow
  async function handleAvatarUpload() {
    setHasOverlay(true);
    // Upload picture
    const fileUploadResponse = await UploadDataUrlToStorage(
      debouncedImage as string,
      authUser.email as string
    );
    // Get response, if error, inform user of error and quit modal, redo flow
    // If response is successful, then continue
    // getDownloadUrl
    // get authUser
    // UpdateProfile with getDownloadUrl
    // if successful, notify user
    // then reload() user data
    // and close modal

    const uploadFileFullPath = fileUploadResponse?.metadata?.fullPath;
    // If the authUser.photoURL is not null or an empty string,
    // then we use the url to get the getDownloadURL
    // then we delete the current photo ref
    // then we continue like normal
    if (authUser.photoURL !== null) {
      await DeleteStorageObj(authUser.photoURL);
      console.log('Current photoURL has been deleted.');
    }

    const avatarUrl = await getStorageDownloadURL(uploadFileFullPath);
    console.log('avatarUrl', avatarUrl);

    await UpdateUserProfile(authUser, { photoURL: avatarUrl });

    await reload(authUser.firebaseUser as User);
    setPreviewUrl('');
    setSelectedFile('');
    setHasOverlay(false);
    setSliderVal(10);
    setOpen(false);
  }

  return (
    <Modal
      opened={open}
      onClose={() => {
        setSelectedFile('');
        setPreviewUrl('');
        setSliderVal(10);
        setOpen(false);
      }}
      title='Cambiar Foto de Perfil'
    >
      <div>
        <LoadingOverlay visible={hasOverlay} />
        <Group position='center' mt={30}>
          <AvatarEditor
            ref={avatarEditorRef as MutableRefObject<AvatarEditor>}
            scale={sliderVal / 10}
            image={selectedFile as File}
            width={285}
            height={285}
            border={[25, 15]}
            color={[255, 255, 255, 0.6]}
            rotate={0}
            onImageReady={handleImageChange()}
            onImageChange={handleImageChange()}
          />
          <Group className='w-full' noWrap>
            <ZoomOut />
            <Slider
              label={null}
              showLabelOnHover={false}
              classNames={{ root: 'w-full', track: 'w-full' }}
              value={sliderVal}
              onChange={setSliderVal}
              thumbLabel='Thumb aria-label'
              min={10}
            />
            <ZoomIn />
          </Group>
        </Group>
        <Group position='right' mt={50}>
          <Button
            onClick={() => {
              setSelectedFile('');
              setSliderVal(10);
              setPreviewUrl('');
              setOpen(false);
            }}
            variant='outline'
          >
            Cancelar
          </Button>
          <Button
            onClick={() => handleAvatarUpload()}
            classNames={{
              root: '!bg-blue-500 hover:!bg-blue-600',
            }}
          >
            Guardar
          </Button>
        </Group>
      </div>
    </Modal>
  );
}
