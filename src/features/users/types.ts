

export interface ProfileContext {
    type: string; // 'admin' | 'student' | 'employee' | 'parent'
    entity_id: string;
}

export interface User {
    id: string;
    username: string;
    name: string;
    email: string;
    roles: string[];
    profile_context?: ProfileContext | null; // Tambahkan ini
    permissions?: string[];
    created_at?: string;
    updated_at?: string;
    last_login?: string;
}
