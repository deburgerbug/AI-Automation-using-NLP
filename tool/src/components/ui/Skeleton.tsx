import { cn } from '../../utils/cn';

interface SkeletonProps {
    className?: string;
    count?: number;
}

export function Skeleton ({className, count = 1}: SkeletonProps) {
    return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'animate-pulse bg-gray-200 dark:bg-gray-800 rounded',
            className
          )}
          style={{ animationDelay: `${i * 0.05}s` }}
        />
      ))}
    </>
  );
}
