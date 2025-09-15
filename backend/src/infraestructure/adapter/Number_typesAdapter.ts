import { Repository } from "typeorm";
import { Number_types } from '../../domain/models/Number_types';
import { Number_typesPort } from "../../domain/ports/Number_typesPort";
import { Number_typesEntity } from '../entities/Number_typesEntity';
import { AppDataSource } from "../config/con_data_bases";


export class  Number_typesAdapter implements  Number_typesPort{
    private number_typeRepository: Repository< Number_typesEntity>;

    constructor(){
        this.number_typeRepository = AppDataSource.getRepository( Number_typesEntity);
    }
    private toDomain(number_type: Number_typesEntity): Number_types{
     return{
        number_type_id: number_type.number_type_id,
        description: number_type.description,
     }   
    }

    private toEntity(number_type: Omit<Number_types, "number_type_id">): Number_typesEntity{
        const number_typesEntity = new Number_typesEntity();
        number_typesEntity.description = number_type.description;       
        return number_typesEntity;
    }

    async createNumber_type(number_type: Omit<Number_types, "number_type_id">): Promise<number> {
        try{
            const newNumber_type = this.toEntity(number_type);
            const savedNumber_type = await this.number_typeRepository.save(newNumber_type);
            return savedNumber_type.number_type_id;
        }catch (error){
            console.error("Error creating Number_type ", error);
            throw new Error("Error creating Number_type")
        }
    }
    async updateNumber_type(number_type_id: number, number_type: Partial<Number_types>): Promise<boolean> {
        try {
            const existingNumber_type = await this.number_typeRepository.findOne({where:{number_type_id:number_type_id}});
            if(!existingNumber_type){
                throw new Error("Number_type not found");
            }
           
            Object.assign( existingNumber_type,{
             description: number_type.description ?? existingNumber_type.description
            });
            await this.number_typeRepository.save(existingNumber_type);
            return true;
        } catch (error) {
            console.error("Error updating number_type", error);
            throw new Error("Error updating number_type");
            
        }
    }
    async deleteNumber_type(number_type_id: number): Promise<boolean> {
        try {
            const existingNumber_type = await this.number_typeRepository.findOne({where:{number_type_id:number_type_id}});
            if(!existingNumber_type){
                throw new Error("Number_type not found");
            }
            await this.number_typeRepository.save(existingNumber_type);
            return true;
        } catch (error) {
            console.error("Error deleting number_type", error);
            throw new Error("Error deleting number_type")
        }
    }
    async getAllNumber_types(): Promise<Number_types[]> {
        try {
            const number_types = await this.number_typeRepository.find();
            return number_types.map(this.toDomain);
        } catch (error) {
            console.error("Error featching all number_types ", error);
            throw new Error("Error featching all number_types")
        }
    }
    async getNumber_typeById(number_type_id: number): Promise<Number_types | null> {
        try {
            const number_type = await this.number_typeRepository.findOne({where:{number_type_id:number_type_id}});
            return number_type ? this.toDomain(number_type): null
        } catch (error) {
            console.error("Error featching department by id ", error);
            throw new Error("Error featching department by id");
        }
    }
    async getNumber_typeByDescription(description: string): Promise<Number_types | null> {
        try {
            const number_type = await this.number_typeRepository.findOne({where:{description:description}});
            return number_type ? this.toDomain(number_type): null
        } catch (error) {
            console.error("Error featching department by name ", error);
            throw new Error("Error featching department by name");
        }

    }

}