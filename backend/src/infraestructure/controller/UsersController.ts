import { UserApplication } from "../../application/UsersApplication";
import {Users} from "../../domain/Users";
import {Request, Response} from "express";

export class UserController{
    private app: UserApplication;
    constructor(app: UserApplication){
        this.app = app;
    }

    async registerUser(request: Request, response: Response): Promise <Response>{
        const { name, lastname, doc_type, doc_number, address, phone,
             department, city, email, password, role } = request.body;
             try {
                // Validaciones
                const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,}$/;
                if (!nameRegex.test(name?.trim()))
                    return response.status(400).json({ message: "Nombre inválido" });
    
                if (!nameRegex.test(lastname?.trim()))
                    return response.status(400).json({ message: "Apellido inválido" });
    
                const docTypeRegex = /^(CC|CE|TI|PP)$/; // ejemplo
                if (!docTypeRegex.test(doc_type))
                    return response.status(400).json({ message: "Tipo de documento inválido" });
    
                const docNumberRegex = /^\d{6,15}$/;
                if (!docNumberRegex.test(doc_number))
                    return response.status(400).json({ message: "Número de documento inválido" });
    
                const addressRegex = /^.{5,100}$/;
                if (!addressRegex.test(address?.trim()))
                    return response.status(400).json({ message: "Dirección inválida" });
    
                const phoneRegex = /^[0-9]{7,15}$/;
                if (!phoneRegex.test(phone))
                    return response.status(400).json({ message: "Teléfono inválido" });
    
                if (!nameRegex.test(department?.trim()))
                    return response.status(400).json({ message: "Departamento inválido" });
    
                if (!nameRegex.test(city?.trim()))
                    return response.status(400).json({ message: "Ciudad inválida" });
    
                const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
                if (!emailRegex.test(email))
                    return response.status(400).json({ message: "Correo electrónico no válido" });
    
                const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,25}$/;
                if (!passwordRegex.test(password))
                    return response.status(400).json({
                        message: "La contraseña debe tener entre 6 y 25 caracteres, incluir al menos una letra y un número"
                    });
    
                const roleRegex = /^(admin|user|manager)$/; // ejemplo de roles
                if (!roleRegex.test(role))
                    return response.status(400).json({ message: "Rol inválido" });
    
                const user: Omit<Users, "id"> = {
                    name, lastname, doc_type, doc_number, address,
                    phone, department, city, email, password, role
                };
                const userId = await this.app.createUser(user);
                return response
                    .status(201)
                    .json({ message: "Usuario registrado correctamente", userId });
            } catch (error) {
                if (error instanceof Error) {
                    return response.status(500).json({ message: "error en servidor" });
                }
            }
            return response.status(400).json({ message: "error en la petición" });
        }
    async searchUserById(request:Request, response: Response): Promise<Response>{
    try {
        const userId = parseInt(request.params.id);
        if(isNaN(userId))
            return response.status(400).json({message:"error en parámetro"});
        const user = await this.app.getUserById(userId);
        if(!user){
            return response.status(404).json({message:"Usuario no existe"});
        }
        return response.status(200).json(user);
    } catch (error) {
        if (error instanceof Error){
            return response.status(500).json({message:"error en servidor"});
        }
    }
    return response.status(400).json({message:"error en la petición"});
 }
 
 async searchUserByEmail(request:Request, response: Response): Promise<Response>{
    try {
        const {email} = (request.params);
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
                return response.status(400).json({ message: "Correo electrónico no válido" });
        const user = await this.app.getUserByEmail(email);
        if(!user){
            return response.status(404).json({message:"Usuario no existe"});
        }
        return response.status(200).json(user);
    } catch (error) {
        if (error instanceof Error){
            return response.status(500).json({message:"error en servidor"});
        }
    }
    return response.status(400).json({message:"error en la petición"});
 }

 async allUsers(request:Request, response: Response): Promise<Response>{
    try {
        const users = await this.app.getAllUsers();
        return response.status(200).json(users);
    } catch (error) {
        if (error instanceof Error){
            return response.status(500).json({message:"error en servidor"});
        }
       
    }
    return response.status(400).json({message:"error en la petición"});
 }

 async downUser(request:Request, response: Response): Promise<Response>{
    try {
        const userId = parseInt(request.params.id);
        if(isNaN(userId))
            return response.status(400).json({message:"error en parámetro"})
        const user = await this.app.deleteUser(userId);
        if(!user){
            return response.status(404).json({message:"Usuario no existe"})
        }
        return response.status(200).json(user);
    } catch (error) {
        if (error instanceof Error){
            return response.status(500).json({message:"error en servidor"});
        }
    }
    return response.status(400).json({message:"error en la petición"});
 }

 async updateUser(request: Request, response: Response): Promise <Response>{
    try {
        const userId = parseInt(request.params.id);
        if (isNaN(userId))
            return response.status(400).json({ message: "error en parámetro" });

        let { name, lastname, doc_type, doc_number, address, phone,
            department, city, email, password, role } = request.body;

        // Validaciones antes de actualizar
        const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,}$/;

        if (name && !nameRegex.test(name.trim()))
            return response.status(400).json({ message: "Nombre inválido" });

        if (lastname && !nameRegex.test(lastname.trim()))
            return response.status(400).json({ message: "Apellido inválido" });

        const docTypeRegex = /^(CC|CE|TI|PP)$/;
        if (doc_type && !docTypeRegex.test(doc_type))
            return response.status(400).json({ message: "Tipo de documento inválido" });

        const docNumberRegex = /^\d{6,15}$/;
        if (doc_number && !docNumberRegex.test(doc_number))
            return response.status(400).json({ message: "Número de documento inválido" });

        const addressRegex = /^.{5,100}$/;
        if (address && !addressRegex.test(address.trim()))
            return response.status(400).json({ message: "Dirección inválida" });

        const phoneRegex = /^[0-9]{7,15}$/;
        if (phone && !phoneRegex.test(phone))
            return response.status(400).json({ message: "Teléfono inválido" });

        if (department && !nameRegex.test(department.trim()))
            return response.status(400).json({ message: "Departamento inválido" });

        if (city && !nameRegex.test(city.trim()))
            return response.status(400).json({ message: "Ciudad inválida" });

        const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
        if (email && !emailRegex.test(email.trim()))
            return response.status(400).json({ message: "Correo electrónico no válido" });

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,25}$/;
        if (password && !passwordRegex.test(password.trim()))
            return response.status(400).json({
                message: "La contraseña debe tener entre 6 y 25 caracteres, incluir al menos una letra y un número"
            });

        const roleRegex = /^(admin|user|manager)$/;
        if (role && !roleRegex.test(role))
            return response.status(400).json({ message: "Rol inválido" });

        const updated = await this.app.updateUser(userId, {
            name, lastname, doc_type, doc_number, address,
            phone, department, city, email, password, role
        });

        if (!updated)
            return response.status(404).json({ message: "Usuario no encontrado o sin cambios" });

        return response.status(200).json({ message: "Usuario actualizado con éxito" });
    } catch (error) {
        if (error instanceof Error)
            return response.status(500).json({ message: "error en servidor" });
    }
    return response.status(400).json({ message: "error en la petición" });
}
} 