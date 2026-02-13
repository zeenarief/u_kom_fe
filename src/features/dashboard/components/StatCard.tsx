import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: number;
    icon: LucideIcon;
    colorClass: string;
    bgClass: string;
}

export const StatCard = ({ title, value, icon: Icon, colorClass, bgClass }: StatCardProps) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between hover:shadow-md transition-shadow">
        <div>
            <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</h3>
        </div>
        <div className={`p-3 rounded-lg ${bgClass} ${colorClass}`}>
            <Icon size={24} />
        </div>
    </div>
);
