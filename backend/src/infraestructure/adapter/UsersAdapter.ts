import { Repository } from "typeorm";
import { Users } from "../../domain/Users";
import { UserPort } from "../../domain/UsersPort";
import { UserEntity } from "../entities/UsersEntity";
import { AppDataSource } from "../config/con_data_bases";
import { RolesEntity } from "../entities/RolesEntity";
import { Document_typesEntity } from '../entities/Document_typesEntity';

export class UsersAdapter implements UserPort{
    private userRepository: Repository<UserEntity>

    constructor(){
        this.userRepository = AppDataSource.getRepository(UserEntity);
    }

    private toDomain(user: UserEntity): Users{
        return{
            user_id: user.user_id,
            first_name: user.first_name,
            last_name: user.last_name,
            document_number: user.document_number,
            email: user.email,
            password: user.password,
            status: user.status,
            photo_url: user.photo_url,
            created_at: user.created_at,
            role_id: user.role_id.role_id,
            role_description: user.role_id.description,
            doc_type_id: user.doc_type_id.doc_type_id,
            doc_type_description: user.doc_type_id.description
        };
    }

    private toEntity(user: Omit<Users, "user_id">): UserEntity{
        const userEntity = new UserEntity();
        const rolesEntity = new RolesEntity();
        const document_type = new Document_typesEntity();

        rolesEntity.role_id = user.role_id;
        document_type.doc_type_id = user.doc_type_id;
        userEntity.first_name = user.first_name;
        userEntity.last_name = user.last_name;
        userEntity.document_number = user.document_number;
        userEntity.email = user.email;
        userEntity.password = user.password;
        userEntity.status = user.status;
        userEntity.created_at = user.created_at;
        userEntity.photo_url = user.photo_url ?? null;
        userEntity.role_id = rolesEntity;
        userEntity.doc_type_id = document_type;
        return userEntity;
    }
    
    async createUser(user: Omit<Users, "address_id">): Promise<number> {
        try{
            const newUser = this.toEntity(user);
            const savedUser = await this.userRepository.save(newUser);
            return savedUser.user_id;
        }catch(error){
            console.error("Error creating user", error);
            throw new Error("Error creating user");
        }
    }

    async updateUser(user_id: number, user: Partial<Users>): Promise<boolean> {
        try{
            const existingUser = await this.userRepository.findOne({where:{user_id:user_id}});
            if (!existingUser){
                throw new Error("User not found");
            }

            if(user.doc_type_id){
                const doc_type_id = new Document_typesEntity();
                doc_type_id.doc_type_id = user.doc_type_id;
                existingUser.doc_type_id = doc_type_id;
            }
            
            Object.assign(existingUser,{
               first_name: user.first_name ??  existingUser.first_name,
               last_name: user.last_name ?? existingUser.last_name,
               document_number: user.document_number ?? existingUser.document_number,
               photo_url: user.photo_url ?? existingUser.photo_url,
               email: user.email ?? existingUser.email,
               password: user.password ?? existingUser.password,
               doc_type_id: user.doc_type_id ?? existingUser.doc_type_id,
               status: 1,
            });
            
            await this.userRepository.save(existingUser);
            return true;
        }catch(error){
            console.error("Error deleting all users", error);
            throw new Error("Error deleting all users");
        }
    }

    async deleteUser(user_id: number): Promise<boolean> {
        try{
            const existingUser = await this.userRepository.findOne({where:{user_id:user_id}});
            if (!existingUser){
                throw new Error("User not found");
            }
            Object.assign(existingUser, {
                status: 0
            });
            await this.userRepository.save(existingUser);
            return true;
        }catch(error){
            console.error("Error deleting all users", error);
            throw new Error("Error deleting all users");
        }
    }

    async restoreUser(user_id: number): Promise<boolean> {
        try{
            const existingUser = await this.userRepository.findOne({where:{user_id:user_id}});
            if (!existingUser){
                throw new Error("User not found");
            }
            Object.assign(existingUser, {
                status: 1
            });
            await this.userRepository.save(existingUser);
            return true;
        }catch(error){
            console.error("Error restore all users", error);
            throw new Error("Error restore all users");
        }
    }


    async getAllUsers(): Promise<Users[]> {
        try{
            const users = await this.userRepository.find({relations:["role_id", "doc_type_id"]});
            return users.map(this.toDomain);
        }catch(error){
            console.error("Error fetching all users", error);
            throw new Error("Error fetching all users");
        }
    }

    async getUserById(user_id: number): Promise<Users | null> {
        try{
            const user = await this.userRepository.findOne({relations:["role_id", "doc_type_id"], where:{user_id:user_id}});
            return user ? this.toDomain(user): null;
        }catch(error){
            console.error("Error fetching all users", error);
            throw new Error("Error fetching all users");
        }
    }
    
    async getUserByEmail(email: string): Promise<Users | null> {
        try{
            const user = await this.userRepository.findOne({relations:["role_id", "doc_type_id"], where:{email:email}});
            return user ? this.toDomain(user): null;
        }catch(error){
            console.error("Error fetching all users", error);
            throw new Error("Error fetching all users");
        }
    }

    
}