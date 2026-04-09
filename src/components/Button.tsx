import React from 'react';
import { cn } from '../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', fullWidth = false, ...props }, ref) => {
    const variants = {
      primary: 'bg-brand-primary text-text-primary font-bold shadow-soft hover:opacity-90 active:scale-95',
      secondary: 'bg-surface border border-border-custom text-text-primary font-bold shadow-soft hover:bg-background-soft active:scale-95',
      outline: 'bg-transparent border-2 border-border-custom text-text-primary font-bold hover:bg-background-soft active:scale-95',
      ghost: 'bg-transparent text-text-secondary font-bold hover:text-text-primary hover:bg-background-soft',
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm rounded-chip',
      md: 'px-6 py-3.5 text-base rounded-btn',
      lg: 'px-8 py-4 text-lg rounded-btn',
      xl: 'px-10 py-5 text-xl rounded-container',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center transition-all disabled:opacity-50 disabled:pointer-events-none',
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
