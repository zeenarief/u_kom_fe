import type { Role } from '../roles/types';

export interface User {
    id: string;
    username: string;
    name: string;
    email: string;
    roles: Role[];
    permissions?: string[]; // Ada di detail user
    created_at?: string;
    updated_at?: string;
    last_login?: string;
}
