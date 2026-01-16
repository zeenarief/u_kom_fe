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

// === ENTITY TYPES ===

export interface Role {
    id: string;
    name: string;
    description?: string;
    is_default?: boolean;
}

export interface User {
    id: string;
    username: string;
    name: string;
    email: string;
    roles: Role[];
    permissions?: string[]; // Ada di detail user
}

export interface AuthResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
    user: User;
}

// === REQUEST PAYLOADS ===

export interface LoginRequest {
    login: string;     // Username atau Email
    password: string;
}

export interface RegisterRequest {
    username: string;
    name: string;
    email: string;
    password: string;
}

export interface RefreshTokenRequest {
    refresh_token: string;
}

// === STUDENT TYPES ===

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
    // Tambahkan ini (sesuai JSON response backend Parents []ParentRelationshipResponse)
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

// === PERMISSION & ROLE TYPES ===

export interface Permission {
    id: string;
    name: string;       // contoh: "students.create"
    description?: string;
}

export interface RoleDetail extends Role {
    permissions: Permission[]; // Role detail punya list permission
}

export interface AssignPermissionsRequest {
    permissions: string[]; // Array of permission names (bukan ID)
}

export interface RoleCreateRequest {
    name: string;
    description?: string;
    is_default?: boolean;
    permissions?: string[];
}

export interface RoleUpdateRequest {
    name?: string;
    description?: string;
    is_default?: boolean;
    permissions?: string[];
}

// === PARENT TYPES ===

// === PARENT TYPES ===

export interface Parent {
    id: string;
    full_name: string;
    nik?: string;
    gender?: 'male' | 'female';
    place_of_birth?: string;
    date_of_birth?: string;
    life_status?: 'alive' | 'deceased';
    marital_status?: 'married' | 'divorced' | 'widowed';
    phone_number?: string;
    email?: string;
    education_level?: string;
    occupation?: string;
    income_range?: string;
    address?: string;
    rt?: string;
    rw?: string;
    sub_district?: string;
    district?: string;
    city?: string;
    province?: string;
    postal_code?: string;

    user?: User | null;
}
export interface ParentFormInput {
    full_name: string;
    nik?: string;
    gender?: string;
    place_of_birth?: string;
    date_of_birth?: string;
    life_status?: string;
    marital_status?: string;
    phone_number?: string;
    email?: string;
    education_level?: string;
    occupation?: string;
    income_range?: string;
    address?: string;
    rt?: string;
    rw?: string;
    sub_district?: string;
    district?: string;
    city?: string;
    province?: string;
    postal_code?: string;
}

// Interface untuk Relasi (Persiapan langkah berikutnya)
export interface StudentParentRelation {
    parent_id: string;
    relationship_type: 'FATHER' | 'MOTHER' | 'GUARDIAN';
}

// Tipe relasi
export type RelationshipType = 'FATHER' | 'MOTHER' | 'GUARDIAN';

// Struktur data untuk dikirim ke Backend (SyncParents)
export interface StudentParentSyncRequest {
    parents:Array<{
        parent_id: string;
        relationship_type: string; // 'FATHER', 'MOTHER', etc.
    }>;
}

// Request Payload untuk Set Guardian
export interface SetGuardianRequest {
    guardian_id: string;
    guardian_type: 'parent' | 'guardian';
}

// Backend Anda mengirim field "guardian" di StudentDetailResponse
export interface GuardianInfo {
    id: string;
    full_name: string;
    phone_number: string;
    email: string;
    type: 'parent' | 'guardian';
    relationship: string;
}

// === GUARDIAN TYPES ===
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

// === EMPLOYEE (GURU & STAFF) ===
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
    nip?: string;
    job_title: string;
    nik?: string;
    gender?: string;
    phone_number?: string;
    address?: string;
    date_of_birth?: string;
    join_date?: string;
    employment_status?: string;
}