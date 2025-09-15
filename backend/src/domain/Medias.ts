import { Timestamp } from "typeorm";

export interface Medias{
    media_id: number;
    post_id: number;
    media_type_id: number;
    file_url: string;
    uploaded_at: Timestamp;
}