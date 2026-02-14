import { Outlet, useParams, Link } from 'react-router-dom';
import { useTeacherAssignments } from './teacherQueries';
import { ArrowLeft } from 'lucide-react';
import TeacherClassTabs from './components/TeacherClassTabs';

const TeacherClassLayout = () => {
    const { assignmentId } = useParams();
    const { data: assignments, isLoading, isError } = useTeacherAssignments();

    // Find the current assignment details to display in the header
    const currentAssignment = assignments?.find(a => a.id === assignmentId);

    if (isLoading) return <div className="p-6">Loading class details...</div>;
    if (isError) return <div className="p-6 text-red-600">Failed to load class details.</div>;
    if (!assignmentId) return <div className="p-6 text-red-600">Invalid assignment ID.</div>;

    return (
        <div className="space-y-6">
            {/* Shared Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-2">
                    <Link to="/dashboard/classes" className="text-gray-500 hover:text-gray-700">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {currentAssignment?.subject?.name || 'Loading...'}
                        </h1>
                        <p className="text-sm text-gray-500">
                            {currentAssignment?.classroom?.level} - {currentAssignment?.classroom?.major} • {currentAssignment?.classroom?.name}
                        </p>
                    </div>
                </div>
            </div>

            {/* Shared Tabs */}
            <TeacherClassTabs assignmentId={assignmentId} />

            {/* Page Content */}
            <Outlet context={{ currentAssignment }} />
        </div>
    );
};

export default TeacherClassLayout;
