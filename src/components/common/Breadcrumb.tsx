import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface BreadcrumbItem {
    label: string;
    href?: string;
    icon?: React.ComponentType<{ size?: number; className?: string }>;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
    className?: string;
}

export default function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
    return (
        <nav className={`flex items-center space-x-1 text-sm ${className}`} aria-label="Breadcrumb">
            {/* Home Icon */}
            <Link
                to="/dashboard"
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded hover:bg-gray-100"
                aria-label="Dashboard"
            >
                <Home size={16} />
            </Link>

            {items.map((item, index) => {
                const isLast = index === items.length - 1;
                const Icon = item.icon;

                return (
                    <div key={index} className="flex items-center">
                        {/* Separator */}
                        <ChevronRight size={14} className="text-gray-300 mx-1" />

                        {/* Breadcrumb Item */}
                        {isLast ? (
                            <span className="flex items-center gap-1.5 text-gray-700 font-medium px-2 py-1">
                                {Icon && <Icon size={14} className="text-gray-500" />}
                                <span className="truncate max-w-[200px]">{item.label}</span>
                            </span>
                        ) : (
                            <Link
                                to={item.href || '#'}
                                className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 transition-colors px-2 py-1 rounded hover:bg-gray-100"
                            >
                                {Icon && <Icon size={14} />}
                                <span className="truncate max-w-[150px]">{item.label}</span>
                            </Link>
                        )}
                    </div>
                );
            })}
        </nav>
    );
}
