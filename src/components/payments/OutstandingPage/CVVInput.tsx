import { useState, useRef } from 'react';

interface CVVInputProps {
  cardScheme?: string;
  disabled?: boolean;
  value: string;
  onChange: (cvvValue: string, isValid: boolean) => void;
}

export default function CVVInput({
  cardScheme = 'VISA',
  disabled = false,
  onChange,
}: CVVInputProps) {
  const maxLength = cardScheme === 'AMERICAN_EXPRESS' ? 4 : 3;
  const placeholder = cardScheme === 'AMERICAN_EXPRESS' ? '****' : '***';

  const [mask, setMask] = useState('');
  const [realValue, setRealValue] = useState('');

  const timeoutRef = useRef<number | null>(null);

  const convertMask = () => {
    setMask((prev) => prev.replace(/[0-9]/g, '*'));
  };

  const handleKeyDown = () => {
    convertMask();
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newMask = e.target.value.replace(/[^0-9*]/g, '');

    let newValue = realValue.slice(0, newMask.length);
    const cleanedValue = newMask.replace(/\*/g, '');
    newValue += cleanedValue;

    if (newValue.length > maxLength) {
      newValue = newValue.slice(0, maxLength);
      newMask = newMask.slice(0, maxLength);
    }

    const isValid =
      (cardScheme === 'AMERICAN_EXPRESS' && newValue.length === 4) ||
      (cardScheme !== 'AMERICAN_EXPRESS' && newValue.length === 3);

    setRealValue(newValue);
    setMask(newMask);
    onChange(newValue, isValid);

    timeoutRef.current = window.setTimeout(() => {
      convertMask();
    }, 500);
  };

  return (
    <input
      type="text"
      inputMode="numeric"
      pattern="\d*"
      className="w-27.5!"
      placeholder={placeholder}
      value={mask}
      onKeyDown={handleKeyDown}
      onChange={handleChange}
      disabled={disabled}
      maxLength={maxLength}
      autoComplete="cc-csc"
    />
  );
}
