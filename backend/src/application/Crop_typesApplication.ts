import { Crop_types } from "../domain/domain/Crop_types";
import { Crop_typesPort } from "../domain/ports/Crop_typesPort";

export class Crop_typesApplication{
    private port: Crop_typesPort;

    constructor(port: Crop_typesPort){
        this.port = port;
    }

    async createCrop_type(crop_type:Omit<Crop_types,"crop_type_id">):Promise<number>{
        const existingCrop_type = await this.port.getCrop_typeByDescription(crop_type.description)
        if(!existingCrop_type){
            return await this.port.createCrop_type(crop_type);
        }
        throw new Error("El rol ya existe");
    }

    async updatedCrop_type(crop_type_id:number, crop_type:Partial<Crop_types>):Promise<boolean>{
        const existingCrop_type = await this.port.getCrop_typeById(crop_type_id);
        if(!existingCrop_type){
            throw new Error("El tipo de cultivo no existe");
        }

        if(crop_type.description){
            const descriptionTaken = await this.port.getCrop_typeByDescription(crop_type.description);
            if(descriptionTaken && descriptionTaken.crop_type_id !== crop_type_id){
                throw new Error("Error en actualizar la descripcion NO SE PEUDE!")
            }
        }
        return await this.port.updateCrop_type(crop_type_id, crop_type);
    }

    async deleteCrop_type(crop_type_id:number): Promise<boolean>{
        const existingCrop_type = await this.port.getCrop_typeById(crop_type_id);
        if(!existingCrop_type){
            throw new Error("El tipo de cultivo no existe");
        }
        return await this.port.deleteCrop_type(crop_type_id);
    }

    async getCrop_typeById(crop_type_id:number): Promise<Crop_types | null>{
        return await this.port.getCrop_typeById(crop_type_id);
    }

    async getCrop_typeByDescription(description:string): Promise<Crop_types | null>{
        return await this.port.getCrop_typeByDescription(description);
    }

    async getAllCrop_types(): Promise<Crop_types[]>{
        return await this.port.getAllCrop_types();
    }
}