import type { User } from '../users/types';

export interface Employee {
    id: string;
    full_name: string;
    nip?: string;
    job_title: string;
    nik?: string;
    gender?: string;
    phone_number?: string;
    address?: string;
    date_of_birth?: string;
    join_date?: string;
    employment_status?: string; // PNS, Honorer, Tetap, dll

    // Relasi ke User (Login)
    user?: User | null;
}

export interface EmployeeFormInput {
    full_name: string;
    nip?: string | null;
    job_title: string;
    nik: string;
    gender?: string | null;
    phone_number?: string | null;
    address?: string | null;
    date_of_birth?: string | null;
    join_date?: string | null;
    employment_status?: string | null;
}
