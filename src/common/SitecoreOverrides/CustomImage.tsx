'use client';

import { Image } from '@sitecore-jss/sitecore-jss-nextjs';

const IMAGE_PLACEHOLDER = '/assets/images/placeholder-image.png';

const normalizeImageField = (field: any) => {
  if (!field) return null;
  if (field?.value?.src) return field;
  if (field?.src) return { value: field };
  return null;
};

export default function CustomImage({
  field,
  className,
  isLCP = false,
  fallbackToPlaceholder = false,
}: any) {
  const normalizedField = normalizeImageField(field);
  if (!normalizedField?.value?.src) {
    if (!fallbackToPlaceholder) return null;
    return <img src={IMAGE_PLACEHOLDER} className={className} alt="" />;
  }

  const src = normalizedField.value.src;

  const isSvg =
    normalizedField?.value?.mimeType === 'image/svg+xml' ||
    (src.includes('/-/media/') && !src.match(/\.(png|jpe?g|webp)$/i));

  const handleError = (e: any) => {
    const img = e.currentTarget as HTMLImageElement;
    if (!img.src.includes('placeholder-image.png')) {
      img.onerror = null;
      img.src = IMAGE_PLACEHOLDER;
    }
  };

  if (isSvg) {
    return (
      <img
        src={src}
        className={className}
        alt={normalizedField.value.alt || ''}
        loading={isLCP ? 'eager' : 'lazy'}
        width={normalizedField.value.width}
        height={normalizedField.value.height}
        onError={handleError}
      />
    );
  }

  return (
    <Image
      field={normalizedField}
      className={className}
      loading={isLCP ? 'eager' : 'lazy'}
      priority={isLCP ? 'true' : undefined}
      fetchPriority={isLCP ? 'high' : undefined}
      onError={handleError}
    />
  );
}
