import { RoleApplication } from "../../application/RoleApplication";
import {Role} from "../../domain/Role";
import {Request, Response} from "express";

export class RoleController{
    private app: RoleApplication;
    constructor(app: RoleApplication){
        this.app = app;
    }

    async registerRole(request: Request, response: Response): Promise <Response>{
        const { description } = request.body;
             try {
                // Validaciones
                const descriptionRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9.,:;()\-_\s]{10,500}$/;
            if (!descriptionRegex.test(description?.trim())) {
            return response.status(400).json({ message: "Descripción inválida, debe tener entre 10 y 500 caracteres y no contener símbolos no permitidos." });
}
    
                const role: Omit<Role, "id"> = {
                     description
                };
                const roleId = await this.app.createRole(role);
                return response
                    .status(201)
                    .json({ message: "Role registrado correctamente", roleId });
            } catch (error) {
                if (error instanceof Error) {
                    return response.status(500).json({ message: "error en servidor" });
                }
            }
            return response.status(400).json({ message: "error en la petición" });
        }
    async searchRoleById(request:Request, response: Response): Promise<Response>{
    try {
        const roleId = parseInt(request.params.id);
        if(isNaN(roleId))
            return response.status(400).json({message:"error en parámetro"});
        const role = await this.app.getRoleById(roleId);
        if(!role){
            return response.status(404).json({message:"Role no existe"});
        }
        return response.status(200).json(role);
    } catch (error) {
        if (error instanceof Error){
            return response.status(500).json({message:"error en servidor"});
        }
    }
    return response.status(400).json({message:"error en la petición"});
 }

 async searchRoleByDescription(request: Request, response: Response): Promise<Response> {
    try {
        const { description } = request.params;

        if (!description || description.trim().length === 0) {
            return response.status(400).json({ message: "Parámetro descripción inválido" });
        }

        const role = await this.app.getRoleByDescription(description.trim());

        if (!role) {
            return response.status(404).json({ message: "Rol no existe con esa descripción" });
        }

        return response.status(200).json(role);

    } catch (error) {
        if (error instanceof Error) {
            return response.status(500).json({ message: "Error en servidor" });
        }
    }
    return response.status(400).json({ message: "Error en la petición" });
}

 
 async downRole(request:Request, response: Response): Promise<Response>{
    try {
        const roleId = parseInt(request.params.id);
        if(isNaN(roleId))
            return response.status(400).json({message:"error en parámetro"})
        const role = await this.app.deleteRole(roleId);
        if(!role){
            return response.status(404).json({message:"Rol no existe"})
        }
        return response.status(200).json(role);
    } catch (error) {
        if (error instanceof Error){
            return response.status(500).json({message:"error en servidor"});
        }
    }
    return response.status(400).json({message:"error en la petición"});
 }

 async updateRole(request: Request, response: Response): Promise <Response>{
    try {
        const roleId = parseInt(request.params.id);
        if (isNaN(roleId))
            return response.status(400).json({ message: "error en parámetro" });

        let { description } = request.body;

        // Validaciones antes de actualizar
        const descriptionRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9.,:;()\-_\s]{10,500}$/;

        if (description && !descriptionRegex.test(description.trim()))
            return response.status(400).json({ message: "Descripción inválida" });

        const updated = await this.app.updateRole(roleId, {
            description
        });

        if (!updated)
            return response.status(404).json({ message: "Role no encontrado o sin cambios" });

        return response.status(200).json({ message: "Role actualizado con éxito" });
    } catch (error) {
        if (error instanceof Error)
            return response.status(500).json({ message: "error en servidor" });
    }
    return response.status(400).json({ message: "error en la petición" });
}
} 