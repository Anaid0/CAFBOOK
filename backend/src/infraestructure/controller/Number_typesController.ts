import { Number_typesApplication } from "../../application/Number_typesApplication";
import { Number_types } from "../../domain/models/Number_types";
import {Request, Response} from "express";
import { Validators } from "../config/validations";

export class Number_typesController{
    private app: Number_typesApplication;
    constructor(app: Number_typesApplication){
        this.app = app;
    }

    async registerNumber_type(request: Request, response: Response): Promise <Response>{
        const { description } = request.body;
        try{

            if(!Validators.description(description))
                return response.status(400).json({message: "descripción inválida"});
        
            const number_type: Omit<Number_types, "number_type_id"> = {description};
            const number_typeId = await this.app.createNumber_type(number_type);

            return response.status(201).json({message:"Tipo de número creado exitosamente:", number_typeId});
        }catch(error){

            if(error instanceof Error){
                return response.status(500).json({message:"Error en el servidor"});
            }
        }
        return response.status(400).json({message:"Error en la petición"});
    }

    async searchNumber_typeById (request: Request, response: Response): Promise<Response>{
        try{
            const number_typeId = parseInt(request.params.id);
            if(isNaN(number_typeId)) return response.status(400).json({message:"Error en parámetro"});
            const number_type = await this.app.getNumber_typeById (number_typeId);
            if(!number_type) return response.status(404).json({message:"Tipo de número no encontrado"});

            return response.status(200).json(number_type);
        
        }catch(error){
            if(error instanceof Error){
                return response.status(500).json({message:"Error en el servidor"});
            }
        }
        return response.status(400).json({message:"Error en la petición"});
    }

    async searchNumber_typeByDescription (request: Request, response: Response): Promise<Response>{
        try{
            const {description}= (request.params);
            if(!Validators.description(description))
                return response.status(400).json({ error: "Descripción no válida" });
 
            const number_type = await this.app.getNumber_typeByDescription(description);
            if(!number_type) return response.status(404).json({message:"Tipo de número no encontrado"});

            return response.status(200).json(number_type);
        
        }catch(error){
            if(error instanceof Error){
                return response.status(500).json({message:"Error en el servidor"});
            }
        }
        return response.status(400).json({message:"Error en la petición"});
    }

    async allNumber_types (request: Request, response: Response): Promise<Response>{
        try{
            const number_types = await this.app.getAllNumber_types();
            return response.status(200).json(number_types)
        }catch(error){
            if(error instanceof Error){
                return response.status(500).json({message:"Error en el servidor"});
            }
        }
        return response.status(400).json({message:"Error en la petición"});
    }

    async downNumber_type(request: Request, response: Response): Promise<Response>{
        try{
            const number_typeId = parseInt(request.params.id);
            if(isNaN(number_typeId)) return response.status(400).json({message:"Error en parámetro"});
            const number_type = await this.app.deleteNumber_type(number_typeId);
            if(!number_type) return response.status(404).json({message:"Tipo de número no encontrado"});

            return response.status(200).json(number_type);
        
        }catch(error){
            if(error instanceof Error){
                return response.status(500).json({message:"Error en el servidor"});
            }
        }
        return response.status(400).json({message:"Error en la petición"});
    }
    
    async updateNumber_type(request: Request, response: Response): Promise<Response>{
        try{
            const number_typeId = parseInt(request.params.id);
            if(isNaN(number_typeId)) return response.status(400).json({message:"Error en parámetro"});
            
            let { description } = request.body;

             
            if (description && !Validators.description(description)) 
                return response.status(400).json({message:"La descripción solo debe contener letras",
            });
 
      
      const updated = await this.app.updateNumber_type(number_typeId,{description});
      if(!updated) return response.status(404).json({message: "Tipo de número no encontrado o sin cambios"});

      return response.status(200).json({message:"Tipo de número actualización exitosamente"})
 
        }catch(error){
            if(error instanceof Error){
                return response.status(500).json({message:"Error en el servidor"});
            }
        }
        return response.status(400).json({message:"Error en la petición"});
    }
}