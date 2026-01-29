import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'accent' | 'linkedin';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  fullWidth = false,
  className = '',
  ...props
}) => {
  // Base: Bold font, transition, rounded-xl
  const base = "inline-flex items-center justify-center gap-2 font-bold rounded-xl cursor-pointer transition-all uppercase tracking-wider";

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-10 py-4 text-base"
  };

  const variants = {
    // Light: Pop-Yellow, Hard Shadow
    // Dark: Gradient Gold, Glow
    primary: "bg-pop-yellow text-black border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[6px_6px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] dark:bg-gradient-to-r dark:from-nebula-gold dark:to-yellow-600 dark:text-black dark:border-0 dark:shadow-[0_0_20px_#d4a353] dark:hover:scale-105",

    // Light: White bg, Hard Shadow
    // Dark: Glass, Border
    secondary: "bg-white text-black border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:bg-gray-50 active:translate-x-[4px] active:translate-y-[4px] dark:bg-white/10 dark:text-white dark:border dark:border-white/20 dark:shadow-none dark:backdrop-blur-md dark:hover:bg-white/20",

    ghost: "text-zinc-600 hover:text-black hover:bg-gray-200 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-white/5",

    accent: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 border-0",
    linkedin: "bg-linkedin-800 text-white hover:bg-linkedin-700 shadow-lg shadow-linkedin-800/20 border-0"
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {Icon && <Icon className={size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />}
      <span>{children}</span>
    </button>
  );
};

export default Button;