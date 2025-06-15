'use client';
import Image from 'next/image';
import React, { useState } from 'react';
import ImageUploading, { ImageListType } from 'react-images-uploading';

import IconX from '@/components/icon/icon-x';
import PanelCodeHighlight from '@/components/panel-code-highlight';

const ComponentsFormsFileUploadMulti = () => {
  const [images2, setImages2] = useState<ImageListType>([]);
  const maxNumber = 69;
  const onChange2 = (imageList: ImageListType) => {
    setImages2(imageList as never[]);
  };

  return (
    <PanelCodeHighlight
      title='Multiple File'
      codeHighlight={`import { useState } from 'react';
import 'file-upload-with-preview/dist/file-upload-with-preview.min.css';
import ImageUploading, { ImageListType } from 'react-images-uploading';

const [images2, setImages2] = useState<any>([]);
const maxNumber = 69;

 const onChange2 = (imageList: ImageListType) => {
    setImages2(imageList);
  };
<div className="custom-file-container" data-upload-id="mySecondImage">
    <div className="label-container">
        <label>Upload </label>
        <button
            type="button"
            className="custom-file-container__image-clear"
            title="Clear Image"
            onClick={() => {
                setImages2([]);
            }}
        >
            ×
        </button>
    </div>
    <label className="custom-file-container__custom-file"></label>
    <input type="file" className="custom-file-container__custom-file__custom-file-input" accept="image/*" />
    <input type="hidden" name="MAX_FILE_SIZE" value="10485760" />
    <ImageUploading multiple value={images2} onChange={onChange2} maxNumber={maxNumber}>
        {({ imageList, onImageUpload, onImageRemoveAll, onImageUpdate, onImageRemove }) => (
            <div className="upload__image-wrapper">
                <button className="custom-file-container__custom-file__custom-file-control" onClick={onImageUpload}>
                    Choose File...
                </button>
                &nbsp;
                <div className="grid gap-4 sm:grid-cols-3 grid-cols-1">
                    {imageList.map((image, index) => (
                        <div key={index} className="custom-file-container__image-preview relative">
                            <button
                                type="button"
                                className="custom-file-container__image-clear bg-dark-light dark:bg-dark dark:text-white-dark rounded-full block w-fit p-0.5 absolute top-0 left-0"
                                title="Clear Image"
                                onClick={() => onImageRemove(index)}
                            >
                                <svg>...</svg>
                            </button>
                            <img src={image.dataURL} alt="img" className="object-cover shadow rounded w-full !max-h-48" />
                        </div>
                    ))}
                </div>
            </div>
        )}
    </ImageUploading>
    {images2.length === 0 ? <img src="/assets/images/file-preview.svg" className="max-w-md w-full m-auto" alt="" /> : ''}
</div>`}
    >
      <div className='mb-5'>
        <div className='custom-file-container' data-upload-id='mySecondImage'>
          <div className='label-container'>
            <label htmlFor='multi-file-upload'>Upload </label>
            <button
              type='button'
              className='custom-file-container__image-clear'
              title='Clear Image'
              onClick={() => {
                setImages2([]);
              }}
            >
              ×
            </button>
          </div>
          <input
            id='multi-file-upload'
            type='file'
            className='custom-file-container__custom-file__custom-file-input'
            accept='image/*'
            multiple
          />
          <input type='hidden' name='MAX_FILE_SIZE' value='10485760' />
          <ImageUploading
            multiple
            value={images2}
            onChange={onChange2}
            maxNumber={maxNumber}
          >
            {({ imageList, onImageUpload, onImageRemove }) => (
              <div className='upload__image-wrapper'>
                <button
                  className='custom-file-container__custom-file__custom-file-control'
                  onClick={onImageUpload}
                >
                  Choose File...
                </button>
                &nbsp;
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
                  {imageList.map((image, index) => (
                    <div
                      key={
                        image.file
                          ? `${image.file.name}-${image.file.lastModified}`
                          : index
                      }
                      className='custom-file-container__image-preview relative'
                    >
                      <button
                        type='button'
                        className='custom-file-container__image-clear bg-dark-light dark:bg-dark dark:text-white-dark absolute left-0 top-0 block w-fit rounded-full p-0.5'
                        title='Clear Image'
                        onClick={() => onImageRemove(index)}
                      >
                        <IconX className='h-3 w-3' />
                      </button>
                      <Image
                        src={image.dataURL ?? ''}
                        alt='img'
                        className='!max-h-48 w-full rounded object-cover shadow'
                        width={100}
                        height={100}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </ImageUploading>
          {images2.length === 0 ? (
            <Image
              src='/assets/images/file-preview.svg'
              className='m-auto w-full max-w-md'
              alt=''
              width={100}
              height={100}
            />
          ) : (
            ''
          )}
        </div>
      </div>
    </PanelCodeHighlight>
  );
};

export default ComponentsFormsFileUploadMulti;
