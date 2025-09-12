import { Phones } from "../domain/Phones"
import { PhonesPort } from '../domain/PhonesPort';

export class PhonesApplication {
    private port: PhonesPort;

    constructor(port: PhonesPort) {
        this.port = port;
    }

    async createPhone(phone:Omit<Phones, "phone_id">):Promise<number>{
        const existingPhone = await this.port.getPhoneById(phone.number)
        if(!existingPhone){
            return await this.port.createPhone(phone);
        }
        throw new Error("El telefono ya existe");
    }

    async updatePhone(phone_id:number, phone:Partial<Phones>):Promise<boolean>{
        const existingPhone= await this.port.getPhoneById(phone_id);
        if(!existingPhone){
            throw new Error("El telefono no existe")
        }

        if(phone.number_type_id){
            const number_type_idTaken = await this.port.getPhoneByNumber_type_id(phone.number_type_id);
            if(number_type_idTaken && number_type_idTaken.phone_id !== phone_id){
                throw new Error("Error en actualizar el tipo de número NO SE PUEDE!")
            }
        }
        return await this.port.updatePhone(phone_id,phone);
    }

    async deletePhone(phone_id:number): Promise<boolean>{
        const existingPhone = await this.port.getPhoneById(phone_id);
        if(!existingPhone){
            throw new Error("No se encontró el teléfono");
        }
        return await this.port.deletePhone(phone_id);

    }

    async getPhoneById(phone_id:number): Promise<Phones | null>{
        return await this.port.getPhoneById(phone_id);

    }

    async getPhoneByNumber_type_id(number_type_id:number): Promise<Phones | null>{
        return await this.port.getPhoneByNumber_type_id(number_type_id);
    }

    async getAllPhones(): Promise <Phones[]>{
        return await this.port.getAllPhones();
    }
    
}