import type { User } from '../features/users/types';

export interface AuthResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
    user: User;
}

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
