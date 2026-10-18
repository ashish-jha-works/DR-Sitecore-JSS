import * as React from 'react';

import VisibilityIcon from 'assets/icons/VisibilityIcon';
import VisibilityOffIcon from 'assets/icons/VisibilityOffIcon';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  helperText?: string;
  error?: React.ReactNode;
  onClear?: () => void;
  containerClassName?: string;
  /** Renders inside the field on the left (e.g. flag, currency code) — single bordered control with the input. */
  showClearButton?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      onClear,
      disabled,
      className,
      containerClassName,
      value,
      placeholder,
      id,
      name,
      type = 'text',
      onChange,
      onBlur,
      onInput,
      defaultValue,
      showClearButton = true,
      startIcon,
      endIcon,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const helperId = `${inputId}-helper`;

    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = React.useState(defaultValue ?? '');

    const currentValue = isControlled ? value ?? '' : internalValue;
    const stringValue = String(currentValue);
    const isFilled = stringValue.length > 0;

    const isPassword = type === 'password';
    const [showPassword, setShowPassword] = React.useState(false);

    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    const showClear = isFilled && !disabled && !isPassword && !props.readOnly && showClearButton;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) {
        setInternalValue(e.target.value);
      }
      onChange?.(e);
    };

    const handleClear = () => {
      const event = {
        target: { value: '' },
      } as React.ChangeEvent<HTMLInputElement>;

      if (!isControlled) {
        setInternalValue('');
      }

      onChange?.(event);
      onClear?.();
    };

    const handleInput = (e: React.InputEvent<HTMLInputElement>) => {
      onInput?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      onBlur?.(e);
    };

    return (
      <div className={`w-full space-y-1 mt-2 ${containerClassName}`}>
        {label && (
          <label htmlFor={inputId} className={`block text-body font-light mb-2`}>
            {label}
          </label>
        )}

        <div
          className={
            startIcon
              ? `relative mb-2 flex h-12 w-full items-center gap-2.5 rounded-xl border px-4 glow focus-within:border-navy-500 data-[filled=true]:border-navy-500 data-[error=true]:border-danger-500 ${
                  disabled
                    ? 'bg-disabled border-disabled text-secondary cursor-not-allowed opacity-70'
                    : 'border-lilac-500 bg-white-pure'
                }`
              : 'relative mb-2'
          }
          data-filled={startIcon && isFilled && !disabled ? 'true' : undefined}
          data-error={startIcon && error ? 'true' : undefined}
        >
          {startIcon && (
            <span className="shrink-0 text-navy-500 [&_svg]:block [&_svg]:shrink-0">
              {startIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            name={name}
            type={inputType}
            value={stringValue}
            disabled={disabled}
            onChange={handleChange}
            onInput={handleInput}
            onBlur={handleBlur}
            placeholder={placeholder}
            aria-invalid={!!error}
            aria-describedby={helperText || error ? helperId : undefined}
            data-filled={!startIcon && isFilled && !disabled ? 'true' : undefined}
            data-error={!startIcon && error ? 'true' : undefined}
            className={[
              startIcon
                ? 'min-w-0 flex-1 cursor-[inherit] border-0 bg-transparent p-0 pe-10 text-body-sm font-normal text-navy-500 outline-none ring-0 focus:ring-0'
                : 'input-base pe-10 text-body-sm font-normal',
              endIcon && 'pe-18',
              !startIcon && disabled && 'input-disabled',
              className,
            ]
              .filter(Boolean)
              .join(' ')}
            {...props}
          />
          {endIcon && (
            <span className="shrink-0 text-navy-500 [&_svg]:block [&_svg]:shrink-0 absolute end-4 top-1/2 -translate-y-1/2">
              {endIcon}
            </span>
          )}

          {/* Clear button (non-password) */}
          {showClear && (
            <button
              type="button"
              aria-label="Clear"
              onClick={handleClear}
              className={`cursor-pointer absolute top-1/2 -translate-y-1/2 ${
                endIcon ? 'end-12' : 'end-4'
              }`}
            >
              <img
                src="/assets/svg/cross.svg"
                alt="clear"
                className="w-3.75 opacity-60 hover:opacity-100"
              />
            </button>
          )}

          {/* Password toggle */}
          {isPassword && (
            <button
              type="button"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              onClick={() => setShowPassword((prev) => !prev)}
              className="link-btn absolute right-4 top-1/2 -translate-y-1/2 text-navy-500 hover:text-lilac-500"
              tabIndex={-1}
            >
              {showPassword ? (
                <VisibilityOffIcon className="size-6" />
              ) : (
                <VisibilityIcon className="size-6" />
              )}
            </button>
          )}
        </div>

        {(error || helperText) && (
          <p
            id={helperId}
            className={`text-body-sm font-light ${error ? 'text-error' : 'text-navy-400'}`}
            role={error ? 'alert' : undefined}
            dangerouslySetInnerHTML={{
              __html: error || helperText || '',
            }}
          />
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
