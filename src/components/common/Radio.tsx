import * as React from 'react';

interface RadioProps {
  id: string;
  name: string;
  value: string | number;
  label?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  onChange?: (value: string | number) => void;
  className?: string;
  version?: string;
  inputClassName?: string;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      id,
      name,
      value,
      label,
      checked,
      defaultChecked,
      disabled,
      onChange,
      className = '',
      version = 1,
      inputClassName = '',
    },
    ref
  ) => {
    return (
      <>
        {version == 1 ? (
          <label
            htmlFor={id}
            className={`flex items-center gap-2 cursor-pointer w-fit select-none mb-2 ${
              disabled ? 'bg-silver-chalice-300! border-0 opacity-100 cursor-not-allowed!' : ''
            } ${className}`}
          >
            <input
              ref={ref}
              id={id}
              type="radio"
              name={name}
              value={value}
              checked={checked}
              defaultChecked={defaultChecked}
              disabled={disabled}
              onChange={() => onChange?.(value)}
              className={`peer h-6 w-6 cursor-pointer accent-navy-500 ${inputClassName}`}
            />

            <span className="text-body font-light text-gray-800">{label}</span>
          </label>
        ) : (
          <>
            <input
              className={`${className} hidden`}
              type="radio"
              value={value}
              name={name}
              id={id}
              checked={checked}
              onChange={() => onChange?.(value)}
            />
            <label
              className={`block size-4 rounded-lg border border-solid ${
                className == 'dark' ? 'border-white-pure' : 'border-navy-500'
              } relative cursor-pointer before:content-[""] before:size-2.25 before:rounded-lg before:absolute before:top-1/2 before:start-1/2 before:-translate-1/2 before:transition-default ${
                className == 'dark' ? 'before:bg-white-pure' : 'before:bg-navy-500'
              } ${checked ? '' : 'before:opacity-0 before:invisible'}`}
              htmlFor={id}
              onClick={() => onChange?.(value)}
            ></label>
          </>
        )}
      </>
    );
  }
);

Radio.displayName = 'Radio';
