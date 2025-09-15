import { PhonesApplication } from "../../application/PhonesApplication";
import { Phones } from "../../domain/Phones";
import {Request, Response} from "express";
import { Validators } from "../config/validations";
import { number } from 'joi';

export class PhonesController{
    private app: PhonesApplication;
    constructor(app: PhonesApplication){
        this.app = app;
    }

    async registerPhone(request: Request, response: Response): Promise <Response>{
        const { number_type_id, number} = request.body;
        try{
        
            const phone: Omit<Phones, "phone_id"> = {number_type_id, number};
            const phoneId = await this.app.createPhone(phone);

            return response.status(201).json({message:"Teléfono creado exitosamente:", phoneId});
        }catch(error){

            if(error instanceof Error){
                return response.status(500).json({message:"Error en el servidor"});
            }
        }
        return response.status(400).json({message:"Error en la petición"});
    }

    async searchPhoneById (request: Request, response: Response): Promise<Response>{
        try{
            const phoneId = parseInt(request.params.id);
            if(isNaN(phoneId)) return response.status(400).json({message:"Error en parámetro"});
            const phone = await this.app.getPhoneById (phoneId);
            if(!phone) return response.status(404).json({message:"Teléfono no encontrado"});

            return response.status(200).json(phone);
        
        }catch(error){
            if(error instanceof Error){
                return response.status(500).json({message:"Error en el servidor"});
            }
        }
        return response.status(400).json({message:"Error en la petición"});
    }

    async searchPhoneByNumber_type_id(request: Request, response: Response): Promise<Response> {
        try {
          const number_type_id = parseInt(request.params.number_type_id);
    
          const phone = await this.app.getPhoneByNumber_type_id(number_type_id);
          if (!phone) return response.status(404).json({ message: "Teléfono no encontrado" });
    
          return response.status(200).json(phone);
        } catch (error) {
          if (error instanceof Error) {
            return response.status(500).json({ message: "Error en el servidor" });
          }
        }
        return response.status(400).json({ message: "Error en la petición" });
      }
      
    async allPhones (request: Request, response: Response): Promise<Response>{
        try{
            const phones = await this.app.getAllPhones();
            return response.status(200).json(phones)
        }catch(error){
            if(error instanceof Error){
                return response.status(500).json({message:"Error en el servidor"});
            }
        }
        return response.status(400).json({message:"Error en la petición"});
    }

    async downPhone(request: Request, response: Response): Promise<Response>{
        try{
            const phoneId = parseInt(request.params.id);
            if(isNaN(phoneId)) return response.status(400).json({message:"Error en parámetro"});
            const phone = await this.app.deletePhone(phoneId);
            if(!phone) return response.status(404).json({message:"Telefono no encontrado"});

            return response.status(200).json(phone);
        
        }catch(error){
            if(error instanceof Error){
                return response.status(500).json({message:"Error en el servidor"});
            }
        }
        return response.status(400).json({message:"Error en la petición"});
    }
    
    async updatePhone(request: Request, response: Response): Promise<Response>{
        try{
            const phoneId = parseInt(request.params.id);
            if(isNaN(phoneId)) return response.status(400).json({message:"Error en parámetro"});
            
            let { number_type_id } = request.body;
      
      const updated = await this.app.updatePhone(phoneId,{number_type_id});
      if(!updated) return response.status(404).json({message: "Tipo de número no encontrado o sin cambios"});

      return response.status(200).json({message:"Tipo de número actualizado exitosamente"})
 
        }catch(error){
            if(error instanceof Error){
                return response.status(500).json({message:"Error en el servidor"});
            }
        }
        return response.status(400).json({message:"Error en la petición"});
    }
}