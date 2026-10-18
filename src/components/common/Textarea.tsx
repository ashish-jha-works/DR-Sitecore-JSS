import * as React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  maxLength?: number;
  labelClassName?: string;
  containerClassName?: string;
  /** Grow height as the user types. */
  autoGrow?: boolean;
  minAutoGrowHeight?: number;
}

const mergeRefs = <T,>(...refs: Array<React.Ref<T> | undefined>): React.RefCallback<T> => {
  return (node) => {
    refs.forEach((ref) => {
      if (!ref) return;
      if (typeof ref === 'function') {
        ref(node);
      } else {
        ref.current = node;
      }
    });
  };
};

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      helperText,
      error,
      maxLength = 300,
      disabled,
      className = '',
      labelClassName = '',
      containerClassName = '',
      autoGrow = false,
      minAutoGrowHeight = 48,
      id,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const textareaId = id ?? generatedId;
    const helperId = `${textareaId}-helper`;
    const internalRef = React.useRef<HTMLTextAreaElement>(null);

    const hasHelper = Boolean(helperText || error);

    const adjustHeightFromElement = React.useCallback(
      (el: HTMLTextAreaElement | null) => {
        if (!autoGrow || !el) return;

        el.style.overflowY = 'hidden';

        if (!el.value.length) {
          el.style.height = `${minAutoGrowHeight}px`;
          return;
        }

        el.style.height = '0px';
        el.style.height = `${Math.max(el.scrollHeight, minAutoGrowHeight)}px`;
      },
      [autoGrow, minAutoGrowHeight]
    );

    const adjustHeight = React.useCallback(() => {
      const el = internalRef.current;
      if (!el) return;
      adjustHeightFromElement(el);
    }, [adjustHeightFromElement]);

    React.useLayoutEffect(() => {
      adjustHeight();
    }, [value, adjustHeight]);

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange?.(event);
      adjustHeightFromElement(event.currentTarget);
    };

    return (
      <div className={`w-full space-y-1 ${containerClassName}`}>
        {label && (
          <label
            htmlFor={textareaId}
            data-error={!!error}
            data-disabled={disabled}
            className={`block text-body font-light mb-2 ${labelClassName} ${
              disabled ? 'text-muted' : ''
            }`}
          >
            {label}
          </label>
        )}

        <textarea
          ref={mergeRefs(internalRef, ref)}
          id={textareaId}
          disabled={disabled}
          maxLength={maxLength}
          value={value}
          onChange={handleChange}
          className={`
            box-border resize-none overflow-hidden
            ${autoGrow ? 'min-h-12' : ''}
            ${error ? 'error' : ''}
            ${className}
          `}
          style={autoGrow ? { minHeight: minAutoGrowHeight } : undefined}
          {...props}
        />
        {hasHelper ? (
          <p id={helperId} className={`text-body-sm ${error ? 'text-error' : 'text-navy-400'}`}>
            {error || helperText}
          </p>
        ) : (
          <p className="text-body-sm text-navy-400 text-right font-light">
            Max. {maxLength} characters
          </p>
        )}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';
