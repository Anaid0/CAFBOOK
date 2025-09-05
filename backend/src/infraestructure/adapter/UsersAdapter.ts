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
            user_id: user.user_id,
            name: user.firts_name,
            lastname: user.last_name,
            doc_type_id: user.doc_type_id,
            doc_number: user.document_number,
            address: user.address,
            phone: user.phone,
            department: user.state,
            city: user.city,
            email: user.email,
            password: user.password,
            role_id: user.role_id,
        };
    }

    private toEntity(user: Omit<Users, "id">): UserEntity {
        const userEntity = new UserEntity();
        userEntity.firts_name = user.name;
        userEntity.last_name = user.lastname;
        userEntity.doc_type_id = user.doc_type_id;
        userEntity.document_number = user.doc_number;
        userEntity.address = user.address;
        userEntity.phone = user.phone;
        userEntity.state = user.department;
        userEntity.city = user.city;
        userEntity.email = user.email;
        userEntity.password = user.password;
        userEntity.role_id = user.role_id;
        return userEntity;
    }

    async createUser(user: Omit<Users, "id">): Promise<number> {
        try {
            const newUser = this.toEntity(user);
            const savedUser = await this.userRepository.save(newUser);
            return savedUser.user_id;
        } catch (error) {
            console.error("Error creating user", error);
            throw new Error("Error creating user");
        }
    }

    async updateUser(user_id: number, user: Partial<Users>): Promise<boolean> {
        try {
            const existingUser = await this.userRepository.findOne({ where: { user_id: user_id } });
            if (!existingUser) {
                throw new Error("User not found");
            }

            // Actualizamos solo los campos enviados
            Object.assign(existingUser, {
                firts_name: user.name ?? existingUser.firts_name,
                last_name: user.lastname ?? existingUser.last_name,
                doc_type_id: user.doc_type_id ?? existingUser.doc_type_id,
                document_number: user.doc_number ?? existingUser.document_number,
                address: user.address ?? existingUser.address,
                phone: user.phone ?? existingUser.phone,
                state: user.department ?? existingUser.state,
                city: user.city ?? existingUser.city,
                email: user.email ?? existingUser.email,
                password_user: user.password ?? existingUser.password,
                role_user: user.role_id ?? existingUser.role_id,
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
            const existingUser = await this.userRepository.findOne({ where: { user_id: user_id } });
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
            const user = await this.userRepository.findOne({ where: { user_id: user_id } });
            return user ? this.toDomain(user) : null;
        } catch (error) {
            console.error("Error fetching user by id", error);
            throw new Error("Error fetching user by id");
        }
    }

    async getUserByEmail(email: string): Promise<Users | null> {
        try {
            const user = await this.userRepository.findOne({ where: { email: email } });
            return user ? this.toDomain(user) : null;
        } catch (error) {
            console.error("Error fetching user by email", error);
            throw new Error("Error fetching user by email");
        }
    }
}
