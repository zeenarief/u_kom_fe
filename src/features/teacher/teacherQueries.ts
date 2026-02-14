import { useQuery, useMutation } from '@tanstack/react-query';
import axiosInstance from '../../lib/axios';
import { useAuthStore } from '../../store/authStore';

// --- Teaching Assignments ---

export interface TeachingAssignment {
    id: string;
    classroom_id: string;
    subject_id: string;
    teacher_id: string;
    classroom: {
        id: string;
        name: string;
        level: string;
        major: string;
    };
    subject: {
        id: string;
        name: string;
        code: string;
    };
    teacher: {
        id: string;
        nip: string;
        user: {
            name: string;
        }
    };
}

export const useTeacherAssignments = () => {
    const { user } = useAuthStore();
    const teacherId = user?.profile_context?.entity_id;

    return useQuery({
        queryKey: ['teacher-assignments', teacherId],
        queryFn: async () => {
            if (!teacherId) throw new Error("Teacher ID not found");
            const { data } = await axiosInstance.get<{ data: TeachingAssignment[] }>(`/assignments/by-teacher`, {
                params: { teacher_id: teacherId }
            });
            return data.data;
        },
        enabled: !!teacherId,
    });
};

// --- Assessments ---

export interface Assessment {
    id: string;
    teaching_assignment_id: string;
    title: string;
    type: string; // ASSIGNMENT, MID_EXAM, FINAL_EXAM, QUIZ
    max_score: number;
    date: string;
    description: string;
    teaching_assignment?: TeachingAssignment;
    scores?: StudentScore[];
}

export interface StudentScore {
    id: string;
    assessment_id: string;
    student_id: string;
    score: number;
    feedback: string;
}

export const useTeacherAssessments = (teachingAssignmentId: string | undefined) => {
    return useQuery({
        queryKey: ['assessments', teachingAssignmentId],
        queryFn: async () => {
            if (!teachingAssignmentId) throw new Error("Teaching Assignment ID required");
            const { data } = await axiosInstance.get<{ data: Assessment[] }>(`/grades/assessments/teaching-assignment/${teachingAssignmentId}`);
            return data.data;
        },
        enabled: !!teachingAssignmentId,
    });
};

export const useAssessmentDetail = (assessmentId: string | undefined) => {
    return useQuery({
        queryKey: ['assessment', assessmentId],
        queryFn: async () => {
            if (!assessmentId) throw new Error("Assessment ID required");
            const { data } = await axiosInstance.get<{ data: Assessment }>(`/grades/assessments/${assessmentId}`);
            return data.data;
        },
        enabled: !!assessmentId,
    });
};

export interface CreateAssessmentRequest {
    teaching_assignment_id: string;
    title: string;
    type: string;
    max_score: number;
    date: string;
    description: string;
}

export const useCreateAssessment = () => {
    return useMutation({
        mutationFn: async (data: CreateAssessmentRequest) => {
            const response = await axiosInstance.post('/grades/assessments', data);
            return response.data;
        },
    });
};

export const useUpdateAssessment = () => {
    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: CreateAssessmentRequest }) => {
            const response = await axiosInstance.put(`/grades/assessments/${id}`, data);
            return response.data;
        },
    });
};

// --- Scores ---

export interface BulkScoreRequest {
    assessment_id: string;
    scores: {
        student_id: string;
        score: number;
        feedback?: string;
    }[];
}

export const useSubmitScores = () => {
    return useMutation({
        mutationFn: async (data: BulkScoreRequest) => {
            const response = await axiosInstance.post('/grades/scores/bulk', data);
            return response.data;
        },
    });
};

// --- Students ---

export interface Student {
    id: string;
    nisn: string | null; // API returns string or null
    nim: string | null;  // API returns string or null
    full_name: string;
}

export const useClassroomStudents = (classroomId: string | undefined) => {
    return useQuery({
        queryKey: ['classroom-students', classroomId],
        queryFn: async () => {
            if (!classroomId) throw new Error("Classroom ID required");
            // Assuming this endpoint exists or similar
            const { data } = await axiosInstance.get<{ data: Student[] }>(`/students`, {
                params: { classroom_id: classroomId, limit: 100 }
            });
            return data.data;
        },
        enabled: !!classroomId,
    });
};

// --- Attendance ---

export interface Schedule {
    id: string;
    day_of_week: number;
    day_name: string;
    start_time: string;
    end_time: string;
    subject_name: string;
    classroom_name: string;
    teacher_name: string;
}

export interface AttendanceHistory {
    id: string;
    date: string;
    schedule_id: string; // Added
    topic: string;
    subject_name: string;
    classroom_name: string;
    count_absent: number;
}

export interface AttendanceDetail {
    student_id: string;
    student_name: string;
    nisn: string;
    status: string; // PRESENT, SICK, PERMISSION, ABSENT
    notes: string;
}

export interface AttendanceSessionDetail {
    id: string; // Empty string if new session
    date: string;
    topic: string;
    schedule_info: Schedule;
    details: AttendanceDetail[];
    summary: Record<string, number>;
}

export interface SubmitAttendanceRequest {
    schedule_id: string;
    date: string;
    topic: string;
    notes: string;
    students: {
        student_id: string;
        status: string;
        notes: string;
    }[];
}

export const useTeachingAssignmentSchedules = (assignmentId: string | undefined) => {
    return useQuery({
        queryKey: ['schedules', 'assignment', assignmentId],
        queryFn: async () => {
            if (!assignmentId) throw new Error("Assignment ID required");
            const { data } = await axiosInstance.get<{ data: Schedule[] }>(`/schedules/teaching-assignment/${assignmentId}`);
            return data.data;
        },
        enabled: !!assignmentId,
    });
};

export const useAttendanceHistory = (assignmentId: string | undefined) => {
    return useQuery({
        queryKey: ['attendance-history', assignmentId],
        queryFn: async () => {
            if (!assignmentId) throw new Error("Assignment ID required");
            const { data } = await axiosInstance.get<{ data: AttendanceHistory[] }>(`/attendances/history/teaching-assignment/${assignmentId}`);
            return data.data;
        },
        enabled: !!assignmentId,
    });
};

export const useCheckSession = (scheduleId: string | undefined, date: string | undefined) => {
    return useQuery({
        queryKey: ['attendance-session', scheduleId, date],
        queryFn: async () => {
            if (!scheduleId || !date) throw new Error("Schedule ID and Date required");
            const { data } = await axiosInstance.get<{ data: AttendanceSessionDetail }>(`/attendances/check`, {
                params: { schedule_id: scheduleId, date }
            });
            return data.data;
        },
        enabled: !!scheduleId && !!date,
    });
};

export const useSubmitAttendance = () => {
    return useMutation({
        mutationFn: async (data: SubmitAttendanceRequest) => {
            const response = await axiosInstance.post('/attendances', data);
            return response.data;
        },
    });
};
