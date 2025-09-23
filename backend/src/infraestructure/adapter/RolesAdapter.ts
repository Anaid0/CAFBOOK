import { Repository } from "typeorm";
import { Roles } from '../../domain/entities/Roles';
import { RolesPort } from "../../domain/port/RolesPort";
import { RolesEntity } from '../entities/RolesEntity';
import { AppDataSource } from "../config/con_data_bases";


export class RolesAdapter implements RolesPort{
    private roleRepository: Repository<RolesEntity>;

    constructor(){
        this.roleRepository = AppDataSource.getRepository(RolesEntity);
    }
    private toDomain(role:RolesEntity):Roles{
     return{
        role_id: role.role_id,
        description: role.description,
     }   
    }

    private toEntity(role: Omit<Roles, "role_id">): RolesEntity{
        const rolesEntity = new RolesEntity();
        rolesEntity.description = role.description;       
        return rolesEntity;
    }

    async createRole(role: Omit<Roles, "role_id">): Promise<number> {
        try{
            const newRole = this.toEntity(role);
            const savedRole = await this.roleRepository.save(newRole);
            return savedRole.role_id;
        }catch (error){
            console.error("Error creating role ", error);
            throw new Error("Error creating role")
        }
    }
    async updateRole(role_id: number, role: Partial<Roles>): Promise<boolean> {
        try {
            const existingRole = await this.roleRepository.findOne({where:{role_id:role_id}});
            if(!existingRole){
                throw new Error("Role not found");
            }
           
            Object.assign( existingRole,{
             description: role.description ?? existingRole.description
            });
            await this.roleRepository.save(existingRole);
            return true;
        } catch (error) {
            console.error("Error updating role", error);
            throw new Error("Error updating role");
            
        }
    }
    async deleteRole(role_id: number): Promise<boolean> {
        try {
            const existingRole = await this.roleRepository.findOne({where:{role_id:role_id}});
            if(!existingRole){
                throw new Error("Role not found");
            }
            await this.roleRepository.delete(existingRole);
            return true;
        } catch (error) {
            console.error("Error deleting role", error);
            throw new Error("Error deleting role")
        }
    }
    async getAllRoles(): Promise<Roles[]> {
        try {
            const roles = await this.roleRepository.find();
            return roles.map(this.toDomain);
        } catch (error) {
            console.error("Error featching all roles ", error);
            throw new Error("Error featching all roles")
        }
    }
    async getRoleById(role_id: number): Promise<Roles | null> {
        try {
            const role = await this.roleRepository.findOne({where:{role_id:role_id}});
            return role ? this.toDomain(role): null
        } catch (error) {
            console.error("Error featching role by id ", error);
            throw new Error("Error featching role by id");
        }
    }
    async getRoleByDescription(description: string): Promise<Roles | null> {
        try {
            const role = await this.roleRepository.findOne({where:{description:description}});
            return role ? this.toDomain(role): null
        } catch (error) {
            console.error("Error featching role by description ", error);
            throw new Error("Error featching role by description");
        }

    }

}