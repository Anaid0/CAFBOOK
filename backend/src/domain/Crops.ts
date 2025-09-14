import { Timestamp } from "typeorm";

export interface Crops{
    crop_id: number;
    user_id: number;
    crop_type_id: number;
    latitude: number;
    longitude: number;
    created_at: Timestamp;
}