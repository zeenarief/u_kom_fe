export interface AcademicYear {
    id: string;
    name: string;
    status: 'ACTIVE' | 'INACTIVE';
    start_date: string; // Format: "2006-01-02T..." atau "2006-01-02" tergantung response
    end_date: string;
    created_at: string;
    updated_at: string;
}

export interface AcademicYearFormInput {
    name: string;
    start_date: string; // YYYY-MM-DD
    end_date: string;   // YYYY-MM-DD
}
