import bcrypt from "bcryptjs";
import { UserPort } from "../domain/UsersPort";
import { Users } from "../domain/Users";
import { AuthApplication } from "./AuthApplication";

export class UsersApplication{
    private port: UserPort;

    constructor(port: UserPort){
        this.port = port;
    }

    async login(email:string, password:string):Promise<string>{
        const existingUser = await this.port.getUserByEmail(email);
        if(!existingUser){  
            throw new Error("Credenciales Inválidas");
        }

        const passwordMath= await bcrypt.compare(password, existingUser.password);
        if(!passwordMath){
            throw new Error("Invalid Credencials")
        }

        const token = AuthApplication.generateToken({
            id: existingUser.user_id,
            email: existingUser.email
        });

        return token; 
    }
    
    async createUser(user: Omit<Users,"user_id">): Promise<number>{
        const existingUser = await this.port.getUserByEmail(user.email);
        if(!existingUser){
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
        return await this.port.updateUser(user_id,user);
    }

    async deleteUser(user_id:number): Promise<boolean>{
        const existingUser = await this.port.getUserById(user_id);
        if(!existingUser){
            throw new Error("No se encntró el usuario");
        }
        return await this.port.deleteUser(user_id);
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