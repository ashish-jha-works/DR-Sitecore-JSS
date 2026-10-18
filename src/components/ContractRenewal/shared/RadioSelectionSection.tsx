import { ReactNode } from 'react';
import { Text } from '@sitecore-jss/sitecore-jss-nextjs';
import { Radio } from 'components/common/Radio';

interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface RadioSelectionSectionProps {
  icon: ReactNode;
  title: any;
  name: string;
  options: RadioOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  gridClassName: string;
}

export default function RadioSelectionSection({
  icon,
  title,
  name,
  options,
  selectedValue,
  onSelect,
  gridClassName,
}: RadioSelectionSectionProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-3 md:gap-4 items-center">
        {icon}
        <Text
          tag="h2"
          field={title}
          className="text-base md:text-heading-3 font-normal text-navy-500"
        />
      </div>

      <div className={gridClassName}>
        {options.map((option) => {
          const isSelected = selectedValue === option.value;
          const isDisabled = Boolean(option.disabled);

          return (
            <Radio
              key={option.value}
              id={`${name}-${option.value}`}
              name={name}
              value={option.value}
              label={option.label}
              checked={isSelected}
              disabled={isDisabled}
              onChange={(value) => {
                if (!isDisabled) onSelect(String(value));
              }}
              className={`w-full border rounded-lg p-3 md:p-4 flex-row-reverse justify-between items-center mb-0! ${
                isDisabled
                  ? 'bg-silver-chalice-300 border-silver-chalice-300 opacity-100!'
                  : isSelected
                  ? 'bg-lilac-100 border-lilac-400'
                  : 'bg-white-pure border-lilac-300'
              }`}
              inputClassName="size-4!"
            />
          );
        })}
      </div>
    </div>
  );
}
