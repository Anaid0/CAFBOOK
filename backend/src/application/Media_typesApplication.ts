import { Media_types } from "../domain/domain/Media_types"
import { Media_typesPort } from '../domain/ports/Media_typesPort';

export class Media_typesApplication {
    private port: Media_typesPort;

    constructor(port: Media_typesPort) {
        this.port = port;
    }

    async createMedia_type(media_type:Omit<Media_types, "media_type_id">):Promise<number>{
        const existingMedia_type = await this.port.getMedia_typeByDescription(media_type.description)
        if(!existingMedia_type){
            return await this.port.createMedia_type(media_type);
        }
        throw new Error("El tipo de media ya existe");
    }

    async updateMedia_type(media_type_id:number, media_type:Partial<Media_types>):Promise<boolean>{
        const existingMedia_type= await this.port.getMedia_typeById(media_type_id);
        if(!existingMedia_type){
            throw new Error("El tipo de media no existe")
        }

        if(media_type.description){
            const descriptionTaken = await this.port.getMedia_typeByDescription(media_type.description);
            if(descriptionTaken && descriptionTaken.media_type_id !== media_type_id){
                throw new Error("Error en actualizar la descripcion NO SE PUEDE!")
            }
        }
        return await this.port.updateMedia_type(media_type_id,media_type);
    }

    async deleteMedia_type(media_type_id:number): Promise<boolean>{
        const existingMedia_type = await this.port.getMedia_typeById(media_type_id);
        if(!existingMedia_type){
            throw new Error("No se encontró tipo de media");
        }
        return await this.port.deleteMedia_type(media_type_id);

    }

    async getMedia_typeById(media_type_id:number): Promise<Media_types | null>{
        return await this.port.getMedia_typeById(media_type_id);

    }

    async getMedia_typeByDescription(description:string): Promise<Media_types | null>{
        return await this.port.getMedia_typeByDescription(description);
    }

    async getAllMedia_types(): Promise <Media_types[]>{
        return await this.port.getAllMedia_types();
    }
    
}