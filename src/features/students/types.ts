import type { User } from '../users/types';
import type { Parent } from '../parents/types';
import type { GuardianInfo } from '../guardians/types';

export interface Student {
    id: string;
    full_name: string;
    nisn?: string;
    nim?: string;
    gender?: 'male' | 'female';
    no_kk?: string;
    nik?: string;
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

    user?: User;

    parents?: Array<{
        relationship_type: string;
        parent_info: Parent; // Detail orang tuanya
    }>;

    guardian?: GuardianInfo | null;
}

export interface StudentFormInput {
    full_name: string;
    nisn?: string;
    nim?: string;
    gender?: 'male' | 'female';
    place_of_birth?: string;
    date_of_birth?: string;
    address?: string;
    no_kk?: string;
    nik?: string;
    rt?: string;
    rw?: string;
    sub_district?: string;
    district?: string;
    city?: string;
    province?: string;
    postal_code?: string;
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
