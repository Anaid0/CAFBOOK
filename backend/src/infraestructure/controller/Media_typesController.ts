import { Media_typesApplication } from "../../application/Media_typesApplication";
import { Media_types } from '../../domain/entities/Media_types';
import {Request, Response} from "express";
import { Validators } from "../config/validations";

export class Media_typesController{
    private app: Media_typesApplication;
    constructor(app: Media_typesApplication){
        this.app = app;
    }

    async registerMedia_type(request: Request, response: Response): Promise <Response>{
        const { description } = request.body;
        try{

            if(!Validators.description(description))
                return response.status(400).json({message: "Descripción inválida"});
        
            const media_type: Omit<Media_types, "media_type_id"> = {description};
            const media_typeId = await this.app.createMedia_type(media_type);

            return response.status(201).json({message:"Media_type creado exitosamente:", media_typeId});
        }catch(error){

            if(error instanceof Error){
                return response.status(500).json({message:"Error en el servidor"});
            }
        }
        return response.status(400).json({message:"Error en la petición"});
    }

    async searchMedia_typeById (request: Request, response: Response): Promise<Response>{
        try{
            const media_typeId = parseInt(request.params.id);
            if(isNaN(media_typeId)) return response.status(400).json({message:"Error en parámetro"});
            const media_type = await this.app.getMedia_typeById (media_typeId);
            if(!media_type) return response.status(404).json({message:"Media_type no encontrado"});

            return response.status(200).json(media_type);
        
        }catch(error){
            if(error instanceof Error){
                return response.status(500).json({message:"Error en el servidor"});
            }
        }
        return response.status(400).json({message:"Error en la petición"});
    }

    async searchMedia_typeByDescription (request: Request, response: Response): Promise<Response>{
        try{
            const {description}= (request.params);
            if(!Validators.description(description))
                return response.status(400).json({ error: "Descripción no válida" });
 
            const media_type = await this.app.getMedia_typeByDescription(description);
            if(!media_type) return response.status(404).json({message:"media_type no encontrado"});

            return response.status(200).json(media_type);
        
        }catch(error){
            if(error instanceof Error){
                return response.status(500).json({message:"Error en el servidor"});
            }
        }
        return response.status(400).json({message:"Error en la petición"});
    }

    async allMedia_types (request: Request, response: Response): Promise<Response>{
        try{
            const media_types = await this.app.getAllMedia_types();
            return response.status(200).json(media_types)
        }catch(error){
            if(error instanceof Error){
                return response.status(500).json({message:"Error en el servidor"});
            }
        }
        return response.status(400).json({message:"Error en la petición"});
    }

    async downMedia_type(request: Request, response: Response): Promise<Response>{
        try{
            const media_typeId = parseInt(request.params.id);
            if(isNaN(media_typeId)) return response.status(400).json({message:"Error en parámetro"});
            const media_type = await this.app.deleteMedia_type(media_typeId);
            if(!media_type) return response.status(404).json({message:"Media_type no encontrado"});

            return response.status(200).json(media_type);
        
        }catch(error){
            if(error instanceof Error){
                return response.status(500).json({message:"Error en el servidor"});
            }
        }
        return response.status(400).json({message:"Error en la petición"});
    }
    
    async updateMedia_type(request: Request, response: Response): Promise<Response>{
        try{
            const media_typeId = parseInt(request.params.id);
            if(isNaN(media_typeId)) return response.status(400).json({message:"Error en parámetro"});
            
            let { description } = request.body;

             
            if (description && !Validators.description(description)) 
                return response.status(400).json({message:"La descripción solo debe contener letras",
            });
 
      
      const updated = await this.app.updateMedia_type(media_typeId,{description});
      if(!updated) return response.status(404).json({message: "Media type no encontrado o sin cambios"});

      return response.status(200).json({message:"Media type actualizado exitosamente"})
 
        }catch(error){
            if(error instanceof Error){
                return response.status(500).json({message:"Error en el servidor"});
            }
        }
        return response.status(400).json({message:"Error en la petición"});
    }
}