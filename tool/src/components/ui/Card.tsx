import { forwardRef } from "react";
import type { HTMLAttributes } from 'react';
import { cn } from '../../utils/cn'

interface CardProps extends HTMLAttributes<HTMLDivElement>{
    variant?: 'default' | 'outlined' | 'elevated';
}


export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg",
          "bg-[rgb(var(--color-background))]", // Using CSS variable
          "border border-[rgb(var(--color-border))]",
          // Variant styles
          {
            "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm": 
              variant === 'default',
            "bg-transparent border-2 border-gray-300 dark:border-gray-700": 
              variant === 'outlined',
            "bg-white dark:bg-gray-900 shadow-lg border-0": 
              variant === 'elevated',
          },
          
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// CardHeader - no custom props needed
export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("p-6 border-b border-gray-200 dark:border-gray-800", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

// CardContent - no custom props needed
export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("p-6", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardContent.displayName = 'CardContent';

// CardFooter - no custom props needed
export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "p-6 border-t border-gray-200 dark:border-gray-800",
          "bg-gray-50 dark:bg-gray-800/50",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';