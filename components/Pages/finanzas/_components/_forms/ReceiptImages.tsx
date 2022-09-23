import { LoadingOverlay } from '@mantine/core';
import { type Dispatch, type SetStateAction } from 'react';
import { Trash } from 'tabler-icons-react';
import Image from 'next/image';
type ReceiptImagesProps = {
  selectImage: string[];
  setSelectImage: Dispatch<SetStateAction<string[]>>;
  imagesUrls: string[];
};
export default function ReceiptImages({
  imagesUrls = [''],
  selectImage = [''],
  setSelectImage = () => [''],
}: Partial<ReceiptImagesProps>) {
  function handleSelectImage(url: string) {
    if (selectImage?.includes(url)) {
      setSelectImage(selectImage?.filter((i) => i !== url));
    }
    if (!selectImage?.includes(url)) {
      setSelectImage((prev) => [...prev, url]);
    }
  }

  return (
    <div className='mb-6 relative'>
      <h3 className='font-bold text-sm mb-2'>
        Imágenes de Recibo {`(${imagesUrls?.length})`}:
      </h3>
      <div className='grid grid-cols-2 gap-4'>
        {imagesUrls?.map((url, index) => (
          <div
            className='border-[1px] rounded-md border-neutral-300 p-3 grid'
            key={url + index}
          >
            <label
              className={`font-semibold text-sm ${
                !selectImage?.includes(url) ? 'line-through' : ''
              }`}
            >
              Imagen {index + 1}
            </label>
            <div className='relative'>
              <LoadingOverlay
                visible={!selectImage?.includes(url)}
                loader={
                  <div className='bg-white rounded-full p-3'>
                    <Trash size={30} />
                  </div>
                }
              />
              <div className='mt-3'>
                <a
                  href={url}
                  title={`Imagen ${index + 1}`}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <Image
                    src={url}
                    alt={`Imagen ${index + 1}`}
                    width={500}
                    // TODO: add placeholder image
                    height={500}
                    loading='lazy'
                  />
                </a>
              </div>
            </div>
            <div className='mt-2 self-end text-center'>
              <button
                type='button'
                onClick={() => handleSelectImage(url)}
                className='cursor-pointer text-sm underline text-blue-500 hover:text-blue-600'
                title='Eliminar de Recibo'
              >
                {!selectImage?.includes(url)
                  ? 'Deshacer'
                  : 'Eliminar de Recibo'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
