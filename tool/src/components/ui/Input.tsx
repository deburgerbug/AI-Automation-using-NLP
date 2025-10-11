import type { InputHTMLAttributes } from 'react';
import { forwardRef } from "react";
import {cn} from '../../utils/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    
    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full px-4 py-2 rounded-lg border transition-colors",
            "bg-white dark:bg-gray-900",
            "text-gray-900 dark:text-gray-100",
            "placeholder:text-gray-400 dark:placeholder:text-gray-500",
            "focus:outline-none focus:ring-2 focus:ring-offset-2",
            
            // Default state
            "border-gray-300 dark:border-gray-700",
            "focus:border-blue-500 focus:ring-blue-500",
            
            // Error state
            error && [
              "border-red-500 dark:border-red-500",
              "focus:border-red-500 focus:ring-red-500"
            ],
            
            // Disabled state
            "disabled:opacity-50 disabled:cursor-not-allowed",
            
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';