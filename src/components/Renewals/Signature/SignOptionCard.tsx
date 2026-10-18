import { ReactNode } from 'react';

interface SignOptionCardProps {
  id: string;
  name: string;
  value: string;
  selected: boolean;
  onSelect: (value: string) => void;
  icon: ReactNode;
  title: string;
  description: string;
  footnote?: string;
  iconSize?: 'sign' | 'schedule';
}

export default function SignOptionCard({
  id,
  value,
  selected,
  onSelect,
  icon,
  title,
  description,
  footnote,
  iconSize = 'sign',
}: SignOptionCardProps) {
  const iconClassName =
    iconSize === 'schedule'
      ? '[&_svg]:w-7 [&_svg]:h-9 md:[&_svg]:w-[55px] md:[&_svg]:h-[48px]'
      : '[&_svg]:w-7 [&_svg]:h-9 md:[&_svg]:w-9 md:[&_svg]:h-[55px]';

  const descriptionClassName =
    iconSize === 'schedule'
      ? 'text-[12px] leading-[16px] md:text-[14px] md:leading-[20px] font-light text-navy-500'
      : 'text-[14px] leading-[20px] md:text-[16px] md:leading-[24px] font-normal text-navy-500';

  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-labelledby={`${id}-title`}
      onClick={() => onSelect(value)}
      className={`relative w-full md:w-77.75 md:shrink-0 rounded-xl p-4 md:p-5 flex flex-col text-left transition-default ${
        selected ? 'bg-lilac-100 border border-lilac-400' : 'bg-white-pure border border-lilac-300'
      }`}
    >
      <div
        className="absolute top-4 right-4 md:top-5 md:right-5 flex size-4 items-center justify-center rounded-full border border-solid border-navy-500"
        aria-hidden="true"
      >
        {selected ? <span className="size-2 rounded-full bg-navy-500" /> : null}
      </div>

      <div className={`text-lilac-500 shrink-0 mb-3 md:mb-4 ${iconClassName}`}>{icon}</div>

      <div className="flex flex-col gap-1 md:gap-2">
        <h3
          id={`${id}-title`}
          className="text-[14px] leading-[20px] md:text-[16px] md:leading-[24px] font-medium uppercase tracking-[10%] text-navy-500"
        >
          {title}
        </h3>
        <p className={descriptionClassName}>{description}</p>
        {footnote ? (
          <p className="text-[14px] leading-[20px] md:text-[16px] md:leading-[24px] font-normal text-navy-500/70">
            {footnote}
          </p>
        ) : null}
      </div>
    </button>
  );
}
