import bcrypt from "bcryptjs";
import { Admin } from "../domain/Admin";
import { AdminPort } from "../domain/AdminPort";
import { AuthApplication } from "./AuthApplication";

export class AdminApplication{
    private port: AdminPort;

    constructor(port: AdminPort){
        this.port = port;
    }

    async login(email:string, password:string):Promise<string>{
        const existingAdmin = await this.port.getAdminByEmail(email);
        if(!existingAdmin){  
            throw new Error("Credenciales Inválidas");
        }
    
        const passwordMath= await bcrypt.compare(password, existingAdmin.password);
        if(!passwordMath){
            throw new Error("Invalid Credencials")
        }
    
        const token = AuthApplication.generateToken({
            id: existingAdmin.admin_id,
            email: existingAdmin.email
        });    
        return token; 
    }

    async createAdmin(admin: Omit<Admin,"admin_id">): Promise<number>{
        const existingAdmin = await this.port.getAdminByEmail(admin.email);
        if (!existingAdmin) {
            const hashedPass= await bcrypt.hash(admin.password, 10);
            admin.password = hashedPass;
            return await this.port.createAdmin(admin);
        }
        throw new Error("Ya existe un usuario asociado a este email");
    }

    async updateAdmin(admin_id:number, admin:Partial<Admin>):Promise<boolean>{
        const existingAdmin = await this.port.getAdminById(admin_id);
        if (!existingAdmin) {
            throw new Error("Admin no existe");
        }

        if (admin.email) {
            const emailTaken = await this.port.getAdminByEmail(admin.email);
            if(emailTaken && emailTaken.admin_id !==admin_id){
                throw new Error("Error, no se puede actualizar el email")
            }
        }
        return await this.port.updateAdmin(admin_id, admin);
    }

    async deleteAdmin(admin_id:number): Promise<boolean>{
        const existingAdmin = await this.port.getAdminById(admin_id);
        if (!existingAdmin) {
            throw new Error("No se encontró admin");
        }
        return await this.port.deleteAdmin(admin_id);
    }

    async getAllAdmins(): Promise<Admin[]>{
        return await this.port.getAllAdmins();
    }

    async getAdminByEmail(email: string): Promise<Admin | null>{
        return await this.port.getAdminByEmail(email); 
    }

    async getAdminById(admin_id: number): Promise<Admin | null>{
        return await this.port.getAdminById(admin_id);
    }
}