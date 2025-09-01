import { Repository } from "typeorm";
import { Role } from '../../domain/Role';
import { RolePort } from "../../domain/RolePort";
import { RoleEntity } from '../entities/RoleEntity';
import { AppDataSource } from "../config/con_data_bases";


export class RoleAdapter implements RolePort{
    private roleRepository: Repository<RoleEntity>;

    constructor(){
        this.roleRepository = AppDataSource.getRepository(RoleEntity);
    }
    private toDomain(role:RoleEntity):Role{
     return{
        id: role.role_id,
        description: role.role_description,
        
     }   
    }

    private toEntity(role: Omit<Role, "id">): RoleEntity{
        const roleEntity = new RoleEntity();
        roleEntity.role_description = role.description;
        
        
        return roleEntity;
    }
}