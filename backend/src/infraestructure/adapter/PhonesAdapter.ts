import { Repository } from "typeorm";
import { Phones } from '../../domain/Phones';
import { PhonesPort } from "../../domain/PhonesPort";
import { PhonesEntity } from '../entities/PhonesEntity';
import { AppDataSource } from "../config/con_data_bases";


export class PhonesAdapter implements PhonesPort{
    private phoneRepository: Repository<PhonesEntity>;

    constructor(){
        this.phoneRepository = AppDataSource.getRepository(PhonesEntity);
    }
    private toDomain(phone:PhonesEntity):Phones{
     return{
        phone_id: phone.phone_id,
        number_type_id: phone.number_type_id,
        number: phone.number
     }   
    }
    
    private toEntity(phone: Omit<Phones, "phone_id">): PhonesEntity {
        const phonesEntity = new PhonesEntity();
        phonesEntity.number_type_id = phone.number_type_id;
        phonesEntity.number = phone.number
        return phonesEntity;
      }

    async createPhone(phone: Omit<Phones, "phone_id">): Promise<number> {
        try{
            const newPhone = this.toEntity(phone);
            const savedPhone = await this.phoneRepository.save(newPhone);
            return savedPhone.phone_id;
        }catch (error){
            console.error("Error creating phone ", error);
            throw new Error("Error creating phone")
        }
    }
    async updatePhone(phone_id: number, phone: Partial<Phones>): Promise<boolean> {
        try {
            const existingPhone = await this.phoneRepository.findOne({where:{phone_id:phone_id}});
            if(!existingPhone){
                throw new Error("Phone not found");
            }
           
            Object.assign( existingPhone,{
             number_type_id: phone.number_type_id ?? existingPhone.number_type_id
            });
            await this.phoneRepository.save(existingPhone);
            return true;
        } catch (error) {
            console.error("Error updating phone", error);
            throw new Error("Error updating phone");
            
        }
    }
    async deletePhone(phone_id: number): Promise<boolean> {
        try {
            const existingPhone = await this.phoneRepository.findOne({where:{phone_id:phone_id}});
            if(!existingPhone){
                throw new Error("Phone not found");
            }
            await this.phoneRepository.delete(existingPhone);
            return true;
        } catch (error) {
            console.error("Error deleting phone", error);
            throw new Error("Error deleting phone")
        }
    }
    async getAllPhones(): Promise<Phones[]> {
        try {
            const phones = await this.phoneRepository.find();
            return phones.map(this.toDomain);
        } catch (error) {
            console.error("Error featching all phones ", error);
            throw new Error("Error featching all phones")
        }
    }
    async getPhoneById(phone_id: number): Promise<Phones | null> {
        try {
            const phone = await this.phoneRepository.findOne({where:{phone_id:phone_id}});
            return phone ? this.toDomain(phone): null
        } catch (error) {
            console.error("Error featching phone by id ", error);
            throw new Error("Error featching phone by id");
        }
    }
    async getPhoneByNumber_type_id(number_type_id: number): Promise<Phones | null> {
        try {
            const phone = await this.phoneRepository.findOne({where:{number_type_id:number_type_id}});
            return phone ? this.toDomain(phone): null
        } catch (error) {
            console.error("Error featching role by number type id ", error);
            throw new Error("Error featching role by number type");
        }

    }

}