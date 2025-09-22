import { AdminApplication } from "../../application/AdminApplication";
import {Request, Response} from "express";
import { Validators } from "../config/validations";
import { Admin } from '../../domain/Admin';

export class AdminController{
    private app: AdminApplication;

    constructor(app: AdminApplication){
        this.app = app;
    }

async login(req: Request, res: Response): Promise<string | Response>{
    try {
      const { email, password } = req.body;
      if (!email || !password)
        return res.status(400).json({ message: "Email y contraseña son requeridos" });
 
      // Validación de email
      if (!Validators.email(email))
        return res.status(400).json({ message: "Correo electrónico no válido" });
 
      // Validación de contraseña
      if (!Validators.password(password))
        return res.status(400).json({
          message:
            "La contraseña debe tener al menos 6 caracteres y máximo 25, incluyendo al menos una letra y un número",
        });
 
      const token = await this.app.login(email, password);
      return res.status(200).json({ token });
     
    } catch (error) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }
  }

    async registerAdmin(request: Request, response: Response): Promise <Response>{
        const { email, password} = request.body;
        try{

            if(!Validators.email(email))
                return response.status(400).json({message: "Correo inválido"});

            if(!Validators.password(password))
                return response.status(400).json({message:"La contraseña debe tener entre 6 y 25 caracteres, incluyendo al menos una letra y un número"});
        
            const admin: Omit<Admin, "admin_id"> = {
                email, password
            };
            const user_id = await this.app.createAdmin(admin);

            return response.status(201).json({message:"Usuario creado exitosamente:", user_id});
        }catch(error){

            if(error instanceof Error){
                return response.status(500).json({message:"Error en el servidor"});
            }
        }
        return response.status(400).json({message:"Error en la petición"});
    }

    async searchAdminById(request: Request, response: Response): Promise<Response>{
        try{
            const admin_id = parseInt(request.params.id);
            if(isNaN(admin_id)) return response.status(400).json({message:"Error en parámetro"});
            const user = await this.app.getAdminById(admin_id);
            if(!user) return response.status(404).json({message:"Admin no encontrado"});

            return response.status(200).json(user);
        
        }catch(error){
            if(error instanceof Error){
                return response.status(500).json({message:"Error en el servidor"});
            }
        }
        return response.status(400).json({message:"Error en la petición"});
    }

    async searchAdminByEmail(request: Request, response: Response): Promise<Response>{
        try{
            const {email}= (request.params);
            if(!Validators.email(email))
                return response.status(400).json({ error: "Correo electrónico no válido" });
 
            const user = await this.app.getAdminByEmail(email);
            if(!user) return response.status(404).json({message:"Admin no encontrado"});

            return response.status(200).json(user);
        
        }catch(error){
            if(error instanceof Error){
                return response.status(500).json({message:"Error en el servidor"});
            }
        }
        return response.status(400).json({message:"Error en la petición"});
    }

    async allAdmins(request: Request, response: Response): Promise<Response>{
        try{
            const admins = await this.app.getAllAdmins();
            return response.status(200).json(admins)
        }catch(error){
            if(error instanceof Error){
                return response.status(500).json({message:"Error en el servidor"});
            }
        }
        return response.status(400).json({message:"Error en la petición"});
    }

    async downdUser(request: Request, response: Response): Promise<Response>{
        try{
            const admin_id = parseInt(request.params.id);
            if(isNaN(admin_id)) return response.status(400).json({message:"Error en parámetro"});
            const user = await this.app.deleteAdmin(admin_id);
            if(!user) return response.status(404).json({message:"Admin no encontrado"});

            return response.status(200).json(user);
        
        }catch(error){
            if(error instanceof Error){
                return response.status(500).json({message:"Error en el servidor"});
            }
        }
        return response.status(400).json({message:"Error en la petición"});
    }
    
    async updateAdmin(request: Request, response: Response): Promise<Response>{
        try{
            const adminId = parseInt(request.params.id);
            if(isNaN(adminId)) return response.status(400).json({message:"Error en parámetro"});
            
            let { email, password } = request.body;
 
            if (email && !Validators.email(email))
                return response.status(400).json({ error: "Correo electrónico no válido" });
 
            if (password && !Validators.password(password))
                return response.status(400).json({message:"La contraseña debe tener al menos 6 caracteres, incluyendo al menos una letra y un número"});
      
      const updated = await this.app.updateAdmin(adminId,{email, password});
      if(!updated) return response.status(404).json({message: "Admin no encontrado o sin cambios"});

      return response.status(200).json({message:"Usuaurio actualizaco exitosamente"})
 
        }catch(error){
            if(error instanceof Error){
                return response.status(500).json({message:"Error en el servidor"});
            }
        }
        return response.status(400).json({message:"Error en la petición"});
    }
}