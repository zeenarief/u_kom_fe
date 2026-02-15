export type DonationType = 'MONEY' | 'GOODS' | 'MIXED';
export type PaymentMethod = 'CASH' | 'TRANSFER' | 'QRIS' | 'GOODS';

export interface DonationItem {
    item_name: string;
    quantity: number;
    unit: string;
    estimated_value: number;
    notes?: string;
}

export interface Donor {
    id: string;
    name: string;
    phone?: string;
    email?: string;
    address?: string;
    created_at?: string;
}

export interface Donation {
    id: string;
    date: string;
    type: DonationType;
    payment_method: PaymentMethod;
    total_amount?: number;
    description?: string;
    proof_file?: string;
    donor: Donor;
    employee: {
        id: string;
        name: string;
    };
    items?: DonationItem[];
    created_at: string;
}

export interface CreateDonationRequest {
    donor_name: string;
    donor_phone?: string;
    donor_email?: string;
    donor_address?: string;
    type: DonationType;
    payment_method: PaymentMethod;
    total_amount?: number;
    description?: string;
    proof_file?: File;
    items_json?: string; // JSON string of DonationItem[]
}

export interface DonationListResponse {
    items: Donation[];
    total: number;
    limit: number;
    offset: number;
}

export interface DonorListResponse {
    items: Donor[];
    total: number;
    limit: number;
    offset: number;
}

export interface UpdateDonationRequest extends Partial<CreateDonationRequest> {
    id: string;
}

export interface UpdateDonorRequest {
    id: string;
    name?: string;
    phone?: string;
    email?: string;
    address?: string;
}
export interface CreateDonorRequest {
    name: string;
    phone?: string;
    email?: string;
    address?: string;
}
