'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'lib/swiper-style';

import ChevronLeft from 'assets/icons/ChevronLeft';
import ChevronRight from 'assets/icons/ChevronRight';
import CrossIcon from 'assets/icons/CrossIcon';
import { useUIStore } from 'src/store/useUIStore';

interface ImagePreviewModalProps {
  images: (string | File)[];
  onClose?: () => void;
  initialIndex?: number;
  enableSlider?: boolean;
  imageClassName?: string;
  title?: string;
}

export default function ImagePreviewModal({
  images,
  onClose,
  initialIndex = 0,
  enableSlider = true,
  imageClassName = '',
  title = 'Images',
}: ImagePreviewModalProps) {
  const { activeModal, closeModal } = useUIStore();
  const isOpen = activeModal === 'image-gallery-modal';

  const [prevEl, setPrevEl] = useState<HTMLElement | null>(null);
  const [nextEl, setNextEl] = useState<HTMLElement | null>(null);

  const imageUrls = useMemo(() => {
    return images?.map((img) => (typeof img === 'string' ? img : URL.createObjectURL(img)));
  }, [images]);

  useEffect(() => {
    return () => {
      imageUrls?.forEach((url) => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [imageUrls]);

  const showSlider = enableSlider && imageUrls?.length > 1;

  const handleClose = () => {
    if (onClose) onClose();
    closeModal();
  };

  if (!isOpen) return null;

  return (
    <div className="custom-modal show">
      <div className="relative bg-white-pure w-[90%] max-w-2xl rounded-xl p-4 md:p-6">
        <div className="flex justify-between items-center mb-4 md:mb-5">
          <h3 className="text-heading-3 font-normal text-navy-500">{title}</h3>
          <button
            onClick={handleClose}
            className="text-lilac-500 hover:text-navy-500 cursor-pointer transition-default"
          >
            <CrossIcon />
          </button>
        </div>

        {!showSlider ? (
          <Image
            src={imageUrls[initialIndex]}
            alt="preview"
            width={1000}
            height={800}
            className={`w-full max-h-55 md:max-h-87.5 h-auto object-cover rounded-xl ${imageClassName}`}
          />
        ) : (
          <>
            <Swiper
              modules={[Navigation]}
              navigation={{ prevEl, nextEl }}
              initialSlide={initialIndex}
              className="w-full"
              spaceBetween={0}
            >
              {imageUrls.map((src, index) => (
                <SwiperSlide key={index}>
                  <Image
                    src={src}
                    alt={`preview-${index}`}
                    width={1000}
                    height={800}
                    className={`w-full max-h-55 md:max-h-87.5 h-auto object-cover rounded-xl ${imageClassName}`}
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            <div className="flex justify-between gap-6 mt-5 md:mt-6">
              <button
                ref={(node) => setPrevEl(node)}
                className="btn btn-secondary w-12 h-12 inline-flex justify-center items-center p-0"
              >
                <ChevronLeft />
              </button>

              <button
                ref={(node) => setNextEl(node)}
                className="btn btn-secondary w-12 h-12 inline-flex justify-center items-center p-0"
              >
                <ChevronRight />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
