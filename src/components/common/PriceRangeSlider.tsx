'use client';

import styles from './priceRangeSlider.module.css';

type PriceRangeSliderProps = {
  min: number;
  max: number;
  step: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  className?: string;
  minAriaLabel?: string;
  maxAriaLabel?: string;
};

export function PriceRangeSlider({
  min,
  max,
  step,
  value,
  onChange,
  className = '',
  minAriaLabel = 'Minimum price',
  maxAriaLabel = 'Maximum price',
}: PriceRangeSliderProps) {
  const [minValue, maxValue] = value;
  const total = max - min;
  const minPercent = ((minValue - min) / total) * 100;
  const maxPercent = ((maxValue - min) / total) * 100;

  return (
    <div className={`${styles.root} ${className}`}>
      <div className={styles.track}>
        <div
          className={styles.trackActive}
          style={{
            left: `${minPercent}%`,
            width: `${maxPercent - minPercent}%`,
          }}
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={minValue}
        onChange={(e) => {
          const nextMin = Math.min(Number(e.target.value), maxValue - step);
          onChange([nextMin, maxValue]);
        }}
        className={`${styles.input} ${styles.inputMin}`}
        aria-label={minAriaLabel}
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={maxValue}
        onChange={(e) => {
          const nextMax = Math.max(Number(e.target.value), minValue + step);
          onChange([minValue, nextMax]);
        }}
        className={`${styles.input} ${styles.inputMax}`}
        aria-label={maxAriaLabel}
      />
    </div>
  );
}
