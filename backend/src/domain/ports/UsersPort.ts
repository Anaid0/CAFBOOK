import { Users } from "../domain/Users";

export interface UserPort{
    createUser(user: Omit<Users,"user_id" | "role_description" | "doc_type_description" | "photo_url">): Promise<number>;
    updateUser(user_id:number, user:Partial<Users>):Promise<boolean>;
    deleteUser(user_id:number): Promise<boolean>;
    getAllUsers(): Promise<Users[]>;
    getUserById(user_id:number): Promise<Users | null>;
    getUserByEmail(email: string): Promise<Users | null>;
    restoreUser(user_id:number): Promise<boolean>;
}