import type { User } from '../users/types';

export interface GuardianInfo {
    id: string;
    full_name: string;
    phone_number: string;
    email: string;
    type: 'parent' | 'guardian';
    relationship: string;
}

export interface Guardian {
    id: string;
    full_name: string;
    nik?: string;
    gender?: string;
    phone_number: string;
    email?: string;
    address?: string;
    rt?: string;
    rw?: string;
    sub_district?: string;
    district?: string;
    city?: string;
    province?: string;
    postal_code?: string;
    relationship_to_student?: string; // Khusus Guardian

    user?: User | null; // Untuk Link Account
}

export interface GuardianFormInput {
    full_name: string;
    nik?: string;
    gender?: string;
    phone_number: string;
    email?: string;
    address?: string;
    rt?: string;
    rw?: string;
    sub_district?: string;
    district?: string;
    city?: string;
    province?: string;
    postal_code?: string;
    relationship_to_student?: string;
}
