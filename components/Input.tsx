interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className = '', ...props }: InputProps) {
  return (
    <input
      className={`w-full px-4 py-2 rounded-lg bg-purple-100 bg-opacity-10 
        border border-purple-300 text-white placeholder-purple-200 
        focus:outline-none focus:ring-2 focus:ring-purple-500 
        transition-all duration-200 ${className}`}
      {...props}
    />
  );
}
