import { RolesApplication } from "../../application/RolesApplication";
import { Roles } from "../../domain/Roles";
import {Request, Response} from "express";
import { Validators } from "../config/validations";

export class RolesController{
    private app: RolesApplication;
    constructor(app: RolesApplication){
        this.app = app;
    }

    async registerRole(request: Request, response: Response): Promise <Response>{
        const { description } = request.body;
        try{

            if(!Validators.description(description))
                return response.status(400).json({message: "Descripción inválida"});
        
            const role: Omit<Roles, "role_id"> = {description};
            const roleId = await this.app.createRole(role);

            return response.status(201).json({message:"Rol creado exitosamente:", roleId});
        }catch(error){

            if(error instanceof Error){
                return response.status(500).json({message:"Error en el servidor"});
            }
        }
        return response.status(400).json({message:"Error en la petición"});
    }

    async searchRoleById (request: Request, response: Response): Promise<Response>{
        try{
            const roleId = parseInt(request.params.id);
            if(isNaN(roleId)) return response.status(400).json({message:"Error en parámetro"});
            const role = await this.app.getRoleById (roleId);
            if(!role) return response.status(404).json({message:"Rol no encontrado"});

            return response.status(200).json(role);
        
        }catch(error){
            if(error instanceof Error){
                return response.status(500).json({message:"Error en el servidor"});
            }
        }
        return response.status(400).json({message:"Error en la petición"});
    }

    async searchRoleByDescription (request: Request, response: Response): Promise<Response>{
        try{
            const {description}= (request.params);
            if(!Validators.description(description))
                return response.status(400).json({ error: "Descripción no válida" });
 
            const role = await this.app.getRoleByDescription(description);
            if(!role) return response.status(404).json({message:"Rol no encontrado"});

            return response.status(200).json(role);
        
        }catch(error){
            if(error instanceof Error){
                return response.status(500).json({message:"Error en el servidor"});
            }
        }
        return response.status(400).json({message:"Error en la petición"});
    }

    async allRoles (request: Request, response: Response): Promise<Response>{
        try{
            const roles = await this.app.getAllRoles();
            return response.status(200).json(roles)
        }catch(error){
            if(error instanceof Error){
                return response.status(500).json({message:"Error en el servidor"});
            }
        }
        return response.status(400).json({message:"Error en la petición"});
    }

    async downRole(request: Request, response: Response): Promise<Response>{
        try{
            const roleId = parseInt(request.params.id);
            if(isNaN(roleId)) return response.status(400).json({message:"Error en parámetro"});
            const role = await this.app.deleteRole(roleId);
            if(!role) return response.status(404).json({message:"Rol no encontrado"});

            return response.status(200).json(role);
        
        }catch(error){
            if(error instanceof Error){
                return response.status(500).json({message:"Error en el servidor"});
            }
        }
        return response.status(400).json({message:"Error en la petición"});
    }
    
    async updateRole(request: Request, response: Response): Promise<Response>{
        try{
            const roleId = parseInt(request.params.id);
            if(isNaN(roleId)) return response.status(400).json({message:"Error en parámetro"});
            
            let { description } = request.body;

             
            if (description && !Validators.description(description)) 
                return response.status(400).json({message:"La descripción solo debe contener letras",
            });
 
      
      const updated = await this.app.updateRole(roleId,{description});
      if(!updated) return response.status(404).json({message: "Rol no encontrado o sin cambios"});

      return response.status(200).json({message:"Rol actualizado exitosamente"})
 
        }catch(error){
            if(error instanceof Error){
                return response.status(500).json({message:"Error en el servidor"});
            }
        }
        return response.status(400).json({message:"Error en la petición"});
    }
}