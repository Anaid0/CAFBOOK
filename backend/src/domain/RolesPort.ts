import { Roles } from "./Roles";
export interface RolesPort{
     createRole(role: Omit<Roles,"role_id">): Promise<number>;
     updateRole(role_id:number, roles:Partial<Roles>):Promise<boolean>;
     deleteRole(role_id:number): Promise<boolean>;
     getAllRoles(): Promise<Roles[]>;
     getRolesById(role_id:number): Promise<Roles | null>;
     getRolesByDescription(Description:string): Promise <Roles | null>;

}