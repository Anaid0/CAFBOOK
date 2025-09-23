import { Roles } from "../entities/Roles";
export interface RolesPort{
     createRole(role: Omit<Roles,"role_id">): Promise<number>;
     updateRole(role_id:number, roles:Partial<Roles>):Promise<boolean>;
     deleteRole(role_id:number): Promise<boolean>;
     getAllRoles(): Promise<Roles[]>;
     getRoleById(role_id:number): Promise<Roles | null>;
     getRoleByDescription(description:string): Promise <Roles | null>;

}
//