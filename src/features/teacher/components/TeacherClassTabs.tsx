import { Link, useLocation } from 'react-router-dom';
import { ClipboardList, FileText, Users } from 'lucide-react';

interface TeacherClassTabsProps {
    assignmentId: string;
}

const TeacherClassTabs = ({ assignmentId }: TeacherClassTabsProps) => {
    const location = useLocation();

    // Helper to determine if a tab is active
    // We check if the pathname includes the tab's path segment to handle sub-pages if any
    const isActive = (path: string) => location.pathname.includes(path);

    const tabs = [
        {
            name: 'Absensi',
            path: `/dashboard/class/${assignmentId}/attendance`,
            icon: ClipboardList,
            activeKeyword: '/attendance'
        },
        {
            name: 'Penilaian',
            path: `/dashboard/class/${assignmentId}/grades`,
            icon: FileText,
            activeKeyword: '/grades'
        },
        // Placeholder for future Students tab
        {
            name: 'Siswa',
            path: `/dashboard/class/${assignmentId}/students`,
            icon: Users,
            activeKeyword: '/students'
        }
    ];

    return (
        <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                {tabs.map((tab) => {
                    // Temporary: Disable 'Siswa' tab if route doesn't exist yet, 
                    // but for now I'll just render the first two based on the implementation plan.
                    if (tab.name === 'Siswa') return null;

                    const active = isActive(tab.activeKeyword);
                    const Icon = tab.icon;

                    return (
                        <Link
                            key={tab.name}
                            to={tab.path}
                            className={`
                                group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm
                                ${active
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }
                            `}
                        >
                            <Icon
                                className={`
                                    -ml-0.5 mr-2 h-5 w-5
                                    ${active ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'}
                                `}
                            />
                            {tab.name}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
};

export default TeacherClassTabs;
