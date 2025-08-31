import { Role } from "../domain/Role";
import { RolePort } from "../domain/RolePort";


export class RoleApplication{
    private port: RolePort;

    constructor(port: RolePort){
        this.port = port;
    }
    async createRole(role: Omit<Role, "id">): Promise<number> {
        const existingRole = await this.port.getRoleByDescription(role.description); 
        if (!existingRole) {
            return await this.port.createRole(role);
        }
        throw new Error("El rol ya existe");
    }

    async updateRole(id:number, role:Partial<Role>):Promise<boolean>{
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
    async getRoleById(id:number): Promise<Role | null>{
        return await this.port.getRoleById(id);

    }

    async getRoleByDescription(description:string): Promise<Role | null>{
        return await this.port.getRoleByDescription(description);

    }
}