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
    city?: string;
    // Field detail (opsional di list)
    no_kk?: string;
    nik?: string;
    place_of_birth?: string;
    date_of_birth?: string;
    address?: string;
}

export interface StudentCreateRequest {
    full_name: string;
    nisn?: string;
    nim?: string;
    gender?: 'male' | 'female';
    place_of_birth?: string;
    date_of_birth?: string; // Format YYYY-MM-DD
    address?: string;
    // Field lain bisa ditambahkan nanti
}

export interface LinkUserRequest {
    user_id: string;
}