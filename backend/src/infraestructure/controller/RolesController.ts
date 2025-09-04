import { RolesApplication } from "../../application/RolesApplication";
import {Roles} from "../../domain/Roles";
import {Request, Response} from "express";

export class RolesController{
    private app: RolesApplication;
    constructor(app: RolesApplication){
        this.app = app;
    }

async registerRole(req: Request, res: Response): Promise <Response>{
    const { description } = req.body;
        try {
            // Validaciones
            const descriptionRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9.,:;()\-_\s]{3,500}$/;
            if (!descriptionRegex.test(description?.trim())) {
            return res.status(400).json({ message: "Descripción inválida, debe tener entre 3 y 500 caracteres y no contener símbolos no permitidos." });
        }
        const role: Omit<Roles, "role_id"> = {description};
        const roleId = await this.app.createRole(role);
        return res.status(201).json({ message: "Role registrado correctamente", roleId });
    } catch (error) {
        if (error instanceof Error) {
        return res.status(500).json({ message: "error en servidor" });
        }
    }
    return res.status(400).json({ message: "error en la petición" });
}

async searchRoleById(req:Request, res: Response): Promise<Response>{
    try {
        const roleId = parseInt(req.params.id);
        if(isNaN(roleId))
            return res.status(400).json({message:"error en parámetro"});
        const role = await this.app.getRoleById(roleId);
        if(!role){
            return res.status(404).json({message:"Role no existe"});
        }
        return res.status(200).json(role);
    } catch (error) {
        if (error instanceof Error){
            return res.status(500).json({message:"error en servidor"});
        }
    }
    return res.status(400).json({message:"error en la petición"});
 }

 async searchRoleByDescription(req: Request, res: Response): Promise<Response> {
    try {
        const { description } = req.params;

        if (!description || description.trim().length === 0) {
            return res.status(400).json({ message: "Parámetro descripción inválido" });
        }

        const role = await this.app.getRoleByDescription(description.trim());

        if (!role) {
            return res.status(404).json({ message: "Rol no existe con esa descripción" });
        }

        return res.status(200).json(role);

    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: "Error en servidor" });
        }
    }
    return res.status(400).json({ message: "Error en la petición" });
}

 async allRoles(req:Request, res: Response): Promise<Response>{
    try {
        const roles = await this.app.getAllRoles;
        return res.status(200).json(roles);
    } catch (error) {
        if (error instanceof Error){
            return res.status(500).json({message:"error en servidor"});
        }
    }
    return res.status(400).json({message:"error en la petición"});
 }

 async downRole(req:Request, res: Response): Promise<Response>{
    try {
        const roleId = parseInt(req.params.id);
        if(isNaN(roleId))
            return res.status(400).json({message:"error en parámetro"})
        const role = await this.app.deleteRole(roleId);
        if(!role){
            return res.status(404).json({message:"Rol no existe"})
        }
        return res.status(200).json(role);
    } catch (error) {
        if (error instanceof Error){
            return res.status(500).json({message:"error en servidor"});
        }
    }
    return res.status(400).json({message:"error en la petición"});
 }

 async updateRole(req: Request, res: Response): Promise <Response>{
    try {
        const roleId = parseInt(req.params.id);
        if (isNaN(roleId))
            return res.status(400).json({ message: "error en parámetro" });

        let { description } = req.body;

        // Validaciones antes de actualizar
        const descriptionRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9.,:;()\-_\s]{3,500}$/;

        if (description && !descriptionRegex.test(description.trim()))
            return res.status(400).json({ message: "Descripción inválida" });

        const updated = await this.app.updateRole(roleId, {
            description
        });

        if (!updated)
            return res.status(404).json({ message: "Role no encontrado o sin cambios" });

        return res.status(200).json({ message: "Role actualizado con éxito" });
    } catch (error) {
        if (error instanceof Error)
            return res.status(500).json({ message: "error en servidor" });
    }
    return res.status(400).json({ message: "error en la petición" });
}
} 