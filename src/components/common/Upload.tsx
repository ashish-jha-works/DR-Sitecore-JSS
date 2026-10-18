'use client';

import { useRef } from 'react';
import Image from 'next/image';

interface UploadProps {
  label?: string;
  labelClassName?: string;
  helperText?: string;
  accept: string[];
  multiple?: boolean;
  maxFiles?: number;
  files: File[];
  onChange: (files: File[]) => void;
}

export default function Upload({
  label = 'Upload file',
  labelClassName = '',
  helperText,
  accept,
  multiple = false,
  maxFiles,
  files,
  onChange,
}: UploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    let updated = multiple ? [...files, ...selected] : selected;

    if (maxFiles) {
      updated = updated.slice(0, maxFiles);
    }

    onChange(updated);
    e.target.value = '';
  };

  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="flex flex-col gap-3">
      {label && (
        <h3 className={`text-body lg:text-heading-3 font-medium text-navy-500 ${labelClassName}`}>
          {label}
        </h3>
      )}
      {helperText && <p className="text-body-sm text-navy-500 font-light">{helperText}</p>}

      <input
        ref={inputRef}
        type="file"
        hidden
        accept={accept.join(',')}
        multiple={multiple}
        onChange={handleChange}
      />

      {files.length === 0 && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex flex-col lg:flex-row items-center justify-center gap-2 rounded-xl border border-lilac-100 bg-white-pure py-6 lg:py-8 text-navy-500 font-light"
        >
          <Image src="/assets/svg/upload.svg" alt="upload" width={24} height={24} />
          <span className="hidden lg:block">Upload or drag and drop a file here.</span>
          <span className="lg:hidden">Upload a file here</span>
        </button>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-5 rounded-lg border border-indigo-100 bg-white-pure px-4 py-3"
            >
              <Image
                src="/assets/svg/delete-bin.svg"
                className="cursor-pointer"
                alt="delete"
                onClick={() => removeFile(index)}
                width={24}
                height={24}
              />
              {file.type.startsWith('image/') && (
                <Image src={URL.createObjectURL(file)} alt={file.name} width={30} height={30} />
              )}

              <span className="flex-1 truncate text-body font-light">{file.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
