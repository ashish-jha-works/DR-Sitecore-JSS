'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import Compressor from 'compressorjs';
import ImagePreviewModal from 'components/modals/ImagePreviewModal';
import VisibilityIcon from 'assets/icons/VisibilityIcon';
import CircleTickIcon from 'assets/icons/CircleTickIcon';
import CircleCrossIcon from 'assets/icons/CircleCrossIcon';
import InfoMessage from 'components/InfoMessage';
import { useUIStore } from 'src/store/useUIStore';

interface UploadProps {
  label?: string;
  labelClassName?: string;
  helperText?: string;
  accept: string[];
  files: File[];
  onChange: (files: File[]) => void;
  disabled?: boolean;
  maxFiles?: number;
  maxSize?: number;
  showFileName?: boolean;
  containerClassName?: string;
  compressImages?: boolean;
  errorText?: string;
  customError?: string;
}

export default function UploadImage({
  label = 'Upload file',
  labelClassName = '',
  helperText,
  accept,
  files,
  onChange,
  disabled = false,
  maxFiles = 3,
  maxSize = 5 * 1024 * 1024, // 5MB
  showFileName = false,
  containerClassName,
  compressImages = true,
  errorText,
  customError,
}: UploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { openModal } = useUIStore();
  const [error, setError] = useState<string | null>(null);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [localSelectedFiles, setLocalSelectedFiles] = useState<(string | File)[]>();

  const getFileKey = (file: File) => `${file.name}_${file.lastModified}`;

  const compressImage = (file: File, quality: number): Promise<File> =>
    new Promise((resolve, reject) => {
      new Compressor(file, {
        checkOrientation: true,
        quality,
        maxWidth: 1920, // resize large images
        maxHeight: 1920,
        success(result) {
          resolve(
            new File([result as Blob], file.name, {
              type: result.type,
              lastModified: file.lastModified,
            })
          );
        },
        error(err) {
          reject(err);
        },
      });
    });

  const processFiles = async (selected: File[]) => {
    setError(null);

    if (selected.length > maxFiles) {
      setError(
        'Only up to 3 images can be uploaded per service request. Please try again, selecting 3 or less.'
      );
      return;
    }

    if (files.length + selected.length > maxFiles) {
      setError(
        'You can upload a maximum of three files. Please delete an uploaded file to replace it with a new one.'
      );
      return;
    }

    const existingKeys = new Set(files.map(getFileKey));
    const processedFiles: File[] = [];

    for (const file of selected) {
      const fileKey = getFileKey(file);

      // Prevent duplicates
      if (existingKeys.has(fileKey)) {
        setError('Upload failed, you have already added this file.');
        continue;
      }

      existingKeys.add(fileKey);

      let finalFile = file;

      if (file.type.startsWith('image/') && compressImages) {
        try {
          const compressed = await compressImage(file, 0.8);
          if (compressed.size <= maxSize) {
            finalFile = compressed;
          }
          if (finalFile.size > maxSize) {
            setError(
              'Your file exceeds the 5 MB size limit even after compression. Please choose a smaller image.'
            );
            continue;
          }
        } catch {
          setError('Error compressing image.');
          continue;
        }
      } else {
        if (file.size > maxSize) {
          setError(
            errorText ? errorText : 'Document upload failed. The file size cannot exceed 5 MB.'
          );
          continue;
        }
      }

      processedFiles.push(finalFile);
    }

    if (processedFiles.length) {
      onChange([...files, ...processedFiles]);
    }
  };

  /* ------------------------------ Handlers -------------------------------- */

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    processFiles(selected);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files);
    processFiles(dropped);
  };

  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    onChange(updated);
  };

  /* ------------------------------ UI -------------------------------------- */

  return (
    <div className={`flex flex-col gap-3 ${disabled ? 'pointer-events-none opacity-50' : ''}`}>
      {label && (
        <h3 className={`text-body lg:text-heading-3 font-medium text-navy-500 ${labelClassName}`}>
          {label}
        </h3>
      )}

      {helperText && <p className="text-body text-navy-500 font-light">{helperText}</p>}

      {/* Hidden Input */}
      <input
        ref={inputRef}
        type="file"
        hidden
        accept={accept.join(',')}
        multiple
        onChange={handleChange}
      />

      <div
        className={`rounded-xl ${maxFiles > 1 ? 'border border-lilac-100 bg-white-pure p-2' : ''}`}
      >
        {/* Uploaded Files */}
        {files.length > 0 && (
          <div className="space-y-2 mb-2">
            {files.map((file, index) => (
              <div
                key={getFileKey(file)}
                className="flex items-center justify-between rounded-lg border border-lilac-200 bg-white-pure px-4 py-3"
              >
                <div className="flex gap-4 md:gap-5 items-center">
                  <span
                    onClick={() => {
                      if (!file.type.startsWith('image/')) {
                        const url = URL.createObjectURL(file);
                        window.open(url, '_blank', 'noopener,noreferrer');
                        // Optionally, revoke the object URL after some time to free memory
                        setTimeout(() => URL.revokeObjectURL(url), 10000);
                      } else {
                        setPreviewIndex(index);
                        setLocalSelectedFiles([...files]);
                        openModal('image-gallery-modal');
                      }
                    }}
                  >
                    <VisibilityIcon className="size-7 text-lilac-500 cursor-pointer" />
                  </span>
                  {/* Delete */}
                  <Image
                    src="/assets/svg/delete-bin.svg"
                    alt="delete"
                    width={20}
                    height={20}
                    className="cursor-pointer size-7"
                    onClick={() => removeFile(index)}
                  />

                  {/* Thumbnail */}
                  {file.type.startsWith('image/') && (
                    <Image
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      width={30}
                      height={30}
                      className="rounded w-7.5 h-7.5"
                    />
                  )}

                  {file.type.startsWith('application/pdf') && (
                    <Image
                      className="size-7"
                      src="/assets/svg/PDF-thumbnail.svg"
                      alt="PDF Thumbnail"
                      width={30}
                      height={30}
                    />
                  )}

                  {showFileName ? <p className="font-light truncate">{file?.name}</p> : null}
                </div>
                <div className="flex gap-2 md:gap-3 font-light text-body">
                  <CircleTickIcon className="size-5 md:size-6 text-success-500" />
                  <span className="hidden lg:inline">Uploaded</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upload Area - Hide if 3 files */}
        {files.length < maxFiles && (
          <div
            onClick={() => {
              if (inputRef.current) {
                inputRef.current.value = '';
                inputRef.current.click();
              }
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className={`flex flex-col lg:flex-row items-center justify-center gap-4.5 md:gap-6 py-6 lg:py-4.5 text-navy-500 font-light cursor-pointer ${
              containerClassName ? containerClassName : ''
            }`}
          >
            <Image src="/assets/svg/upload.svg" alt="upload" width={24} height={24} />
            <span className="hidden lg:block">Upload a new file or drag and drop it here.</span>
            <span className="lg:hidden">Upload a file here.</span>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <InfoMessage IconComponent={CircleCrossIcon} status="error" className="mt-2 md:mt-3">
          <p className="text-body">{error}</p>
        </InfoMessage>
      )}

      {customError && (
        <InfoMessage IconComponent={CircleCrossIcon} status="error" className="mt-2 md:mt-3">
          <p className="text-body">{customError}</p>
        </InfoMessage>
      )}

      {/* Preview Modal */}
      {localSelectedFiles?.length ? (
        <ImagePreviewModal
          images={localSelectedFiles}
          initialIndex={previewIndex ?? 0}
          enableSlider={false}
          onClose={() => setLocalSelectedFiles([])}
        />
      ) : null}
    </div>
  );
}
