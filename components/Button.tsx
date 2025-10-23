import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  icon?: React.ElementType;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', icon: Icon, ...props }) => {
  const baseClasses = "px-4 py-2 rounded-md font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 inline-flex items-center justify-center";
  
  const variantClasses = {
    primary: "bg-[#992537] text-white hover:bg-red-700 focus:ring-red-500",
    secondary: "bg-gray-600 text-gray-200 hover:bg-gray-500 focus:ring-gray-400",
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]}`} {...props}>
      {Icon && <Icon className="w-5 h-5 ml-2" />}
      {children}
    </button>
  );
};

export default Button;