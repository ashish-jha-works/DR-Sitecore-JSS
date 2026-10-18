import CrossIcon from 'assets/icons/CrossIcon';
import Image from 'next/image';

type ProfileImageModalProps = {
  isOpen: boolean;
  hasProfileImage: boolean;
  profileImageSrc: string | null;
  isRemoving: boolean;
  onClose: () => void;
  onUploadClick: () => void;
  onRemoveClick: () => void;
  onFileDrop: (files: FileList | File[]) => void;
};

export default function ProfileImageModal({
  isOpen,
  hasProfileImage,
  profileImageSrc,
  isRemoving,
  onClose,
  onUploadClick,
  onRemoveClick,
  onFileDrop,
}: ProfileImageModalProps) {
  if (!isOpen) return null;

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files?.length) {
      onFileDrop(event.dataTransfer.files);
    }
  };

  return (
    <div className={`custom-modal ${isOpen ? 'show' : ''}`}>
      <div className="custom-modal__wrapper !max-w-[600px] !text-start">
        <div className="flex items-center mb-3">
          <h4 className="text-navy-500 text-heading-2 font-normal grow">
            {hasProfileImage ? 'Edit profile photo' : 'Add profile photo'}
          </h4>
          <button type="button" className="shrink" onClick={onClose} aria-label="Close">
            <CrossIcon className="text-lilac-500 size-6 cursor-pointer" />
          </button>
        </div>

        <p className="mb-4 text-body font-light text-navy-500">
          The file size should not be more than 5 MB.
        </p>

        <div className="rounded-xl border border-lilac-100 bg-white-pure overflow-hidden">
          {hasProfileImage && (
            <div className="flex items-center gap-3 px-4 py-3 border-b border-lilac-100">
              <button
                type="button"
                className="shrink-0 disabled:opacity-50"
                onClick={onRemoveClick}
                disabled={isRemoving}
                aria-label="Remove profile photo"
              >
                <Image src="/assets/svg/delete-bin.svg" alt="Remove photo" width={24} height={24} />
              </button>
              {profileImageSrc ? (
                <img
                  src={profileImageSrc}
                  alt="Current profile photo"
                  className="size-8 rounded object-cover"
                />
              ) : (
                <Image
                  src="/assets/svg/PDF-thumbnail.svg"
                  alt="Profile photo"
                  width={24}
                  height={24}
                />
              )}
            </div>
          )}

          <div
            role="button"
            tabIndex={0}
            onClick={onUploadClick}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onUploadClick();
              }
            }}
            onDragOver={(event) => event.preventDefault()}
            onDrop={handleDrop}
            className="flex flex-col lg:flex-row items-center justify-center gap-4.5 md:gap-6 py-8 md:py-10 text-navy-500 font-light cursor-pointer"
          >
            <Image src="/assets/svg/upload.svg" alt="Upload" width={24} height={24} />
            <span className="text-body">Upload a new file or drag and drop it here.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
