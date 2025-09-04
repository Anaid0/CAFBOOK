import { Roles } from "./Roles";
export interface RolesPort{
     createRole(role: Omit<Roles,"role_id">): Promise<number>;
     updateRole(role_id:number, role:Partial<Roles>):Promise<boolean>;
     deleteRole(role_id:number): Promise<boolean>;
     getRoleById(role_id:number): Promise<Roles | null>;
     getRoleByDescription(description: string): Promise<Roles | null>;
     getAllRoles(): Promise <Roles[]>;
}