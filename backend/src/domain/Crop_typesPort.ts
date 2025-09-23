import { Crop_types } from './Crop_types';
export interface Crop_typesPort{
    createCrop_type(crop_type: Omit<Crop_types,"crop_type_id">): Promise<number>;
    updateCrop_type(crop_type_id:number, crop_type:Partial<Crop_types>):Promise<boolean>;
    deleteCrop_type(crop_type_id:number): Promise<boolean>;
    getAllCrop_types(): Promise<Crop_types[]>;
    getCrop_typeById(crop_type_id:number): Promise<Crop_types | null>;
    getCrop_typeByDescription(description:string): Promise <Crop_types | null>; 
}
//