
export interface ViolationCategory {
    id: string;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
}

export interface ViolationType {
    id: string;
    category_id: string;
    name: string;
    description: string;
    default_points: number;
    category?: ViolationCategory;
    created_at: string;
    updated_at: string;
}

export interface StudentViolation {
    id: string;
    student_id: string;
    violation_type_id: string;
    violation_date: string;
    points: number;
    action_taken: string;
    notes: string;

    // UI Helpers from backend response
    student_name?: string;
    violation_name?: string;

    // Relationships (optional, depending on API expand)
    student?: any; // Define Student type if imported
    violation_type?: ViolationType;

    created_at: string;
    updated_at: string;
}

// Payloads
export interface CreateCategoryPayload {
    name: string;
    description: string;
}

export interface UpdateCategoryPayload {
    name?: string;
    description?: string;
}

export interface CreateTypePayload {
    category_id: string;
    name: string;
    description: string;
    default_points: number;
}

export interface UpdateTypePayload {
    category_id?: string;
    name?: string;
    description?: string;
    default_points?: number;
}

export interface CreateViolationPayload {
    student_id: string;
    violation_type_id: string;
    violation_date: string; // ISO Date string
    points: number; // Can be overridden from type default
    action_taken: string;
    notes: string;
}

export interface UpdateViolationPayload {
    violation_type_id?: string;
    violation_date?: string;
    points?: number;
    action_taken?: string;
    notes?: string;
}
