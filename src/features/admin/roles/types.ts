export interface Permission {
    id: string;
    name: string;       // contoh: "students.create"
    description?: string;
}

export interface Role {
    id: string;
    name: string;
    description?: string;
    is_default?: boolean;
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
