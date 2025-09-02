import { Roles } from "./Roles";
export interface RolesPort{
     createRole(role: Omit<Roles,"id">): Promise<number>;
     updateRole(id:number, role:Partial<Roles>):Promise<boolean>;
     deleteRole(id:number): Promise<boolean>;
     getRoleById(id:number): Promise<Roles | null>;
     getRoleByDescription(description: string): Promise<Roles | null>;
     getAllRoles(): Promise <Roles[]>;
}