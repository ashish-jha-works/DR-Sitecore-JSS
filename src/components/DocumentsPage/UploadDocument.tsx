'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import ImagePreviewModal from 'components/modals/ImagePreviewModal';
import VisibilityIcon from 'assets/icons/VisibilityIcon';
import CircleTickIcon from 'assets/icons/CircleTickIcon';
import CircleCrossIcon from 'assets/icons/CircleCrossIcon';
import InfoMessage from 'components/InfoMessage';
import { useUIStore } from 'src/store/useUIStore';
import EditIcon from 'assets/icons/EditIcon';
import { formatDateToMonthReadable } from 'lib/utils/helper';
import DownloadIcon from 'assets/icons/DownloadIcon';
import DocumentIcon from 'assets/icons/DocumentIcon';
import { useApiMutation } from 'src/hooks/useApi';
import { useUserStore } from 'src/store/useUserStore';
import { useFileDownload } from 'components/payments/PaymentsPage/useFileDownload';
import DownloadErrorModal from './DownloadErrorModal';
import { DOCUMENT_STATUS_TYPE } from './constants';
import { Text } from '@sitecore-jss/sitecore-jss-nextjs';

interface UploadProps {
  label?: string;
  labelClassName?: string;
  helperText?: string;
  accept?: string[];
  files?: File[];
  onChange: (files: File[]) => void;
  disabled?: boolean;
  maxFiles?: number;
  maxSize?: number;
  showFileName?: boolean;
  containerClassName?: string;
  compressImages?: boolean;
  errorText?: string;
  customError?: string;
  document?: any;
  documentType?: string;
  fields?: any;
}

export default function UploadDocument({
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
  errorText,
  document,
  documentType,
  fields,
}: UploadProps) {
  const { tCode } = useUserStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const { openModal } = useUIStore();
  const [error, setError] = useState<string | null>(null);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [localSelectedFiles, setLocalSelectedFiles] = useState<(string | File)[]>();
  const [isEditing, setIsEditing] = useState(false);

  const { mutate: downloadDocumentAPI } = useApiMutation<any, any>(
    () => `MyDocuments/Attachment`,
    'POST',
    true
  );

  const { mutate: fetchIBANDocumentDetails } = useApiMutation<any, any>(
    () => `/v1/payments/dashboard/${tCode}/IBAN`,
    'GET',
    true
  );

  const { downloadFile } = useFileDownload();

  const getFileKey = (file: File) => `${file.name}_${file.lastModified}`;

  const processFiles = async (selected: File[]) => {
    setError(null);

    if (!files) {
      return;
    }

    if (selected.length > maxFiles) {
      setError('You can select only a single file to upload');
      return;
    }

    if (files.length + selected.length > maxFiles) {
      setError(
        'You can upload a maximum of 1 file. Please delete an uploaded file to replace it with a new one.'
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

      const finalFile = file;

      // In case user selects a different file format
      const rawName = file.name.replace(/\s/g, '');
      const extension = rawName.split('.').pop() ?? '';
      if (!['JPG', 'PDF'].includes(extension.toUpperCase())) {
        setError('Invalid file format. The supported file formats are JPG and PDF.');
        continue;
      }

      if (file.size > maxSize) {
        setError(
          errorText ? errorText : `Document upload failed. The file size cannot exceed 5 MB.`
        );
        continue;
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
    if (files) {
      const updated = files.filter((_, i) => i !== index);
      onChange(updated);
    }
  };

  const handleDownloadClick = () => {
    if (document?.DisplayName === 'Dubai Residential IBAN Details') {
      fetchIBANDocumentDetails(null, {
        onSuccess: (res) => {
          downloadFile(res?.iban, 'Dubai_Residential_IBAN.pdf');
        },
      });
    } else {
      const requestData = {
        Object_type: document?.ObjectType,
        Object_reference: tCode,
        Attachment_type: document?.Attachment_Type,
        Attachment_hmy: document?.hAttachment,
      };
      downloadDocumentAPI(JSON.stringify(requestData), {
        onSuccess: (response) => {
          if (response) {
            downloadFile(response.FileBase64String, response.File_Name);
          }
        },
        onError: () => openModal('document-download-error-modal'),
      });
    }
  };

  let isExpired = false;

  if (document?.expiryDate) {
    const [day, month, year] = document?.expiryDate?.split('/');

    const currentDate = new Date();

    const _documentExpiryDate = new Date(`${year}-${month}-${day}`);

    isExpired = document?.expiryDate ? _documentExpiryDate < currentDate : false;
  }

  const showUploadContainer =
    !(document?.Status === DOCUMENT_STATUS_TYPE.IN_PROGRESS && !document?.File_Name) &&
    ((isEditing && files && files.length < maxFiles) ||
      (files && files.length < maxFiles && !(document?.File_Name || document?.hAttachment)));

  return (
    <div className={`flex flex-col gap-3 ${disabled ? 'pointer-events-none opacity-50' : ''}`}>
      {label && (
        <div className="flex gap-5 lg:gap-6 items-center">
          <h3 className={`text-body lg:text-heading-3 font-medium text-navy-500 ${labelClassName}`}>
            {label}
          </h3>
          {document?.File_Name && document?.expiryDate ? (
            !isExpired ? (
              <span className="font-light text-body text-navy-500/60">
                Expiry date: {formatDateToMonthReadable(document?.expiryDate)}
              </span>
            ) : (
              <span className="px-4 py-2 inline rounded-full border-solid bg-danger-50 text-color-error border border-danger-500 text-body-sm">
                Expired
              </span>
            )
          ) : null}
        </div>
      )}

      {helperText && <p className="text-body text-navy-500 font-light">{helperText}</p>}

      {/* Hidden Input */}
      <input
        ref={inputRef}
        type="file"
        hidden
        accept={accept && accept.join(',')}
        onChange={handleChange}
      />

      {(files && files.length > 0) ||
      (document?.File_Name &&
        document?.hAttachment &&
        files &&
        files.length == 0 &&
        !(documentType === 'UTILITY' && document?.Status === DOCUMENT_STATUS_TYPE.IN_PROGRESS)) ||
      showUploadContainer ? (
        <div
          className={`rounded-xl border border-lilac-200 bg-white-pure ${
            maxFiles > 1 ? 'p-2' : ''
          }`}
        >
          {/* Uploaded Files */}
          {files.length > 0 && (
            <div className="space-y-2">
              {files.map((file, index) => (
                <div
                  key={getFileKey(file)}
                  className={`flex items-center justify-between bg-white-pure px-4 py-3 ${
                    maxFiles > 1 ? 'rounded-lg border border-lilac-200' : ''
                  }`}
                >
                  <div className="flex flex-1 min-w-0 gap-3 items-center">
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

                    <DocumentIcon className="size-7 text-lilac-500 min-w-7" />

                    {showFileName ? (
                      <p className="font-light truncate text-body">{file?.name}</p>
                    ) : null}
                  </div>
                  <div className="flex gap-2 md:gap-3 font-light text-body">
                    <CircleTickIcon className="size-5 md:size-6 text-success-500" />
                    <span className="hidden lg:inline">Uploaded</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Preattached File */}
          {document?.File_Name &&
            document?.hAttachment &&
            files.length == 0 &&
            !(
              documentType === 'UTILITY' && document?.Status === DOCUMENT_STATUS_TYPE.IN_PROGRESS
            ) && (
              <div className="space-y-2">
                <div
                  className={`flex flex-wrap gap-2 md:gap-0 items-center lg:justify-between bg-white-pure px-4 py-3 ${
                    maxFiles > 1 ? 'rounded-lg border border-lilac-200' : ''
                  }`}
                >
                  <div className="flex flex-1 min-w-0 gap-3 items-center">
                    {document.version !== 2 && (
                      <div onClick={handleDownloadClick}>
                        <DownloadIcon className="size-7 text-lilac-500 cursor-pointer" />
                      </div>
                    )}
                    <DocumentIcon className="size-7 text-lilac-500" />
                    {document?.File_Name ? (
                      <p className="font-light truncate text-body">{document?.File_Name}</p>
                    ) : null}
                  </div>
                  {!isEditing && // Disable when manually editing a document
                  document.version !== 2 && // Disable when any document is under review
                  documentType !== 'CONTRACT' && // To disable all documents of Contract type
                  !(
                    (documentType === 'UTILITY' && document.Status === '') // Hide Edit when document is an approved utility
                  ) ? (
                    <div
                      className="flex gap-2 md:gap-3 font-light text-body items-center cursor-pointer py-2 px-4 md:px-10"
                      onClick={() => setIsEditing(true)}
                    >
                      <EditIcon className="size-5" />
                      <span className="text-body-xs uppercase font-medium">Edit</span>
                    </div>
                  ) : null}
                </div>
              </div>
            )}

          {/* Upload Area */}
          {showUploadContainer && (
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
      ) : null}

      {/* Success Message */}
      {document?.Status && document?.Status === DOCUMENT_STATUS_TYPE.IN_PROGRESS ? (
        <InfoMessage IconComponent={CircleTickIcon} status="success" className="mt-2 lg:mt-3">
          <Text tag="p" className="text-body font-light" field={fields?.statusReviewInProgress} />
        </InfoMessage>
      ) : null}

      {/* Error Message */}
      {document?.Status && document?.Status === DOCUMENT_STATUS_TYPE.CANCELLED && (
        <InfoMessage IconComponent={CircleCrossIcon} status="error" className="mt-2 lg:mt-3">
          <Text tag="p" className="text-body font-light" field={fields?.statusDocumentRejected} />
        </InfoMessage>
      )}

      {/* Local Image Upload Error Message */}
      {error && (
        <InfoMessage IconComponent={CircleCrossIcon} status="error" className="mt-2 lg:mt-3">
          <p className="text-body font-light">{error}</p>
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
      <DownloadErrorModal title={fields?.downloadErrorModalTitle?.value} />
    </div>
  );
}
