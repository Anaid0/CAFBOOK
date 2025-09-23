import bcrypt from "bcryptjs";
import { UserPort } from "../domain/port/UsersPort";
import { Users } from "../domain/entities/Users";
import { AuthApplication } from "./AuthApplication";

export class UsersApplication{
    private port: UserPort;

    constructor(port: UserPort){
        this.port = port;
    }

    async login(email: string, password: string): Promise<{ token: string; id: number }> {
    const existingUser = await this.port.getUserByEmail(email);
    if (!existingUser) {
        throw new Error("Credenciales inválidas");
    }

    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
        throw new Error("Credenciales inválidas");
    }

    if(existingUser.status === 0){
        throw new Error("Usuario deshabilitado, comunicate con el admin para recuperarla")
    }

    const token = AuthApplication.generateToken({
        id: existingUser.user_id,
        email: existingUser.email
    });

    return { token, id: existingUser.user_id };
}

    
    async createUser(user: Omit<Users,"user_id" | "role_description" | "doc_type_description">): Promise<number>{
        const existingUser = await this.port.getUserByEmail(user.email);
        if(!existingUser){
            const hashedPass= await bcrypt.hash(user.password, 10);
            user.password = hashedPass;
            return await this.port.createUser(user);
        }
        throw new Error("Ya existe un usuario asociado a este email");
    }
 
    async updateUser(user_id:number, user: Partial<Users>): Promise<boolean>{
        const existingUser = await this.port.getUserById(user_id);
        if(!existingUser){
            throw new Error("El usuario no existe");
        }
        if(user.email){
            const emailTaken = await this.port.getUserByEmail(user.email)
            if(emailTaken && emailTaken.user_id !==user_id){
                throw new Error("Error, no se puede actualizar el email")
            }
        }
        if(user.password){
            const hashedPass= await bcrypt.hash(user.password, 10);
            user.password = hashedPass;
        }
        return await this.port.updateUser(user_id,user);
    }

    async deleteUser(user_id:number): Promise<boolean>{
        const existingUser = await this.port.getUserById(user_id);
        if(!existingUser){
            throw new Error("No se encntró el usuario");
        }
        return await this.port.deleteUser(user_id);
    }

    async restoreUser(user_id:number): Promise<boolean>{
        const existingUser = await this.port.getUserById(user_id);
        if(!existingUser){
            throw new Error("No se encntró el usuario");
        }
        return await this.port.restoreUser(user_id);
    }

    //Consultas get
    async getUserById(user_id:number): Promise <Users | null>{
        return await this.port.getUserById(user_id);
    }

    async getUserByEmail(email:string): Promise <Users | null>{
        return await this.port.getUserByEmail(email);
    }

    async getAllUsers(): Promise<Users[]>{
        return await this.port.getAllUsers();
    }
}