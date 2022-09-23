import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Text, Group, createStyles, Alert } from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { AlertCircle, CloudUpload } from 'tabler-icons-react';

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: 'relative',
    marginTop: 4,
    marginBottom: 30,
  },

  dropzone: {
    borderWidth: 1,
    paddingBottom: 50,
  },

  icon: {
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[3]
        : theme.colors.gray[4],
  },

  control: {
    position: 'absolute',
    width: 250,
    left: 'calc(50% - 125px)',
    bottom: -20,
  },
}));

const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden',
};
export interface FileProps extends File {
  preview: string;
}
interface DropzoneProps {
  filesPreview: FileProps[] | [];
  setFilesPreview: (files: FileProps[]) => void;
}

export function DropzoneButton({
  filesPreview = [],
  setFilesPreview,
}: DropzoneProps) {
  const [uploadError, setUploadError] = useState(false);
  const [uploadRejectedFiles, setUploadRejectedFiles] = useState<any[]>([]);

  const { classes } = useStyles();

  function handleRemoveFiles(file1: string) {
    console.log('remove file', file1);

    // setFiles(files.filter((file: FileProps) => file.name !== file1));
    setFilesPreview(
      filesPreview.filter((file: FileProps) => file.preview !== file1)
    );
  }
  const thumbs = filesPreview.map((file: FileProps, index: number) => (
    <div
      key={file.name + index + 1}
      className='my-4 pb-3 p-3 rounded border-[1px] border-neutral-300'
    >
      <div className='flex justify-between cursor-pointer pb-4'>
        <p className='font-semibold text-sm'>Imagen {index + 1}</p>
        <span
          className='text-sm underline text-blue-500 hover:text-blue-600'
          title='Eliminar Imagen'
          onClick={() => handleRemoveFiles(file.preview)}
        >
          Eliminar
        </span>
      </div>
      <div className='flex items-center justify-center mb-[8px] padding-[4px] '>
        <div style={thumbInner}>
          <Image
            src={file.preview}
            alt='Imagen'
            width={500}
            height={330}
            objectFit='scale-down'
          />
        </div>
      </div>
      <p className='p-2 font-medium text-center text-sm pt-2'>{file.name}</p>
      <span className='block text-center text-sm'>
        {formatBytes(file.size)}
      </span>
    </div>
  ));

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks
    filesPreview.forEach((file: FileProps) =>
      URL.revokeObjectURL(file.preview)
    );
  }, []);

  function formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  const rejectErrorCodes = {
    'file-invalid-type':
      'El archivo debe ser una imágen tipo jpeg, png, gif, svg o webp',
    'file-too-large': 'El tamaño de la imágen es muy grande. (máximo 5mb)',
    'file-too-small': 'El tamaño de la imágen es muy pequeño. (mínimo 0.1kb)',
    'too-many-files': 'Demasiados archivos (máximo 15)',
  };

  return (
    <div className={classes.wrapper}>
      {uploadError && (
        <Alert
          icon={<AlertCircle size={16} />}
          title={`${uploadRejectedFiles.length} ${
            uploadRejectedFiles.length > 1
              ? 'archivos rechazados'
              : 'archivo rechazado'
          }`}
          color='red'
          my={16}
          onClose={() => {
            setUploadError(false);
            setUploadRejectedFiles([]);
          }}
          withCloseButton
        >
          {uploadRejectedFiles.map(({ file, errors }, index) => (
            <div className='mb-1.5' key={file.name + index}>
              <p className='text-sm font-bold'>
                {`${file.name} (${formatBytes(file.size)})`}
              </p>
              <span>{rejectErrorCodes[errors[0].code]}</span>
            </div>
          ))}
        </Alert>
      )}
      <div>{thumbs}</div>
      <Dropzone
        onDrop={(acceptedFiles) => {
          setUploadError(false);
          setUploadRejectedFiles([]);
          console.log('accepted files', acceptedFiles);
          const newFiles = acceptedFiles.map((file) =>
            Object.assign(file, {
              preview: URL.createObjectURL(file),
            })
          );
          setFilesPreview([...filesPreview, newFiles].flat());
        }}
        onReject={(rejectedFiles) => {
          setUploadError(true);
          setUploadRejectedFiles(rejectedFiles);
        }}
        className={classes.dropzone}
        radius='md'
        accept={IMAGE_MIME_TYPE}
        maxSize={5000000}
        maxFiles={15}
      >
        <div>
          <Group position='center' mt={16}>
            <CloudUpload size={50} />
          </Group>
          <Text align='center' weight={700} size='lg' mt={16}>
            Adjuntar Imagenes
          </Text>
          <Text align='center' size='sm' color='dimmed' mt={16}>
            Presiona AQUÍ para comenzar a subir archivos. Se aceptan solo
            imagenes que sean menores a 5mb de tamaño.
          </Text>
        </div>
      </Dropzone>
    </div>
  );
}
