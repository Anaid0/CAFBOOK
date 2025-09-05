import { Repository } from "typeorm";
import { Crops } from '../../domain/Crops';
import {CropsPort } from "../../domain/CropsPort";
import { CropsEntity } from '../entities/CropsEntity';
import { AppDataSource } from "../config/con_data_bases";


export class CropsAdapter implements CropsPort{
    private cropsRepository: Repository<CropsEntity>;

    constructor(){
        this.cropsRepository = AppDataSource.getRepository(CropsEntity);
    }
    private toDomain(crops:CropsEntity):Crops{
     return{
        crop_id: crops.crop_id_crop,
        user_id: crops.user_id_crop,
        crop_type: crops.crop_type_crop,
        latitude: crops.latitude_crop,
        longitude: crops.longitude_crop
        
     }   
    }

    private toEntity(crops: Omit<Crops, "id">): CropsEntity{
        const cropsEntity = new CropsEntity();
        cropsEntity.user_id_crop = crops.user_id;
        cropsEntity.crop_type_crop = crops.crop_type;
        cropsEntity.latitude_crop = crops.latitude;
        cropsEntity.longitude_crop = crops.longitude;
        
        return cropsEntity;
    }

    async createCrop(crop: Omit<Crops, "id">): Promise<number> {
        try{
            const newCrops = this.toEntity(crop);
            const savedCrops = await this.cropsRepository.save(newCrops);
            return savedCrops.crop_id_crop;
        }catch (error){
            console.error("Error creating Crops ", error);
            throw new Error("Error creating Crops")
        }
    }
    async updateCrop(crop_id: number, Crop: Partial<Crops>): Promise<boolean> {
        try {
            const existingCrops = await this.cropsRepository.findOne({where:{crop_id_crop:crop_id}});
            if(!existingCrops){
                throw new Error("Crops not found");
            }
            //Actualizamos los atributos o priopiedades enviadas
            Object.assign( existingCrops,{
             user_id_crop: Crop.user_id ?? existingCrops.crop_id_crop,
             crop_type_crop: Crop.crop_type ?? existingCrops.crop_type_crop,
             latitude_crop: Crop.latitude ?? existingCrops.latitude_crop,
             longitude_crop: Crop.longitude ?? existingCrops.longitude_crop
             
            });
            await this.cropsRepository.save(existingCrops);
            return true;
        } catch (error) {
            console.error("Error updating crops", error);
            throw new Error("Error updating crops");
            
        }
    }
    async deleteCrop(crop_id: number): Promise<boolean> {
        try {
            const existingCrops = await this.cropsRepository.findOne({where:{crop_id_crop:crop_id}});
            if(!existingCrops){
                throw new Error("Crops not found");
            }
            Object.assign(existingCrops, {
                status_user:0
            });
            await this.cropsRepository.save(existingCrops);
            return true;
        } catch (error) {
            console.error("Error deleting crops", error);
            throw new Error("Error deleting crops")
        }
    }
    async getAllCrops(): Promise<Crops[]> {
        try {
            const crops = await this.cropsRepository.find();
            return crops.map(this.toDomain);
        } catch (error) {
            console.error("Error featching all crops ", error);
            throw new Error("Error featching all crops")
        }
    }
    async getCropById(crop_id: number): Promise<Crops | null> {
        try {
            const crops = await this.cropsRepository.findOne({where:{crop_id_crop:crop_id}});
            return crops ? this.toDomain(crops): null
        } catch (error) {
            console.error("Error featching crops by id ", error);
            throw new Error("Error featching crops by id");
        }
    }
    

}


    

