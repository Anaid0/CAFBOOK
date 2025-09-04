import { Repository } from "typeorm";
import { Users } from "../../domain/Users";
import { UserPort } from "../../domain/UsersPort";
import { UserEntity } from "../entities/UsersEntity";
import { AppDataSource } from "../config/con_data_bases";

export class UserAdapter implements UserPort {
    private userRepository: Repository<UserEntity>;

    constructor() {
        this.userRepository = AppDataSource.getRepository(UserEntity);
    }

    private toDomain(user: UserEntity): Users {
        return {
            user_id: user.user_id_user,
            name: user.name_user,
            lastname: user.lastname_user,
            doc_type_id: user.doc_type_id_user,
            doc_number: user.doc_number_user,
            address: user.address_user,
            phone: user.phone_user,
            department: user.department_user,
            city: user.city_user,
            email: user.email_user,
            password: user.password_user,
            role_id: user.role_id_user,
        };
    }

    private toEntity(user: Omit<Users, "id">): UserEntity {
        const userEntity = new UserEntity();
        userEntity.name_user = user.name;
        userEntity.lastname_user = user.lastname;
        userEntity.doc_type_id_user = user.doc_type_id;
        userEntity.doc_number_user = user.doc_number;
        userEntity.address_user = user.address;
        userEntity.phone_user = user.phone;
        userEntity.department_user = user.department;
        userEntity.city_user = user.city;
        userEntity.email_user = user.email;
        userEntity.password_user = user.password;
        userEntity.role_id_user = user.role_id;
        return userEntity;
    }

    async createUser(user: Omit<Users, "id">): Promise<number> {
        try {
            const newUser = this.toEntity(user);
            const savedUser = await this.userRepository.save(newUser);
            return savedUser.user_id_user;
        } catch (error) {
            console.error("Error creating user", error);
            throw new Error("Error creating user");
        }
    }

    async updateUser(user_id: number, user: Partial<Users>): Promise<boolean> {
        try {
            const existingUser = await this.userRepository.findOne({ where: { user_id_user: user_id } });
            if (!existingUser) {
                throw new Error("User not found");
            }

            // Actualizamos solo los campos enviados
            Object.assign(existingUser, {
                name_user: user.name ?? existingUser.name_user,
                lastname_user: user.lastname ?? existingUser.lastname_user,
                doc_type_user: user.doc_type_id ?? existingUser.doc_type_id_user,
                doc_number_user: user.doc_number ?? existingUser.doc_number_user,
                address_user: user.address ?? existingUser.address_user,
                phone_user: user.phone ?? existingUser.phone_user,
                department_user: user.department ?? existingUser.department_user,
                city_user: user.city ?? existingUser.city_user,
                email_user: user.email ?? existingUser.email_user,
                password_user: user.password ?? existingUser.password_user,
                role_user: user.role_id ?? existingUser.role_id_user,
                status_user: 1, // reactivación en caso de estar deshabilitado
            });

            await this.userRepository.save(existingUser);
            return true;
        } catch (error) {
            console.error("Error updating user", error);
            throw new Error("Error updating user");
        }
    }

    async deleteUser(user_id: number): Promise<boolean> {
        try {
            const existingUser = await this.userRepository.findOne({ where: { user_id_user: user_id } });
            if (!existingUser) {
                throw new Error("User not found");
            }

            // Soft delete (cambiar estado en lugar de borrar físicamente)
            Object.assign(existingUser, {
                status_user: 0,
            });

            await this.userRepository.save(existingUser);
            return true;
        } catch (error) {
            console.error("Error deleting user", error);
            throw new Error("Error deleting user");
        }
    }

    async getAllUsers(): Promise<Users[]> {
        try {
            const users = await this.userRepository.find();
            return users.map((u) => this.toDomain(u));
        } catch (error) {
            console.error("Error fetching all users", error);
            throw new Error("Error fetching all users");
        }
    }

    async getUserById(user_id: number): Promise<Users | null> {
        try {
            const user = await this.userRepository.findOne({ where: { user_id_user: user_id } });
            return user ? this.toDomain(user) : null;
        } catch (error) {
            console.error("Error fetching user by id", error);
            throw new Error("Error fetching user by id");
        }
    }

    async getUserByEmail(email: string): Promise<Users | null> {
        try {
            const user = await this.userRepository.findOne({ where: { email_user: email } });
            return user ? this.toDomain(user) : null;
        } catch (error) {
            console.error("Error fetching user by email", error);
            throw new Error("Error fetching user by email");
        }
    }
}
