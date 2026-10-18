import { useCallback, useEffect, useRef, useState } from 'react';
import { useApiMutation } from 'src/hooks/useApi';
import { useUIStore } from 'src/store/useUIStore';

const ACCEPTED_EXTENSIONS = ['bmp', 'png', 'jpg', 'jpeg'];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export type ProfileImageSuccessType = 'upload' | 'delete' | null;

type ProfilePictureResponse = {
  ProfilePicture?: string | null;
};

type ProfileMediaResponse = {
  Code?: number;
  Status?: string;
};

type ProfileMediaUploadPayload = {
  ProfilePicture: string;
  TCode: string;
};

const isProfileMediaSuccess = (response: ProfileMediaResponse | null | undefined) =>
  response?.Code === 200 || response?.Status === 'Success';

const toProfileImageSrc = (value: unknown): string | null => {
  if (!value) return null;

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed.length) return null;
    return trimmed.startsWith('data:') ? trimmed : `data:image/jpeg;base64,${trimmed}`;
  }

  if (typeof value === 'object' && value !== null) {
    const profilePicture =
      (value as { ProfilePicture?: string | null }).ProfilePicture ??
      (value as { ProfileMedia?: string | null }).ProfileMedia;

    return toProfileImageSrc(profilePicture);
  }

  return null;
};

const readFileAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export const useProfileImage = (tCode: string | null, enabled = true) => {
  const { openModal } = useUIStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profileImageSrc, setProfileImageSrc] = useState<string | null>(null);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [successType, setSuccessType] = useState<ProfileImageSuccessType>(null);
  const [isUploadErrorOpen, setIsUploadErrorOpen] = useState(false);
  const [hasProfileImage, setHasProfileImage] = useState(false);

  const profileMediaUrl = useCallback(() => `/ProfileMedia?tCode=${tCode}`, [tCode]);
  const profileMediaUpdateUrl = useCallback(() => `/ProfileMedia/Update?tCode=${tCode}`, [tCode]);

  const { mutate: fetchProfileImage, isPending: isLoadingImage } = useApiMutation<
    null,
    ProfilePictureResponse
  >(profileMediaUrl, 'GET', false);

  const { mutate: uploadProfileImage, isPending: isUploading } = useApiMutation<
    ProfileMediaUploadPayload,
    ProfileMediaResponse
  >(profileMediaUpdateUrl, 'PUT', true);

  const { mutate: removeProfileImage, isPending: isRemoving } = useApiMutation<
    null,
    ProfileMediaResponse
  >(profileMediaUrl, 'DELETE', true);

  const loadProfileImage = useCallback(() => {
    if (!tCode || !enabled) return;

    fetchProfileImage(null, {
      onSuccess: (response) => {
        const imageSrc = toProfileImageSrc(response);
        if (!imageSrc) {
          setProfileImageSrc(null);
          setHasProfileImage(false);
          return;
        }

        setProfileImageSrc(imageSrc);
        setHasProfileImage(true);
      },
      onError: () => {
        setProfileImageSrc(null);
        setHasProfileImage(false);
      },
    });
  }, [tCode, enabled, fetchProfileImage]);

  useEffect(() => {
    loadProfileImage();
  }, [loadProfileImage]);

  const openOptionsModal = () => setIsOptionsOpen(true);
  const closeOptionsModal = () => setIsOptionsOpen(false);

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const validateFile = (file: File) => {
    const extension = file.name.split('.').pop()?.toLowerCase() ?? '';

    if (!ACCEPTED_EXTENSIONS.includes(extension)) {
      return false;
    }

    return file.size <= MAX_FILE_SIZE;
  };

  const uploadFile = async (file: File) => {
    if (!tCode) return;

    if (!validateFile(file)) {
      closeOptionsModal();
      setIsUploadErrorOpen(true);
      return;
    }

    try {
      const uploadImg = await readFileAsDataUrl(file);
      const previewSrc = URL.createObjectURL(file);

      closeOptionsModal();
      setProfileImageSrc(previewSrc);
      setHasProfileImage(true);

      uploadProfileImage(
        { ProfilePicture: uploadImg, TCode: tCode },
        {
          onSuccess: (response) => {
            if (isProfileMediaSuccess(response)) {
              setHasProfileImage(true);
              setSuccessType('upload');
              // Keep local preview if re-fetch fails; only replace when GET returns an image.
              fetchProfileImage(null, {
                onSuccess: (profileResponse) => {
                  const imageSrc = toProfileImageSrc(profileResponse);
                  if (imageSrc) {
                    setProfileImageSrc(imageSrc);
                    setHasProfileImage(true);
                  }
                },
              });
              return;
            }

            setProfileImageSrc(null);
            setHasProfileImage(false);
            openModal('error-modal');
          },
          onError: () => {
            setProfileImageSrc(null);
            setHasProfileImage(false);
            loadProfileImage();
            openModal('error-modal');
          },
        }
      );
    } catch {
      closeOptionsModal();
      setIsUploadErrorOpen(true);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    await uploadFile(file);
  };

  const handleFileDrop = async (files: FileList | File[]) => {
    const file = Array.from(files)[0];
    if (!file) return;
    await uploadFile(file);
  };

  const handleRemoveImage = () => {
    if (!tCode) return;

    removeProfileImage(null, {
      onSuccess: (response) => {
        if (isProfileMediaSuccess(response)) {
          closeOptionsModal();
          setProfileImageSrc(null);
          setHasProfileImage(false);
          setSuccessType('delete');
          return;
        }

        openModal('error-modal');
        loadProfileImage();
      },
      onError: () => {
        openModal('error-modal');
        loadProfileImage();
      },
    });
  };

  const retryUpload = () => {
    setIsUploadErrorOpen(false);
    triggerFileSelect();
  };

  return {
    profileImageSrc,
    hasProfileImage,
    isLoadingImage,
    isUploading,
    isRemoving,
    isOptionsOpen,
    successType,
    isUploadErrorOpen,
    fileInputRef,
    setSuccessType,
    setIsUploadErrorOpen,
    openOptionsModal,
    closeOptionsModal,
    triggerFileSelect,
    handleFileChange,
    handleFileDrop,
    handleRemoveImage,
    retryUpload,
  };
};
