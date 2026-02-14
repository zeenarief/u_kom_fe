export interface Schedule {
    id: string;
    day_of_week: number; // 1-7
    day_name: string;    // "Senin"
    start_time: string;  // "07:00"
    end_time: string;    // "08:30"
    subject_name: string;
    teacher_name: string;
    classroom_name: string;
}

export interface ScheduleFormInput {
    teaching_assignment_id: string;
    day_of_week: number;
    start_time: string;
    end_time: string;
}

export interface AttendanceDetail {
    student_id: string;
    student_name: string;
    nisn: string;
    status: 'PRESENT' | 'SICK' | 'PERMISSION' | 'ABSENT';
    notes: string;
}

export interface AttendanceSession {
    id: string;
    date: string;
    topic: string;
    notes: string;
    schedule_info: Schedule;
    details: AttendanceDetail[];
    summary: { [key: string]: number }; // Contoh: { PRESENT: 20, SICK: 1 }
}

export interface AttendanceSubmitRequest {
    schedule_id: string;
    date: string; // YYYY-MM-DD
    topic: string;
    notes: string;
    students: {
        student_id: string;
        status: string;
        notes: string;
    }[];
}
