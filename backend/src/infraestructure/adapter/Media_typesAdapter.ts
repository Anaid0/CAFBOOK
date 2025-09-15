import { Repository } from "typeorm";
import { Media_types } from '../../domain/models/Media_types';
import { Media_typesPort } from "../../domain/ports/Media_typesPort";
import { Media_typesEntity } from '../entities/Media_typesEntity';
import { AppDataSource } from "../config/con_data_bases";


export class Media_typesAdapter implements Media_typesPort{
    private media_typeRepository: Repository<Media_typesEntity>;

    constructor(){
        this.media_typeRepository = AppDataSource.getRepository(Media_typesEntity);
    }
    private toDomain(media_type:Media_typesEntity): Media_types{
     return{
        media_type_id: media_type.media_type_id,
        description: media_type.description,
     }   
    }

    private toEntity(media_type: Omit<Media_types, "media_type_id">): Media_typesEntity{
        const media_typesEntity = new Media_typesEntity();
        media_typesEntity.description = media_type.description;       
        return media_typesEntity;
    }

    async createMedia_type(media_type: Omit<Media_types, "media_type_id">): Promise<number> {
        try{
            const newMedia_type = this.toEntity(media_type);
            const savedMedia_type = await this.media_typeRepository.save(newMedia_type);
            return savedMedia_type.media_type_id;
        }catch (error){
            console.error("Error creating media_type ", error);
            throw new Error("Error creating media_type")
        }
    }
    
    async updateMedia_type(media_type_id: number, media_type: Partial<Media_types>): Promise<boolean> {
        try {
            const existingMedia_type = await this.media_typeRepository.findOne({where:{media_type_id:media_type_id}});
            if(!existingMedia_type){
                throw new Error("Media_type not found");
            }
           
            Object.assign( existingMedia_type,{
             description: media_type.description ?? existingMedia_type.description
            });
            await this.media_typeRepository.save(existingMedia_type);
            return true;
        } catch (error) {
            console.error("Error updating media_type", error);
            throw new Error("Error updating media_type");
            
        }
    }
    async deleteMedia_type(media_type_id: number): Promise<boolean> {
        try {
            const existingMedia_type = await this.media_typeRepository.findOne({where:{media_type_id:media_type_id}});
            if(!existingMedia_type){
                throw new Error("media type not found");
            }
            await this.media_typeRepository.save(existingMedia_type);
            return true;
        } catch (error) {
            console.error("Error deleting media_type", error);
            throw new Error("Error deleting media_type")
        }
    }
    async getAllMedia_types(): Promise<Media_types[]> {
        try {
            const media_types = await this.media_typeRepository.find();
            return media_types.map(this.toDomain);
        } catch (error) {
            console.error("Error featching all media_types ", error);
            throw new Error("Error featching all media_types")
        }
    }
    async getMedia_typeById(media_type_id: number): Promise<Media_types | null> {
        try {
            const media_type = await this.media_typeRepository.findOne({where:{media_type_id:media_type_id}});
            return media_type ? this.toDomain(media_type): null
        } catch (error) {
            console.error("Error featching media type by id ", error);
            throw new Error("Error featching media type by id");
        }
    }
    async getMedia_typeByDescription(description : string): Promise<Media_types | null> {
        try {
            const media_type = await this.media_typeRepository.findOne({where:{description:description}});
            return media_type ? this.toDomain(media_type): null
        } catch (error) {
            console.error("Error featching department by name ", error);
            throw new Error("Error featching department by name");
        }

    }

}