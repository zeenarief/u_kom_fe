export interface Subject {
    id: string;
    code: string; // Unik, misal: MTK-10
    name: string;
    type: string; // Muatan Nasional, Kejuruan, dll
    description: string;
    created_at: string;
    updated_at: string;
}

export interface SubjectFormInput {
    code: string;
    name: string;
    type: string;
    description: string;
}
