import { useTeacherAssignments } from './teacherQueries';
import { BookOpen, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { TeachingAssignment } from './teacherQueries';

const TeacherClassesPage = () => {
    const { data: assignments, isLoading, isError } = useTeacherAssignments();

    if (isLoading) {
        return <div className="p-6">Loading classes...</div>;
    }

    if (isError) {
        return <div className="p-6 text-red-600">Failed to load classes. Please ensure you are logged in as a teacher.</div>;
    }

    if (!assignments || assignments.length === 0) {
        return (
            <div className="p-6 text-center bg-white rounded-xl border border-gray-200 shadow-sm">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">No Classes Assigned</h3>
                <p className="mt-1 text-sm text-gray-500">You haven't been assigned to any classes yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Kelas Ajar Saya</h1>
                    <p className="text-gray-500 text-sm mt-1">Daftar kelas dan mata pelajaran yang Anda ampuh</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assignments.map((assignment: TeachingAssignment) => (
                    <div key={assignment.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                                    <BookOpen size={24} />
                                </div>
                                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                                    {assignment.classroom.level} - {assignment.classroom.major}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-1">{assignment.subject.name + " (" + assignment.subject.code + ")"}</h3>
                            <p className="text-gray-500 text-sm mb-4">{assignment.classroom.name}</p>
                            <div className="flex gap-2">
                                <Link
                                    to={`/dashboard/class/${assignment.id}/grades`}
                                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    Input Nilai
                                    <ArrowRight size={16} />
                                </Link>
                                <Link
                                    to={`/dashboard/class/${assignment.id}/attendance`}
                                    className="flex-1 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                                >
                                    Absensi
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TeacherClassesPage;
