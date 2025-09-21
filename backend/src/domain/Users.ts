export interface Users{
    user_id: number;
    role_id: number;
    role_description: string;
    firts_name: string;
    last_name: string;
    document_number: string;
    doc_type_id: number;
    doc_type_description: string;
    photo_url: string;
    email: string;
    password: string;
    status: number;
    created_at: Date;
}