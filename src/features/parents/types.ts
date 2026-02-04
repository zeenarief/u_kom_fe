import type { User } from '../users/types';

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
