import { Admin } from "../domain/Admin";

export interface AdminPort{
    createAdmin(admin: Omit<Admin,"admin_id">): Promise<number>;
    updateAdmin(admin_id:number, admin:Partial<Admin>):Promise<boolean>;
    deleteAdmin(admin_id:number): Promise<boolean>;
    getAllAdmins(): Promise<Admin[]>;    
    getAdminByEmail(email: string): Promise<Admin | null>;
    getAdminById(admin_id: number): Promise<Admin | null>;
}
//