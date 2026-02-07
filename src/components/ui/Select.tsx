interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string
    error?: string
    children: React.ReactNode
}

const Select: React.FC<SelectProps> = ({ label, error, children, ...props }) => {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>

            <select
                {...props}
                className={`w-full px-4 py-2 border rounded-lg bg-white
          ${error ? 'border-red-500' : 'border-gray-300'}
        `}
            >
                {children}
            </select>

            {error && (
                <p className="mt-1 text-xs text-red-500">{error}</p>
            )}
        </div>
    )
}

export default Select
