import { Crop_types } from "../../domain/Crop_types";
import { Repository } from "typeorm";
import { Crop_typesPort } from "../../domain/Crop_typesPort";
import { AppDataSource } from "../config/con_data_bases";
import { Crop_typesEntity } from "../entities/Crop_typesEntity";

export class Crop_typesAdapter implements Crop_typesPort{
    private crop_typeRepository: Repository<Crop_typesEntity>;

    constructor(){
        this.crop_typeRepository= AppDataSource.getRepository(Crop_typesEntity);
    }

    private toDomain(crop_type: Crop_typesEntity): Crop_types{
        return{
            crop_type_id: crop_type.crop_type_id,
            description: crop_type.description
        }
    }

    private toEntity(crop_type: Omit<Crop_types, "crop_type_id">): Crop_typesEntity{
        const crop_typesEntity = new Crop_typesEntity();
        crop_typesEntity.description = crop_type.description;
        return crop_typesEntity;
    }

    async createCrop_type(crop_type: Omit<Crop_types, "crop_type_id">): Promise<number> {
        try{
            const newCrop_type = this.toEntity(crop_type);
            const savedCrop_type = await this.crop_typeRepository.save(newCrop_type);
            return savedCrop_type.crop_type_id;
        }catch(error){
            console.error("Error creating type crop ", error);
            throw new Error("Error creating type crop");
        }
    }

    async updateCrop_type(crop_type_id: number, crop_type: Partial<Crop_types>): Promise<boolean> {
        try{
            const existingCrop_type = await this.crop_typeRepository.findOne({where: {crop_type_id: crop_type_id}});
            if(!existingCrop_type){
                throw new Error("Crop type not found");
            }

            Object.assign( existingCrop_type,{
             description: crop_type.description ?? existingCrop_type.description
            });
            await this.crop_typeRepository.save(existingCrop_type);
            return true;
        }catch(error){
            console.error("Error creating type crop ", error);
            throw new Error("Error creating type crop");
        }
    }

    async deleteCrop_type(crop_type_id: number): Promise<boolean> {
        try{
            const existingCrop_type = await this.crop_typeRepository.findOne({where: {crop_type_id: crop_type_id}});
            if(!existingCrop_type){
                throw new Error("Crop type not found");
            }

            await this.crop_typeRepository.save(existingCrop_type);
            return true;
        }catch(error){
            console.error("Error deleting type crop ", error);
            throw new Error("Error deleting type crop");
        }
    }

    async getAllCrop_types(): Promise<Crop_types[]> {
         try{
            const crop_types = await this.crop_typeRepository.find();
            return crop_types.map(this.toDomain);
        }catch(error){
            console.error("Error feactching type crop ", error);
            throw new Error("Error feactching type crop");
        }
    }

    async getCrop_typeById(crop_type_id: number): Promise<Crop_types | null> {
        try{
            const crop_type = await this.crop_typeRepository.findOne({where:{crop_type_id:crop_type_id}});
            return crop_type ? this.toDomain(crop_type): null
        }catch(error){
            console.error("Error feactching type crop by id", error);
            throw new Error("Error feactching type crop by id");
        }
    }

    async getCrop_typeByDescription(description: string): Promise<Crop_types | null> {
        try{
            const crop_type = await this.crop_typeRepository.findOne({where:{description:description}});
            return crop_type ? this.toDomain(crop_type): null
        }catch(error){
            console.error("Error feactching type crop by description", error);
            throw new Error("Error feactching type crop by description");
        }
    }

}