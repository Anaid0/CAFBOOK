import { Crops } from "./domain/Crops";
export interface CropsPort {
    createCrop(crop: Omit<Crops, "crop_id" | "user_email" | "crop_type_description" | "created_at">): Promise<number>;
    updateCrop(crop_id: number, crop: Partial<Crops>): Promise<boolean>;
    deleteCrop(crop_id: number): Promise<boolean>;
    getAllCrops(): Promise<Crops[]>;
    getCropById(crop_id: number): Promise<Crops | null>;
    getCropByCropTypeUserEmail(email: string): Promise<Crops[]>;
    getCropByCropTypeId(crop_type_id: number): Promise<Crops[]>;
    getCropByCropTypeDescription(crop_type_description: string): Promise<Crops[]>;
  }