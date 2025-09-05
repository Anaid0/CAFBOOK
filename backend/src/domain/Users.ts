import { Timestamp } from "typeorm";

export interface Users{
    user_id: number;
    name: string;
    lastname: string;
    doc_type_id: number;
    doc_number: number;
    address: string;
    phone: string;
    state: string;
    city: string;
    email: string;
    password:string;
    role_id: number;
    create_at: Timestamp;
    status: number;
}