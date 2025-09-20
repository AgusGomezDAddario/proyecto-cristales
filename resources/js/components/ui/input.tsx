import React from 'react';
import { LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon;
  error?: boolean;
  label?: string;
}

export const Input: React.FC<InputProps> = ({
  icon: Icon,
  error = false,
  label,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        )}
        <input
          className={`
            w-full h-12 px-4 border rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] 
            focus:border-[var(--color-primary)] transition-colors
            ${Icon ? 'pl-10' : 'pl-4'}
            ${error ? 'border-[var(--color-error)]' : 'border-gray-300'}
            ${className}
          `}
          {...props}
        />
      </div>
    </div>
  );
};