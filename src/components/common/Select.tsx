'use client';

import React, { useEffect, useRef } from 'react';
import type Choices from 'choices.js';

type SelectOption = {
  label: string;
  value: string | number;
};

type SelectProps = {
  id?: string;
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  value?: string | number;
  disabled?: boolean;
  onChange?: any;
  className?: string;
};

export default function Select({
  label,
  placeholder,
  options,
  value,
  disabled,
  onChange,
  className = '',
}: SelectProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const choicesRef = useRef<Choices | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let selectEl: any = document.createElement('select');

    // Build <option> elements
    if (placeholder) {
      const phOption = document.createElement('option');
      phOption.value = '';
      phOption.textContent = placeholder;
      phOption.disabled = true;
      selectEl.appendChild(phOption);
    }

    options.forEach((opt) => {
      const optionEl = document.createElement('option');
      optionEl.value = String(opt.value);
      optionEl.textContent = opt.label;
      selectEl.appendChild(optionEl);
    });

    if (value !== undefined) {
      selectEl.value = String(value);
    }

    selectEl.disabled = !!disabled;
    containerRef.current.appendChild(selectEl);

    // Initialize Choices
    let isMounted = true;
    import('choices.js').then((module) => {
      if (!isMounted) return;
      const ChoicesJS = module.default;
      choicesRef.current = new ChoicesJS(selectEl, {
        searchEnabled: false,
        shouldSort: false,
        itemSelectText: '',
        allowHTML: false,
        duplicateItemsAllowed: false,
      });

      selectEl.addEventListener('change', (e: Event) => {
        const target = e.target as HTMLSelectElement;
        onChange?.(target.value);
      });
    });

    return () => {
      isMounted = false;
      choicesRef.current?.destroy();
      choicesRef.current = null;
      selectEl?.remove();
      selectEl = null;
    };
  }, [options, value, disabled, placeholder, onChange]);

  return (
    <div className={`w-full form-group-field ${className}`}>
      {label && <label className="mb-2 block font-light text-body">{label}</label>}
      <div ref={containerRef} />
    </div>
  );
}
