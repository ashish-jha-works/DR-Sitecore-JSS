import { ReactNode } from 'react';
import { Text } from '@sitecore-jss/sitecore-jss-nextjs';
import { Radio } from 'components/common/Radio';

interface MoveOutReasonSectionProps {
  icon?: ReactNode;
  title: any;
  name: string;
  options: { value: string; label: string }[];
  selectedValue: string;
  onSelect: (value: string) => void;
}

export default function MoveOutReasonSection({
  icon,
  title,
  name,
  options,
  selectedValue,
  onSelect,
}: MoveOutReasonSectionProps) {
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div className="flex gap-3 md:gap-4 items-center">
        {icon}
        <Text
          tag="h2"
          field={title}
          className="text-base md:text-heading-3 font-normal text-navy-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {options.map((option, index) => {
          const isSelected = selectedValue === option.value;

          return (
            <Radio
              key={`${name}-${option.value}`}
              id={`${name}-${index}`}
              name={name}
              value={option.value}
              label={option.label}
              checked={isSelected}
              onChange={onSelect}
              className={`w-full border rounded-lg p-3 md:p-4 flex-row-reverse justify-between items-center mb-0 ${
                isSelected ? 'bg-lilac-100 border-lilac-400' : 'bg-white-pure border-lilac-300'
              }`}
              inputClassName="size-4!"
            />
          );
        })}
      </div>
    </div>
  );
}
