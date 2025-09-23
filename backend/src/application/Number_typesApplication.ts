import { Number_types } from "../domain/entities/Number_types"
import { Number_typesPort } from '../domain/port/Number_typesPort';

export class Number_typesApplication {
    private port: Number_typesPort;

    constructor(port: Number_typesPort) {
        this.port = port;
    }

    async createNumber_type(number_type:Omit<Number_types, "number_type_id">):Promise<number>{
        const existingNumber_type = await this.port.getNumber_typeByDescription(number_type.description)
        if(!existingNumber_type){
            return await this.port.createNumber_type(number_type);
        }
        throw new Error("El tipo de número ya existe");
    }

    async updateNumber_type(number_type_id:number, number_type:Partial<Number_types>):Promise<boolean>{
        const existingNumber_type= await this.port.getNumber_typeById(number_type_id);
        if(!existingNumber_type){
            throw new Error("El tipo de número no existe")
        }

        if(number_type.description){
            const descriptionTaken = await this.port.getNumber_typeByDescription(number_type.description);
            if(descriptionTaken && descriptionTaken.number_type_id !== number_type_id){
                throw new Error("Error en actualizar la descripcion NO SE PUEDE!")
            }
        }
        return await this.port.updateNumber_type(number_type_id,number_type);
    }

    async deleteNumber_type(number_type_id:number): Promise<boolean>{
        const existingNumber_type = await this.port.getNumber_typeById(number_type_id);
        if(!existingNumber_type){
            throw new Error("No se encontró el tipo de nombre");
        }
        return await this.port.deleteNumber_type(number_type_id);

    }

    async getNumber_typeById(number_type_id:number): Promise<Number_types | null>{
        return await this.port.getNumber_typeById(number_type_id);

    }

    async getNumber_typeByDescription(description:string): Promise<Number_types | null>{
        return await this.port.getNumber_typeByDescription(description);
    }

    async getAllNumber_types(): Promise <Number_types[]>{
        return await this.port.getAllNumber_types();
    }
    
}