import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, className = '', ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={`
                        w-full px-4 py-2 bg-white border rounded-lg text-gray-900 placeholder-gray-400
                        transition-all duration-200 ease-in-out
                        focus:outline-none focus:ring-2 focus:ring-offset-1
                        disabled:opacity-50 disabled:cursor-not-allowed
                        ${
                            error
                                ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                        }
                        ${className}
                    `}
                    {...props}
                />
                {error && (
                    <p className="mt-1 text-xs text-red-500 animate-pulse">{error}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
export default Input;