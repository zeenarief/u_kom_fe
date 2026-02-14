export interface TeachingAssignment {
    id: string;
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

export interface AssignmentFormInput {
    classroom_id: string;
    subject_id: string;
    teacher_id: string;
}
