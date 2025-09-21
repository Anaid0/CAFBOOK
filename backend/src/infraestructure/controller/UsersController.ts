import { UsersApplication } from "../../application/UsersApplication";
import {Request, Response} from "express";
import { Validators } from "../config/validations";
import { Users } from "../../domain/Users";

export class UsersController{
    private app: UsersApplication;

    constructor(app: UsersApplication){
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

    async registerUser(request: Request, response: Response): Promise <Response>{
        const { firts_name, last_name, document_number, email, password, doc_type_id } = request.body;
        try{

            if(!Validators.name(firts_name))
                return response.status(400).json({message: "Nombres inválido"});

            if(!Validators.name(last_name))
                return response.status(400).json({message: "Apellidos inválido"});

            if(!Validators.document(document_number))
                return response.status(400).json({message: "Número de documento inválido"});

            if(!Validators.email(email))
                return response.status(400).json({message: "Correo inválido"});

            if(!Validators.password(password))
                return response.status(400).json({message:"La contraseña debe tener entre 6 y 25 caracteres, incluyendo al menos una letra y un número"});
        
            const user: Omit<Users, "user_id" | "role_description" | "doc_type_description" | "photo_url"> = {
                firts_name, last_name, document_number, doc_type_id, email, password, role_id: 1, status: 1, created_at: new Date()
            };
            const user_id = await this.app.createUser(user);

            return response.status(201).json({message:"Usuario creado exitosamente:", user_id});
        }catch(error){

            if(error instanceof Error){
                return response.status(500).json({message:"Error en el servidor"});
            }
        }
        return response.status(400).json({message:"Error en la petición"});
    }

    async searchUserById (request: Request, response: Response): Promise<Response>{
        try{
            const user_id = parseInt(request.params.id);
            if(isNaN(user_id)) return response.status(400).json({message:"Error en parámetro"});
            const user = await this.app.getUserById(user_id);
            if(!user) return response.status(404).json({message:"Usuario no encontrado"});

            return response.status(200).json(user);
        
        }catch(error){
            if(error instanceof Error){
                return response.status(500).json({message:"Error en el servidor"});
            }
        }
        return response.status(400).json({message:"Error en la petición"});
    }

    async searchUserByEmail (request: Request, response: Response): Promise<Response>{
        try{
            const {email}= (request.params);
            if(!Validators.email(email))
                return response.status(400).json({ error: "Correo electrónico no válido" });
 
            const user = await this.app.getUserByEmail(email);
            if(!user) return response.status(404).json({message:"Usuario no encontrado"});

            return response.status(200).json(user);
        
        }catch(error){
            if(error instanceof Error){
                return response.status(500).json({message:"Error en el servidor"});
            }
        }
        return response.status(400).json({message:"Error en la petición"});
    }

    async allUsers (request: Request, response: Response): Promise<Response>{
        try{
            const users = await this.app.getAllUsers();
            return response.status(200).json(users)
        }catch(error){
            if(error instanceof Error){
                return response.status(500).json({message:"Error en el servidor"});
            }
        }
        return response.status(400).json({message:"Error en la petición"});
    }

    async downdUser(request: Request, response: Response): Promise<Response>{
        try{
            const user_id = parseInt(request.params.id);
            if(isNaN(user_id)) return response.status(400).json({message:"Error en parámetro"});
            const user = await this.app.deleteUser(user_id);
            if(!user) return response.status(404).json({message:"Usuario no encontrado"});

            return response.status(200).json(user);
        
        }catch(error){
            if(error instanceof Error){
                return response.status(500).json({message:"Error en el servidor"});
            }
        }
        return response.status(400).json({message:"Error en la petición"});
    }

        async restoreUser(request: Request, response: Response): Promise<Response>{
        try{
            const user_id = parseInt(request.params.id);
            if(isNaN(user_id)) return response.status(400).json({message:"Error en parámetro"});
            const user = await this.app.restoreUser(user_id);
            if(!user) return response.status(404).json({message:"Usuario no encontrado"});

            return response.status(200).json(user);
        
        }catch(error){
            if(error instanceof Error){
                return response.status(500).json({message:"Error en el servidor"});
            }
        }
        return response.status(400).json({message:"Error en la petición"});
    }
    
    async updateUser(request: Request, response: Response): Promise<Response>{
        try{
            const userId = parseInt(request.params.id);
            if(isNaN(userId)) return response.status(400).json({message:"Error en parámetro"});
            
            let { firts_name, last_name, document_number, email, password, doc_type_id, } = request.body;

             // Validaciones antes de actualizar
            if (firts_name && !Validators.name(firts_name)) 
                return response.status(400).json({message:"El nombre debe tener al menos 3 caracteresponse y solo contener letras",
            });

            if (last_name && !Validators.name(last_name)) 
                return response.status(400).json({message:"El apellido debe tener al menos 3 caracteresponse y solo contener letras",
            });

            if (document_number && !Validators.document(document_number)) 
                return response.status(400).json({message:"número de documento debe ser váido",
            });
 
            if (email && !Validators.email(email))
                return response.status(400).json({ error: "Correo electrónico no válido" });
 
            if (password && !Validators.password(password))
                return response.status(400).json({message:"La contraseña debe tener al menos 6 caracteres, incluyendo al menos una letra y un número"});
      
      const updated = await this.app.updateUser(userId,{firts_name, last_name, document_number, email, password, doc_type_id, status: 1});
      if(!updated) return response.status(404).json({message: "Usuario no encontrado o sin cambios"});

      return response.status(200).json({message:"Usuaurio actualizaco exitosamente"})
 
        }catch(error){
            if(error instanceof Error){
                return response.status(500).json({message:"Error en el servidor"});
            }
        }
        return response.status(400).json({message:"Error en la petición"});
    }
}