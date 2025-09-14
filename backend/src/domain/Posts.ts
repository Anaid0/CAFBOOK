import { Timestamp } from "typeorm";

export interface Posts{
    post_id: number;
    tittle: string;
    description: string;
    post_category_id: number;
    user_id: number;
    creates_at: Timestamp;
}