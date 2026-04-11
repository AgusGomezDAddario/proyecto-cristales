import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  children,
  className = '',
  ...props
}) => {
  const baseClasses =
    'flex items-center justify-center font-semibold rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none';

  const variants = {
    /** 🎨 Paleta unificada **/
    primary:
      'bg-[#2596be] hover:bg-[#1862fd] text-white', // <-- colores ajustados
    secondary:
      'bg-gray-200 hover:bg-gray-300 text-gray-800',
    outline:
      'border border-[#2596be] text-[#2596be] hover:bg-[#e6f0ff]',
  };

  const sizes = {
    sm: 'h-10 px-3 text-sm',
    md: 'h-12 px-4',
    lg: 'h-14 px-6 text-lg',
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <button className={classes} {...props}>
      {Icon && <Icon className="w-5 h-5 mr-2" />}
      {children}
    </button>
  );
};
