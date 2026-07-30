import React, { forwardRef, InputHTMLAttributes } from 'react';

export interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, hint, className = '', id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="w-full space-y-1.5">
        <label
          htmlFor={inputId}
          className="block text-xs font-mono uppercase tracking-wider text-neutral-400"
        >
          {label}
        </label>
        <div className="relative">
          <input
            id={inputId}
            ref={ref}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none transition-all ${
              error
                ? 'border-red-500/60 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                : 'border-white/10 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
            } ${className}`}
            {...props}
          />
        </div>
        {error ? (
          <p id={`${inputId}-error`} className="text-red-400 text-xs font-medium mt-1 animate-fadeIn flex items-center gap-1">
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </p>
        ) : hint ? (
          <p id={`${inputId}-hint`} className="text-neutral-500 text-xs">
            {hint}
          </p>
        ) : null}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';
