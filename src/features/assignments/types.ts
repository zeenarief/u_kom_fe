export interface TeachingAssignment {
    id: string;
    classroom_name: string;
    subject_name: string;
    teacher_name: string;
    teacher_nip: string;
}

export interface AssignmentFormInput {
    classroom_id: string;
    subject_id: string;
    teacher_id: string;
}
