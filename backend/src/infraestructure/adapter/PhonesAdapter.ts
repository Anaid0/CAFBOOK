import { Repository } from "typeorm";
import { Phones } from '../../domain/models/Phones';
import { PhonesPort } from "../../domain/ports/PhonesPort";
import { PhonesEntity } from '../entities/PhonesEntity';
import { Number_typesEntity } from "../entities/Number_typesEntity";
import { AppDataSource } from "../config/con_data_bases";


export class PhonesAdapter implements PhonesPort {
    private phoneRepository: Repository<PhonesEntity>;

    constructor() {
        this.phoneRepository = AppDataSource.getRepository(PhonesEntity);
    }

    private toDomain(phone: PhonesEntity): Phones {
        return {
            phone_id: phone.phone_id,
            number: phone.number,
            number_type_id: phone.number_type_id.number_type_id 
        };
    }

    private toEntity(phone: Omit<Phones, "phone_id">): PhonesEntity {
        const phonesEntity = new PhonesEntity();

        const numberType = new Number_typesEntity();
        numberType.number_type_id = phone.number_type_id;
        phonesEntity.number_type_id = numberType;

        phonesEntity.number = phone.number;
        return phonesEntity;
    }

    async getPhoneByNumber(number: string): Promise<Phones | null> {
        try {
            const phone = await this.phoneRepository.findOne({
                where: { number:number },
                relations: ["number_type_id"]
            });
            return phone ? this.toDomain(phone) : null;
        } catch (error) {
            console.error("Error fetching phone by id ", error);
            throw new Error("Error fetching phone by id");
        }
    }


    async createPhone(phone: Omit<Phones, "phone_id">): Promise<number> {
        try {
            const newPhone = this.toEntity(phone);
            const savedPhone = await this.phoneRepository.save(newPhone);
            return savedPhone.phone_id;
        } catch (error) {
            console.error("Error creating phone ", error);
            throw new Error("Error creating phone");
        }
    }

    async updatePhone(phone_id: number, phone: Partial<Phones>): Promise<boolean> {
        try {
            const existingPhone = await this.phoneRepository.findOne({ where: { phone_id: phone_id } });
            if (!existingPhone) {
                throw new Error("Phone not found");
            }

            if (phone.number_type_id) {
                const numberType = new Number_typesEntity();
                numberType.number_type_id = phone.number_type_id;
                existingPhone.number_type_id = numberType;
            }

            Object.assign(existingPhone, {
                number: phone.number ?? existingPhone.number,
                number_type_id: phone.number_type_id ?? existingPhone.number_type_id,
                                
            });

            // Si se actualiza el número
            if (phone.number) {
                existingPhone.number = phone.number;
            }

            await this.phoneRepository.save(existingPhone);
            return true;
        } catch (error) {
            console.error("Error updating phone", error);
            throw new Error("Error updating phone");
        }
    }

    async deletePhone(phone_id: number): Promise<boolean> {
        try {
            const existingPhone = await this.phoneRepository.findOne({ where: { phone_id: phone_id } });
            if (!existingPhone) {
                throw new Error("Phone not found");
            }
            await this.phoneRepository.delete(existingPhone.phone_id);
            return true;
        } catch (error) {
            console.error("Error deleting phone", error);
            throw new Error("Error deleting phone");
        }
    }

    async getAllPhones(): Promise<Phones[]> {
        try {
            const phones = await this.phoneRepository.find({ relations: ["number_type_id"] }); 
            return phones.map(this.toDomain);
        } catch (error) {
            console.error("Error fetching all phones ", error);
            throw new Error("Error fetching all phones");
        }
    }

    async getPhoneById(phone_id: number): Promise<Phones | null> {
        try {
            const phone = await this.phoneRepository.findOne({
                where: { phone_id: phone_id },
                relations: ["number_type_id"]
            });
            return phone ? this.toDomain(phone) : null;
        } catch (error) {
            console.error("Error fetching phone by id ", error);
            throw new Error("Error fetching phone by id");
        }
    }

    async getPhoneByNumber_type_id(number_type_id: number): Promise<Phones | null> {
        try {
            const phone = await this.phoneRepository.findOne({
                 where: { number_type_id: { number_type_id: number_type_id } }, 
                relations: ["number_type_id"]
            });
            return phone ? this.toDomain(phone) : null;
        } catch (error) {
            console.error("Error fetching phone by number type id ", error);
            throw new Error("Error fetching phone by number type id");
        }
    }
}
