import { Roles } from "../domain/Roles";
import { RolesPort } from "../domain/RolesPort";


export class RolesApplication{
    private port: RolesPort;

    constructor(port: RolesPort){
        this.port = port;
    }
    async createRole(role: Omit<Roles, "id">): Promise<number> {
        const existingRole = await this.port.getRoleByDescription(role.description); 
        if (!existingRole) {
            return await this.port.createRole(role);
        }
        throw new Error("El rol ya existe");
    }

    async updateRole(id:number, role:Partial<Roles>):Promise<boolean>{
        const existingRole= await this.port.getRoleById(id);
        if(!existingRole){
            throw new Error("El usuario no existe")
        }

        if(role.description){
            const descriptionTaken = await this.port.getRoleByDescription(role.description);
            if(descriptionTaken && descriptionTaken.id !== id){
                throw new Error("Error en actualizar la descripción NO SE PUEDE!")
            }
        }
        return await this.port.updateRole(id,role);
    }

    async deleteRole(id:number): Promise<boolean>{
        const existingRole = await this.port.getRoleById(id);
        if(!existingRole){
            throw new Error("No se encontró el rol");
        }
        return await this.port.deleteRole(id);

    }

    //consultas get
    async getRoleById(id:number): Promise<Roles | null>{
        return await this.port.getRoleById(id);

    }

    async getAllRoles(): Promise<Roles []>{
        return await this.port.getAllRoles();
    }

    async getRoleByDescription(description:string): Promise<Roles | null>{
        return await this.port.getRoleByDescription(description);

    }
}