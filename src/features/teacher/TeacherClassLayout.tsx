import { useState } from 'react';
import { Outlet, useParams, useLocation, Link } from 'react-router-dom';
import { useTeacherAssignments } from './teacherQueries';
import { BookOpen, Plus } from 'lucide-react';
import Breadcrumb from '../../components/common/Breadcrumb';
import TeacherClassTabs from './components/TeacherClassTabs';
import CreateAssessmentModal from './components/CreateAssessmentModal';

const TeacherClassLayout = () => {
    const { assignmentId } = useParams();
    const { data: assignments, isLoading, isError } = useTeacherAssignments();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Determine current section for breadcrumb
    const location = useLocation();
    const isAttendance = location.pathname.includes('/attendance');
    const isGrades = location.pathname.includes('/grades');

    const breadcrumbLabel = isAttendance ? 'Absensi' : isGrades ? 'Penilaian' : '';

    // Find the current assignment details to display in the header
    const currentAssignment = assignments?.find(a => a.id === assignmentId);

    if (isLoading) return <div className="p-6">Loading class details...</div>;
    if (isError) return <div className="p-6 text-red-600">Failed to load class details.</div>;
    if (!assignmentId) return <div className="p-6 text-red-600">Invalid assignment ID.</div>;

    const renderActionButton = () => {
        if (isAttendance) {
            return (
                <Link to={`/dashboard/class/${assignmentId}/attendance/input`}>
                    <button className="hidden sm:flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                        <Plus size={16} />
                        Input Kehadiran
                    </button>
                    {/* Mobile FAB */}
                    <button className="sm:hidden fixed bottom-20 right-6 h-14 w-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-colors z-50">
                        <Plus size={24} />
                    </button>
                </Link>
            );
        }

        if (isGrades) {
            return (
                <>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="hidden sm:flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                        <Plus size={16} />
                        Buat Penilaian Baru
                    </button>
                    {/* Mobile FAB */}
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="sm:hidden fixed bottom-20 right-6 h-14 w-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-colors z-50"
                    >
                        <Plus size={24} />
                    </button>
                </>
            );
        }

        return null;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4">
                <Breadcrumb
                    items={[
                        { label: 'Kelas Ajar', href: '/dashboard/classes', icon: BookOpen },
                        { label: currentAssignment?.classroom?.name || '...', href: '#' },
                        ...(breadcrumbLabel ? [{ label: breadcrumbLabel }] : [])
                    ]}
                />

                <div className="flex justify-between items-start sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Mata Pelajaran: {currentAssignment?.subject?.name || 'Loading...'}
                        </h1>
                        <p className="text-sm text-gray-500">
                            {currentAssignment?.classroom?.level} - {currentAssignment?.classroom?.major} • {currentAssignment?.classroom?.name}
                        </p>
                    </div>
                    {renderActionButton()}
                </div>
            </div>

            {/* Shared Tabs */}
            <TeacherClassTabs assignmentId={assignmentId} />

            {/* Page Content */}
            <Outlet context={{ currentAssignment }} />

            {/* Modals */}
            {assignmentId && (
                <CreateAssessmentModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    teachingAssignmentId={assignmentId}
                />
            )}
        </div>
    );
};

export default TeacherClassLayout;
