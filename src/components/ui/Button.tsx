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
        ? 'hover:text-white'
        : 'text-white bg-[#DCC1FE]'
      } py-4 px-6 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className={`animate-spin h-5 w-5 ${isDefault?'':'border-white'} border-t-transparent rounded-full`} />
        </div>
      ) : (
        children
      )}
    </button>
  )
}
