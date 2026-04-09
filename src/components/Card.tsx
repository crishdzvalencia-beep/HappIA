import React from 'react';
import { cn } from '../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'soft' | 'outline';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'md', ...props }, ref) => {
    const variants = {
      default: 'bg-surface border border-border-custom shadow-soft',
      soft: 'bg-background-soft border border-transparent',
      outline: 'bg-transparent border-2 border-border-custom',
    };

    const paddings = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    return (
      <div
        ref={ref}
        className={cn('rounded-card transition-all', variants[variant], paddings[padding], className)}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';
