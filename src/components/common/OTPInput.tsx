'use client';

import { useEffect, useRef, useState } from 'react';

interface OtpInputProps {
  length: number;
  error?: boolean;
  onChange?: (otp: string) => void;
  onComplete?: (otp: string) => void;
  resetTrigger?: any;
}

export default function OtpInput({
  length,
  error,
  onChange,
  onComplete,
  resetTrigger,
}: OtpInputProps) {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    setOtp(Array(length).fill(''));
  }, [length, resetTrigger]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    const joined = updatedOtp.join('');
    onChange?.(joined);

    if (value && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }

    if (!updatedOtp.includes('')) {
      onComplete?.(joined);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex justify-center gap-3">
      {otp.map((value, index) => (
        <input
          key={index}
          ref={(el: any) => (inputsRef.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value}
          onChange={(e) => handleChange(e.target.value, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className={`text-6 size-12.5 text-center border-b rounded-lg text-navy-900 focus:outline-none focus:ring-lilac-500 ${
            error ? 'bg-danger-50 border-danger-500' : 'border-lilac-500 bg-white-pure'
          }`}
        />
      ))}
    </div>
  );
}
