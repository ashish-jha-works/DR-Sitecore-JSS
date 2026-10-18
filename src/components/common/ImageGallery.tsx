import ImagePreviewModal from 'components/modals/ImagePreviewModal';
import { useState } from 'react';
import { useUIStore } from 'src/store/useUIStore';

export default function ImageGallery({ images }: any) {
  const openModal = useUIStore((state) => state.openModal);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const handleClick = (index: any) => {
    setActiveIndex(index);
    openModal('image-gallery-modal');
  };

  return (
    <div className="ImageGallery">
      <p className="text-body font-medium text-navy-500 mb-2">Images</p>
      <p className="text-body font-light text-navy-500 mb-2">Click to preview uploaded images.</p>
      <ul className="grid grid-cols-2 md:flex md:flex-wrap gap-5">
        {images.map((image: any, index: any) => (
          <li
            key={index}
            className="col-span-1 md:w-43.75 h-25 md:h-31.25 cursor-pointer"
            onClick={() => {
              handleClick(index);
            }}
          >
            <img
              className="w-full h-full object-cover rounded-xl"
              src={image}
              alt="gallery-image"
            />
          </li>
        ))}
      </ul>
      <ImagePreviewModal images={images} initialIndex={activeIndex ?? 0} />
    </div>
  );
}
