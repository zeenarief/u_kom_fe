import type { User } from '../users/types';
import type { Parent } from '../parents/types';
import type { GuardianInfo } from '../guardians/types';

export interface Student {
    id: string;
    full_name: string;
    no_kk?: string;
    nik?: string;
    nisn?: string;
    nim?: string;
    gender?: 'male' | 'female' | string;
    place_of_birth?: string;
    date_of_birth?: string;
    address?: string;
    rt?: string;
    rw?: string;
    sub_district?: string; // Kelurahan
    district?: string;     // Kecamatan
    city?: string;         // Kota/Kab
    province?: string;
    postal_code?: string;
    status?: string; // 'ACTIVE', 'GRADUATED', 'DROPOUT', 'INACTIVE'
    entry_year?: string;
    graduation_year?: string;
    created_at?: string;
    updated_at?: string;

    // Relations
    user?: User | null;
    parents?: Array<{
        relationship_type: 'FATHER' | 'MOTHER' | string;
        parent_info: Parent;
    }>;
    guardian?: GuardianInfo | null;

    // Legacy fields being phased out or mapped if needed, keeping for safety if UI uses them
    class_name?: string;
    major?: string;
    level?: string;
    email?: string; // specific student email if distinct from user
    phone?: string;
    gpa?: number;
    enrollment_year?: string; // mapped to entry_year
}

export interface StudentFormInput {
    full_name: string;
    no_kk?: string;
    nik?: string;
    nisn?: string;
    nim?: string;
    gender?: string;
    place_of_birth?: string;
    date_of_birth?: string; // YYYY-MM-DD
    address?: string;
    rt?: string;
    rw?: string;
    sub_district?: string;
    district?: string;
    city?: string;
    province?: string;
    postal_code?: string;
    status?: string;
    entry_year?: string;
    graduation_year?: string;
}

export interface LinkUserRequest {
    user_id: string;
}

export interface StudentParentRelation {
    parent_id: string;
    relationship_type: 'FATHER' | 'MOTHER' | 'GUARDIAN';
}

export type RelationshipType = 'FATHER' | 'MOTHER' | 'GUARDIAN';

export interface StudentParentSyncRequest {
    parents: Array<{
        parent_id: string;
        relationship_type: string; // 'FATHER', 'MOTHER', etc.
    }>;
}

export interface SetGuardianRequest {
    guardian_id: string;
    guardian_type: 'parent' | 'guardian';
}
