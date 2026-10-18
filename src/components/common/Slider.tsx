'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Keyboard } from 'swiper/modules';
import 'swiper/css';

import React from 'react';

interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

export function Slider({ min = 0, max = 100, step = 1, value, onChange }: SliderProps) {
  const [minValue, maxValue] = value;

  const total = max - min;

  const minIndex = Math.round(((minValue - min) / total) * 100);
  const maxIndex = Math.round(((maxValue - min) / total) * 100);

  return (
    <div className="slider-container">
      <div className="slider-track">
        <div
          className="slider-track-active"
          style={{
            left: `${minIndex}%`,
            width: `${maxIndex - minIndex}%`,
          }}
        />
      </div>

      <Swiper
        modules={[Keyboard]}
        slidesPerView={1}
        keyboard
        allowTouchMove
        className="slider-swiper"
      >
        <SwiperSlide>
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={minValue}
            onChange={(e) => onChange([Number(e.target.value), maxValue])}
            className="slider-handle slider-handle-min"
          />
        </SwiperSlide>

        <SwiperSlide>
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={maxValue}
            onChange={(e) => onChange([minValue, Number(e.target.value)])}
            className="slider-handle slider-handle-max"
          />
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
