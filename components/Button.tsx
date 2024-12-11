interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  children: React.ReactNode;
}

export function Button({ 
  variant = 'primary', 
  children, 
  className = '', 
  ...props 
}: ButtonProps) {
  const baseStyles = 'px-4 py-2 rounded-lg font-medium transition-all duration-200';
  
  const variants = {
    primary: 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:opacity-90',
    secondary: 'bg-purple-100 bg-opacity-10 text-white hover:bg-opacity-20',
    outline: 'border border-purple-300 text-white hover:bg-purple-100 hover:bg-opacity-10'
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
