'use client';

import { Text } from '@sitecore-jss/sitecore-jss-nextjs';
import { useRouter } from 'next/navigation';
import { CustomImage, CustomRichText } from 'src/common/SitecoreOverrides';

interface MoveOutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  fields?: any;
  continueHref?: string;
}

export default function MoveOutConfirmModal({
  isOpen,
  onClose,
  fields = {},
  continueHref = '/contract-renewal/move-out',
}: MoveOutConfirmModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const benefits = fields?.moveOutConfirmList ?? [];

  const handleContinue = () => {
    onClose();
    router.push(continueHref);
  };

  return (
    <div className="custom-modal show overflow-y-auto !block">
      <div className="flex min-h-[100dvh] items-center justify-center p-5 md:p-8">
        <div className="relative bg-white-pure w-full max-w-5xl rounded-xl border border-lilac-300 px-4 md:px-8 py-4 md:py-8 max-h-[calc(100dvh-2.5rem)] md:max-h-[calc(100dvh-4rem)] overflow-y-auto">
          <Text
            tag="h2"
            field={fields?.moveOutConfirmHeading}
            className="text-heading-2 font-normal text-navy-500 mb-5 md:mb-6 text-left"
          />

          {benefits.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 mb-6 md:mb-8">
              {benefits.map((item: any, index: number) => (
                <div key={index} className="flex flex-col gap-3 text-left">
                  <CustomImage
                    field={item?.fields?.image}
                    className="w-full h-40 md:h-44 object-cover rounded-xl"
                  />
                  <Text
                    tag="h3"
                    field={item?.fields?.heading}
                    className="text-body font-medium text-navy-500"
                  />
                  <CustomRichText
                    field={item?.fields?.description}
                    className="text-body font-light text-navy-500"
                  />
                </div>
              ))}
            </div>
          ) : null}

          <div className="flex flex-col md:flex-row justify-end gap-4 md:gap-6">
            <button
              type="button"
              className="btn btn-secondary w-full md:w-auto md:min-w-40 h-11 md:h-15"
              onClick={onClose}
            >
              {fields?.moveOutConfirmCancelText?.value ?? 'CANCEL'}
            </button>
            <button
              type="button"
              className="btn btn-primary w-full md:w-auto md:min-w-55 h-11 md:h-15"
              onClick={handleContinue}
            >
              {fields?.moveOutConfirmContinueText?.value ?? 'CONTINUE MOVE-OUT'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
