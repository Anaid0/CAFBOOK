import { Crop_typesApplication } from "../../application/Crop_typesApplication";
import { Crop_types } from "../../domain/entities/Crop_types";
import { Validators } from "../config/validations";
import {Request, Response} from "express";

export class Crop_typesController{
    private app: Crop_typesApplication;
    constructor(app: Crop_typesApplication){
        this.app = app;
    }
    
    async registerCrop_types(request: Request, response: Response): Promise <Response>{
        const { description } = request.body;
        try{

            if(!Validators.description(description))
                return response.status(400).json({message: "Descripción inválida"});
        
            const crop_type: Omit<Crop_types, "crop_type_id"> = {description};
            const crop_type_id = await this.app.createCrop_type(crop_type);

            return response.status(201).json({message:"Tipo de cultivo creado exitosamente:", crop_type_id});
        }catch(error){

            if(error instanceof Error){
                return response.status(500).json({message:"Error en el servidor"});
            }
        }
        return response.status(400).json({message:"Error en la petición"});
    }

    async searchCrop_typeById(request: Request, response: Response): Promise<Response>{
        try{

           const crop_type_id = parseInt(request.params.id);
            if(isNaN(crop_type_id)) return response.status(400).json({message:"Error en parámetro"});
            const crop_type = await this.app.getCrop_typeById(crop_type_id);
            if(!crop_type) return response.status(404).json({message:"Cultivo no encontrado"});

            return response.status(201).json(crop_type);
        }catch(error){

            if(error instanceof Error){
                return response.status(500).json({message:"Error en el servidor"});
            }
        }
        return response.status(400).json({message:"Error en la petición"});
    }

    async searchCrop_typeByDescription(request: Request, response: Response):Promise<Response>{
        try{

           const {description}= (request.params);
            if(!Validators.description(description))
                return response.status(400).json({ error: "Descripción no válida" });
            const crop_type = await this.app.getCrop_typeByDescription(description);
            if(!crop_type) return response.status(404).json({message:"Cultivo no encontrado"});

            return response.status(201).json(crop_type);
        }catch(error){

            if(error instanceof Error){
                return response.status(500).json({message:"Error en el servidor"});
            }
        }
        return response.status(400).json({message:"Error en la petición"});
    }

    async allCrop_types(request: Request, response: Response): Promise<Response>{
        try{
            const crop_types = await this.app.getAllCrop_types();
            return response.status(200).json(crop_types);
        }catch(error){
            if(error instanceof Error){
                return response.status(500).json({message:"Error en el servidor"});
            }
        }
        return response.status(400).json({message:"Error en la petición"});
    }

    async downCrop_type(request: Request, response: Response): Promise<Response>{
        try{

           const crop_type_id = parseInt(request.params.id);
            if(isNaN(crop_type_id)) return response.status(400).json({message:"Error en parámetro"});
            const crop_type = await this.app.deleteCrop_type(crop_type_id);
            if(!crop_type) return response.status(404).json({message:"Cultivo no encontrado"});

            return response.status(200).json(crop_type);
        }catch(error){

            if(error instanceof Error){
                return response.status(500).json({message:"Error en el servidor"});
            }
        }
        return response.status(400).json({message:"Error en la petición"});
    }

    async updateCrop_type(request: Request, response: Response): Promise<Response>{
        try{

           const crop_type_id = parseInt(request.params.id);
            if(isNaN(crop_type_id)) return response.status(400).json({message:"Error en parámetro"});

            let {description } = request.body;

            if (description && !Validators.description(description)) 
                return response.status(400).json({message:"La descripción solo debe contener letras"
            });

            const updated = await this.app.updatedCrop_type(crop_type_id, {description});
            if(!updated) return response.status(400).json({message:"Cultivo no encontrado o sin cambios"});

            return response.status(200).json({message:"Tipo de vultivo actualizado exitosamente"});
        }catch(error){

            if(error instanceof Error){
                return response.status(500).json({message:"Error en el servidor"});
            }
        }
        return response.status(400).json({message:"Error en la petición"});
    }
}