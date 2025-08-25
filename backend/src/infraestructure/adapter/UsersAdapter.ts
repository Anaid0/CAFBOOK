import { Repository } from "typeorm";
import { Users } from '../../domain/Users';
import { UserPort } from "../../domain/UsersPort";
import { UserEntity } from '../entities/UsersEntity';
import { AppDataSource } from "../config/con_data_bases";


export class UserAdapter implements UserPort{
    private userRepository: Repository<UserEntity>;

    constructor(){
        this.userRepository = AppDataSource.getRepository(UserEntity);
    }
    private toDomain(user:UserEntity):Users{
     return{
        id: user.id_users,
        name: user.name_users,
        lastname: user.lastname_users,
        doc_type: user.doc_type_users,
        doc_number: user.doc_number_users,
        address: user.address_users,
        phone: user.phone_users,
        department: user.department_users,
        city: user.city_users,
        email: user.email_users,
        password: user.password_users,
        role: user.role_users
     }   
    }

    private toEntity(user: Omit<Users, "id">): UserEntity{
        const userEntity = new UserEntity();
        userEntity.name_users = user.name;
        userEntity.lastname_users = user.lastname;
        userEntity.doc_type_users = user.doc_type;
        userEntity.doc_number_users = user.doc_number;
        userEntity.address_users = user.address;
        userEntity.phone_users = user.phone;
        userEntity.department_users = user.department;
        userEntity.city_users = user.city;
        userEntity.email_users = user.email;
        userEntity.password_users = user.password;
        userEntity.role_users =user.role;
        return userEntity;
    }

    async createUser(user: Omit<Users, "id">): Promise<number> {
        try{
            const newUser = this.toEntity(user);
            const savedUser = await this.userRepository.save(newUser);
            return savedUser.id_user;
        }catch (error){
            console.error("Error creating user ", error);
            throw new Error("Error creating user")
        }
    }
    async updateUser(id: number, user: Partial<Users>): Promise<boolean> {
        try {
            const existingUser = await this.userRepository.findOne({where:{id_user:id}});
            if(!existingUser){
                throw new Error("User not found");
            }
            //Actualizamos los atributos o priopiedades enviadas
            Object.assign( existingUser,{
             name_user: user.name ?? existingUser.name_user,
             email_user: user.email ?? existingUser.email_user,
             password_user: user.password ?? existingUser.password_user,
             status_user: 1   
            });
            await this.userRepository.save(existingUser);
            return true;
        } catch (error) {
            console.error("Error udating user", error);
            throw new Error("Error updating user");
            
        }
    }
    async deleteUser(id: number): Promise<boolean> {
        try {
            const existingUser = await this.userRepository.findOne({where:{id_user:id}});
            if(!existingUser){
                throw new Error("User not found");
            }
            Object.assign(existingUser, {
                status_user:0
            });
            await this.userRepository.save(existingUser);
            return true;
        } catch (error) {
            console.error("Error deleting user", error);
            throw new Error("Error deleting user")
        }
    }
    async getAllUsers(): Promise<Users[]> {
        try {
            const users = await this.userRepository.find();
            return users.map(this.toDomain);
        } catch (error) {
            console.error("Error featching all users ", error);
            throw new Error("Error featching all users")
        }
    }
    async getUserById(id: number): Promise<Users | null> {
        try {
            const user = await this.userRepository.findOne({where:{id_user:id}});
            return user ? this.toDomain(user): null
        } catch (error) {
            console.error("Error featching user by id ", error);
            throw new Error("Error featching user by id");
        }
    }
    async getUserByEmail(email: string): Promise<Users | null> {
        try {
            const user = await this.userRepository.findOne({where:{email_user:email}});
            return user ? this.toDomain(user): null
        } catch (error) {
            console.error("Error featching user by email ", error);
            throw new Error("Error featching user by email");
        }

}
}