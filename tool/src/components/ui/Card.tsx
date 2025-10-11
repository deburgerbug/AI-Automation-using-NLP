import { forwardRef } from "react";
import type { HTMLAttributes } from 'react';
import { cn } from '../../utils/cn'

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800",
                    "rounded-lg shadow-sm",
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

//card sub-components 

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
CardHeader.displayName = 'CardHeader'

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
CardContent.displayName= 'CardContent'

export const CarFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({className, children, ...props}, ref) =>{
        return(
            <div
              ref={ref}
              className={cn( "p-6 border-t border-gray-200 dark:border-gray-800", "bg-gray-50 dark:bg-gray-800/50", className)}
              {...props}
              >
                {children}
              </div>
        );
    }
);