import { Timestamp } from "typeorm";

export interface Companies{
    company_id: number;
    business_name: string;
    doc_type_id: number;
    document_number: number;
    phone: string;
    profession: string;
    years_experience: number;
    email: string;
    password: string;
    role_id: number;
    created_at: Timestamp;
}