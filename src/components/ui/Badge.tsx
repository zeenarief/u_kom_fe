import { type ReactNode } from 'react';

type BadgeColor = 'green' | 'blue' | 'red' | 'yellow' | 'gray' | 'indigo' | 'purple' | 'pink';

interface BadgeProps {
    children: ReactNode;
    color?: BadgeColor | string; // Allow string for flexibility but suggest types
    className?: string;
}

export default function Badge({ children, color = 'gray', className = '' }: BadgeProps) {

    // Map colors to Tailwind classes
    const colorClasses: Record<string, string> = {
        green: 'bg-green-100 text-green-800 border-green-200',
        blue: 'bg-blue-100 text-blue-800 border-blue-200',
        red: 'bg-red-100 text-red-800 border-red-200',
        yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        amber: 'bg-amber-100 text-amber-800 border-amber-200',
        gray: 'bg-gray-100 text-gray-800 border-gray-200',
        indigo: 'bg-indigo-100 text-indigo-800 border-indigo-200',
        purple: 'bg-purple-100 text-purple-800 border-purple-200',
        pink: 'bg-pink-100 text-pink-800 border-pink-200',
    };

    // Default to gray if color not found, but try to handle custom colors if passed as class names (though limited)
    // Here we assume color prop is one of the keys. If not, fallback to gray or specific logic.
    // Enhanced flexibility: check if color starts with 'bg-' (custom class) or is a key

    let appliedClass = colorClasses[color] || colorClasses['gray'];

    // Handle dynamic color mapping if needed, but for now simple mapping is safest.

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${appliedClass} ${className}`}>
            {children}
        </span>
    );
}
