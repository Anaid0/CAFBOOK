import { Repository } from "typeorm";
import { AdminPort } from "../../domain/ports/AdminPort";
import { AdminEntity } from "../entities/AdminEntity";
import { AppDataSource } from "../config/con_data_bases";
import { Admin } from '../../domain/domain/Admin';

export class AdminAdapter implements AdminPort{
    private adminRepository: Repository<AdminEntity>

    constructor(){
        this.adminRepository = AppDataSource.getRepository(AdminEntity);
    }

    private toDomain(admin: AdminEntity): Admin{
        return{
            admin_id: admin.admin_id,
            email: admin.email,
            password: admin.password
        };
    }

    private toEntity(admin: Omit<Admin, "admin_id">): AdminEntity{
        const adminEntity = new AdminEntity();

        adminEntity.email = admin.email,
        adminEntity.password = admin.password

        return adminEntity;
    }

    async createAdmin(admin: Omit<Admin, "admin_id">): Promise<number> {
        try{
            const newAdmin = this.toEntity(admin);
            const savedUser = await this.adminRepository.save(newAdmin);
            return savedUser.admin_id;
        }catch(error){
            console.error("Error creating admin", error);
            throw new Error("Error creating admin");
        }
    }

    async updateAdmin(admin_id: number, admin: Partial<Admin>): Promise<boolean> {
        try{
            const existingAdmin = await this.adminRepository.findOne({where:{admin_id:admin_id}});
            if (!existingAdmin){
                throw new Error("Admin not found");
            }
            
            Object.assign(existingAdmin,{
                email: admin.email ?? existingAdmin.email,
                password: admin.password ?? existingAdmin.password
            });
            
            await this.adminRepository.save(existingAdmin);
            return true;
        }catch(error){
            console.error("Error searching all admins", error);
            throw new Error("Error searching all admins");
        }
    }

    async deleteAdmin(admin_id: number): Promise<boolean> {
         try{
            const existingAdmin = await this.adminRepository.findOne({where:{admin_id:admin_id}});
            if (!existingAdmin){
                throw new Error("Admin not found");
            }

            await this.adminRepository.delete(existingAdmin);
            return true;
        }catch(error){
            console.error("Error deleting all admins", error);
            throw new Error("Error deleting all admins");
        }
    }

    async getAllAdmins(): Promise<Admin[]> {
        try{
            const admins = await this.adminRepository.find();
            return admins.map(this.toDomain);
        }catch(error){
            console.error("Error fetching all admins", error);
            throw new Error("Error fetching all admins");
        }
    }

    async getAdminByEmail(email: string): Promise<Admin | null> {
        try{
            const admin = await this.adminRepository.findOne({where:{email:email}});
            return admin ? this.toDomain(admin): null;
        }catch(error){
            console.error("Error fetching all users", error);
            throw new Error("Error fetching all users");
        }
    }

    async getAdminById(admin_id: number): Promise<Admin | null> {
        try{
            const admin = await this.adminRepository.findOne({where:{admin_id:admin_id}});
            return admin ? this.toDomain(admin): null;
        }catch(error){
            console.error("Error fetching all users", error);
            throw new Error("Error fetching all users");
        }
    }


}