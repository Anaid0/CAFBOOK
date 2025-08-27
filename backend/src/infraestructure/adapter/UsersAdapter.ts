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
        id: user.id_user,
        name: user.name_user,
        lastname: user.lastname_user,
        doc_type: user.doc_type_user,
        doc_number: user.doc_number_user,
        address: user.address_user,
        phone: user.phone_user,
        department: user.department_user,
        city: user.city_user,
        email: user.email_user,
        password: user.password_user,
        role: user.role_user
     }   
    }

    private toEntity(user: Omit<Users, "id">): UserEntity{
        const userEntity = new UserEntity();
        userEntity.name_user = user.name;
        userEntity.lastname_user = user.lastname;
        userEntity.doc_type_user = user.doc_type;
        userEntity.doc_number_user = user.doc_number;
        userEntity.address_user = user.address;
        userEntity.phone_user = user.phone;
        userEntity.department_user = user.department;
        userEntity.city_user = user.city;
        userEntity.email_user = user.email;
        userEntity.password_user = user.password;
        userEntity.role_user =user.role;
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