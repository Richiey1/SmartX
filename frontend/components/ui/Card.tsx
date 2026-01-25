import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'elevated';
}

export const Card: React.FC<CardProps> = ({ 
  className = '', 
  variant = 'default',
  children, 
  ...props 
}) => {
  const baseStyles = 'rounded-xl p-6 transition-all';
  
  const variants = {
    default: 'bg-white dark:bg-neutral-card shadow-sm border border-gray-100 dark:border-gray-800',
    outlined: 'bg-transparent border border-gray-200 dark:border-gray-700',
    elevated: 'bg-white dark:bg-neutral-card shadow-md hover:shadow-lg',
  };

  return (
    <div className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
};
