'use client';

import * as React from 'react';

interface SearchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  onSearch?: (value: string) => void;
}

export const Search = React.forwardRef<HTMLInputElement, SearchProps>(
  (
    {
      label,
      error,
      disabled,
      className = '',
      value,
      onChange,
      onSearch,
      placeholder = 'Search…',
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && onSearch && !disabled) {
        onSearch(String(value ?? ''));
      }
    };

    const handleIconClick = () => {
      if (onSearch && !disabled) {
        onSearch(String(value ?? ''));
      }
    };

    return (
      <div
        className={`form-group w-full ${error ? 'error' : ''} ${
          disabled ? 'disabled' : ''
        } ${className}`}
      >
        {label && (
          <label htmlFor={inputId} className="form-label">
            {label}
          </label>
        )}

        <div className="search-wrapper relative">
          <input
            ref={ref}
            id={inputId}
            type="text"
            value={value}
            disabled={disabled}
            placeholder={placeholder}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            aria-invalid={!!error}
            className={`search-input ${error ? 'error' : ''}`}
            {...props}
          />

          <button type="button" onClick={handleIconClick} disabled={disabled} aria-label="Search">
            <img src="/assets/svg/search.svg" alt="search-icon" className="search-icon" />
          </button>
        </div>

        {error && <p className="text-error text-body-sm">{error}</p>}
      </div>
    );
  }
);

Search.displayName = 'Search';
