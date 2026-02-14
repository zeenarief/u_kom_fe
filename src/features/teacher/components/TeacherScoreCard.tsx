import type { Student } from '../teacherQueries';
import { AlignLeft } from 'lucide-react';

interface TeacherScoreCardProps {
    index: number;
    student: Student;
    assessmentMaxScore: number;
    score: number | '';
    feedback: string;
    onScoreChange: (studentId: string, value: string) => void;
    onFeedbackChange: (studentId: string, value: string) => void;
}

const TeacherScoreCard = ({
    index,
    student,
    assessmentMaxScore,
    score,
    feedback,
    onScoreChange,
    onFeedbackChange
}: TeacherScoreCardProps) => { // Removed separate ID props since they are in student object or passed directly
    return (
        <>
            {/* Mobile View */}
            <div className="md:hidden bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-3">
                <div className="grid grid-cols-2">
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-medium text-xs">
                                {index + 1}
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900">{student.full_name}</h3>
                                <p className="text-xs text-gray-500">{student.nim || '-'}</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                            Nilai
                        </label>
                        <input
                            type="number"
                            min="0"
                            max={assessmentMaxScore}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                            value={score}
                            onChange={(e) => onScoreChange(student.id, e.target.value)}
                            placeholder="0"
                        />
                    </div>

                </div>


                <div className="space-y-3">

                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                            Catatan
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <AlignLeft size={14} className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-9 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-2 border"
                                value={feedback}
                                onChange={(e) => onFeedbackChange(student.id, e.target.value)}
                                placeholder="Catatan untuk siswa..."
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Desktop View */}
            <div className="hidden md:grid md:grid-cols-12 gap-4 items-center bg-white border-b border-gray-100 p-4 hover:bg-gray-50 transition-colors last:border-0">
                <div className="col-span-1 text-gray-500 text-sm text-center">{index + 1}</div>
                <div className="col-span-2 text-gray-500 text-sm">{student.nim || student.nisn || '-'}</div>
                <div className="col-span-3 font-medium text-gray-900 text-sm">{student.full_name}</div>
                <div className="col-span-2">
                    <input
                        type="number"
                        min="0"
                        max={assessmentMaxScore}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                        value={score}
                        onChange={(e) => onScoreChange(student.id, e.target.value)}
                        placeholder="0"
                    />
                </div>
                <div className="col-span-4">
                    <input
                        type="text"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                        value={feedback}
                        onChange={(e) => onFeedbackChange(student.id, e.target.value)}
                        placeholder="Catatan untuk siswa..."
                    />
                </div>
            </div>
        </>
    );
};

export default TeacherScoreCard;
