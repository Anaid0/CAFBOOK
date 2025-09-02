import { Repository } from "typeorm";
import { Roles } from '../../domain/Roles';
import { RolesPort } from '../../domain/RolesPort';
import { RolesEntity } from '../entities/RolesEntity';
import { AppDataSource } from "../config/con_data_bases";


export class RolesAdapter implements RolesPort{

    private roleRepository: Repository<RolesEntity>;

    constructor(){
        this.roleRepository = AppDataSource.getRepository(RolesEntity);
    }
    
    async getAllRoles(): Promise<Roles[]> {
        try{
            const roles = await this.roleRepository.find();
            return roles.map(this.toDomain);
        }catch (error){
            console.error("Error creating rol ", error);
            throw new Error("Error creating rol")
        }
    }

    async createRole(rol: Omit<Roles, "id">): Promise<number> {
        try{
            const newRol = this.toEntity(rol);
            const savedRol = await this.roleRepository.save(newRol);
            return savedRol.role_id;
        }catch (error){
            console.error("Error creating rol ", error);
            throw new Error("Error creating rol")
        }
    }


    updateRole(id: number, role: Partial<Roles>): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    deleteRole(id: number): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    getRoleById(id: number): Promise<Roles | null> {
        throw new Error("Method not implemented.");
    }
    getRoleByDescription(description: string): Promise<Roles | null> {
        throw new Error("Method not implemented.");
    }
    private toDomain(role:RolesEntity):Roles{
     return{
        id: role.role_id,
        description: role.role_description,
        
     }   
    }

    private toEntity(role: Omit<Roles, "id">): RolesEntity{
        const roleEntity = new RolesEntity();
        roleEntity.role_description = role.description;
        
        
        return roleEntity;
    }
}