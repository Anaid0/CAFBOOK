import { Crops } from './Crops';
export interface CropsPort{
     createCrop(crop: Omit<Crops,"crop_id">): Promise<number>;
     updateCrop(crop_id:number, crop:Partial<Crops>):Promise<boolean>;
     deleteCrop(crop_id:number): Promise<boolean>;
     getAllCrops(): Promise<Crops[]>;
     getCropById(crop_id:number): Promise<Crops | null>;
     
}