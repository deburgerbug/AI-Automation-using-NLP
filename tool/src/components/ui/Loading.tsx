import { cn } from '../../utils/cn';

interface LoadingProps {
    size?: 'sm' | 'md' | 'lg' ;
    text?: string;
    className?: string;
}

export function Loading ({size='md', text, className}: LoadingProps) {
    const sizeClasses = {
        sm: 'w-4 h-4 border-2',
        md: 'w-8 h-8 border-3',
        lg: 'w-12 h-12 border-4'
    };

    return (
        <div className={cn('flex flex-col items-center judtify-center gap-3', className)}>
            <div className={cn('border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin',sizeClasses[size])} />
            {text && (
                <p className='text-sm text-gray-600 dark:text-gray-400 font-medium'>{text}</p>
            )}
        </div>
    );
}

