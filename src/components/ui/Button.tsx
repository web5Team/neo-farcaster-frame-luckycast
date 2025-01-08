interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  isLoading?: boolean
  isDefault?: boolean
}

export function Button({
  children,
  className = '',
  isLoading = false,
  isDefault = false,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`w-full max-w-xs mx-auto block ${
        isDefault
        ? 'text-[#7C65C1] border bg-[#7C65C1] border-[#7C65C1] hover:text-white'
          : 'bg-[#7C65C1] text-white'
      } py-4 px-6 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#7C65C1] hover:bg-[#6952A3] ${className}`}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className={`animate-spin h-5 w-5 border-2 ${isDefault?'border-[#7C65C1]':'border-white'} border-t-transparent rounded-full`} />
        </div>
      ) : (
        children
      )}
    </button>
  )
}
