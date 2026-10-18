import * as React from 'react';

interface CheckboxProps {
  id: string;
  name: string;
  value: string;
  checked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
  children?: React.ReactNode;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ id, name, value, checked, disabled, onChange, className = '', children }, ref) => {
    return (
      <>
        <div className="form-group">
          <input
            ref={ref}
            id={id}
            type="checkbox"
            name={name}
            value={value}
            checked={checked}
            disabled={disabled}
            onChange={(e) => onChange?.(e.target.checked)}
          />

          {/* visual checkbox */}
          <label htmlFor={id} className={className} />
        </div>

        {/* content AFTER form-group */}
        {children}
      </>
    );
  }
);

Checkbox.displayName = 'Checkbox';
