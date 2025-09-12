import { Timestamp } from "typeorm";

export interface Users{
    user_id: number;
    role_id: number;
    firts_name: string;
    last_name: string;
    document_number: string;
    doc_type_id: number;
    email: string;
    password: string;
    status: number;
    created_at: Timestamp;
}