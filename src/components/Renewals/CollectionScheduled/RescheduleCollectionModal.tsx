'use client';

import CircleInfoIcon from 'assets/icons/CircleInfoIcon';
import CrossIcon from 'assets/icons/CrossIcon';
import AvailableCalendar from 'components/common/AvailableCalendar';
import { Radio } from 'components/common/Radio';
import InfoMessage from 'components/InfoMessage';
import { CustomRichText, Text } from 'src/common/SitecoreOverrides';
import { useUIStore } from 'src/store/useUIStore';

export const RESCHEDULE_COLLECTION_MODAL_ID = 'reschedule-collection-modal';

type TimeSlotOption = {
  label: string;
  disabled: boolean;
};

type RescheduleCollectionModalProps = {
  fields: any;
  isDelivery: boolean;
  selectedDate: Date | undefined;
  selectedSlot: string;
  availableDateKeys: Set<string>;
  timeSlots: TimeSlotOption[];
  isSubmitting: boolean;
  onSelectDate: (date: Date | undefined) => void;
  onSelectSlot: (slot: string) => void;
  onConfirm: () => void;
  onClose: () => void;
};

export default function RescheduleCollectionModal({
  fields,
  isDelivery,
  selectedDate,
  selectedSlot,
  availableDateKeys,
  timeSlots,
  isSubmitting,
  onSelectDate,
  onSelectSlot,
  onConfirm,
  onClose,
}: RescheduleCollectionModalProps) {
  const { activeModal } = useUIStore();

  const titleField = isDelivery
    ? fields?.rescheduleDeliveryModalTitle
    : fields?.rescheduleCollectionModalTitle;
  const descriptionField = isDelivery
    ? fields?.rescheduleDeliveryModalDescription
    : fields?.rescheduleCollectionModalDescription;
  const ctaField = isDelivery
    ? fields?.rescheduleDeliveryCTALabel
    : fields?.rescheduleCollectionCTALabel;

  const isConfirmDisabled = !selectedDate || !selectedSlot || isSubmitting;

  return (
    <div className={`custom-modal ${activeModal === RESCHEDULE_COLLECTION_MODAL_ID ? 'show' : ''}`}>
      <div className="relative bg-white-pure lg:w-[90%] max-w-4xl rounded-xl p-4 md:p-8">
        <div className="flex flex-row justify-between gap-4">
          <div className="flex flex-col gap-2 lg:gap-3">
            <div className="flex items-center gap-4">
              <CustomRichText
                field={fields?.rescheduleModalIcon}
                className="shrink-0 [&_svg]:h-[22px] [&_svg]:w-[31px]"
              />
              <Text
                tag="h1"
                field={titleField}
                className="text-[16px] md:text-[20px] font-normal text-navy-500"
              />
            </div>
            <Text tag="p" field={descriptionField} className="text-body font-light text-navy-500" />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 cursor-pointer shrink-0 self-start"
            aria-label="Close"
          >
            <CrossIcon className="size-6 md:size-7 text-lilac-500" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-5 lg:gap-16.5 mt-5 mb-3 md:my-6">
          <AvailableCalendar
            selectedDate={selectedDate}
            onSelect={onSelectDate}
            availableDateKeys={availableDateKeys}
          />

          <div className="pb-0 px-0 lg:p-4 flex flex-col justify-center gap-2">
            {!selectedDate ? (
              <Text
                tag="p"
                field={fields?.rescheduleTimeslotSelectionMessage}
                className="text-navy-400 text-body font-light text-center"
              />
            ) : (
              timeSlots.map((slot) => {
                const isSelected = selectedSlot === slot.label;
                const isDisabled = slot.disabled;

                return (
                  <Radio
                    key={slot.label}
                    id={`reschedule-slot-${slot.label}`}
                    name="reschedule-collection-time-slot"
                    value={slot.label}
                    label={slot.label}
                    disabled={isDisabled}
                    checked={isSelected}
                    onChange={() => {
                      if (!isDisabled) onSelectSlot(slot.label);
                    }}
                    className={`border border-lilac-400 flex-row-reverse w-full justify-between rounded-lg p-3 md:p-4 text-left transition text-body ${
                      isDisabled
                        ? 'bg-silver-chalice-300 opacity-100 border-0 cursor-not-allowed'
                        : isSelected
                        ? 'bg-lilac-100'
                        : 'hover:bg-lilac-50'
                    }`}
                    inputClassName={`h-4! w-4! ${
                      isDisabled ? 'appearance-none border rounded-full' : ''
                    }`}
                  />
                );
              })
            )}
          </div>
        </div>

        <InfoMessage IconComponent={CircleInfoIcon} status="warning" className="mb-5 md:mb-6">
          <Text
            tag="p"
            field={fields?.rescheduleHolidayBannerText}
            className="text-body font-light text-navy-500"
          />
        </InfoMessage>

        <div className="btn-wrapper flex justify-end">
          <button
            type="button"
            className="btn btn-primary w-full md:w-auto md:min-w-68.75 uppercase"
            onClick={onConfirm}
            disabled={isConfirmDisabled}
          >
            {isSubmitting
              ? fields?.reschedulingCTALabel?.value || 'RESCHEDULING...'
              : ctaField?.value || (isDelivery ? 'RESCHEDULE DELIVERY' : 'RESCHEDULE COLLECTION')}
          </button>
        </div>
      </div>
    </div>
  );
}
