// src/types/api.ts

// === WRAPPER RESPONSE (Standar API) ===
export interface ApiResponse<T> {
    status: string;
    message: string;
    data: T;
}

export interface ApiError {
    status: string;
    message: string;
    error?: {
        message?: string; // SimpleError
        errors?: Array<{ code: string; field: string; message: string }>; // ValidationError
    };
}

export interface DashboardStats {
    total_students: number;
    total_employees: number;
    total_parents: number;
    total_users: number;
    student_gender: {
        male: number;
        female: number;
    };
}