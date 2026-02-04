import type { AcademicYear } from '../academic-years/types';

export interface Classroom {
    id: string;
    name: string;
    level: string;
    major: string;
    description: string;
    academic_year: AcademicYear;

    homeroom_teacher_id?: string;

    homeroom_teacher_name: string;
    total_students: number;
    created_at: string;
}

export interface ClassroomFormInput {
    academic_year_id: string;
    homeroom_teacher_id?: string;
    name: string;
    level: string;
    major: string;
    description: string;
}

// Untuk Detail Kelas + Siswa di dalamnya
export interface StudentInClass {
    id: string;
    full_name: string;
    nisn: string;
    gender: string;
    status_in_class: string;
}

export interface ClassroomDetail extends Classroom {
    students: StudentInClass[];
}

export interface AddStudentsRequest {
    student_ids: string[];
}
