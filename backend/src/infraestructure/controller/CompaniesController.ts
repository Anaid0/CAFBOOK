import { CompaniesApplication } from "../../application/CompaniesApplication";
import { Companies } from "../../domain/Companies";
import { Validators } from "../config/validations";
import {Request, Response} from "express";

export class CompaniesController{
    private app: CompaniesApplication;

    constructor(app: CompaniesApplication){
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
              message:"La contraseña debe tener al menos 6 caracteres y máximo 25, incluyendo al menos una letra y un número",
            });
     
        const token = await this.app.login(email, password);
        return res.status(200).json({ token });
         
        } catch (error) {
          return res.status(401).json({ message: "Credenciales inválidas" });
        }
    }

async registerCompany(request: Request, response: Response): Promise<Response> {
    try {
    const { bussines_name, document_number, profession, email, password, doc_type_id, years_experience } = request.body;

    if (!Validators.name(bussines_name))
        return response.status(400).json({ message: "Nombre de empresa inválido" });
            
    if (!Validators.name(profession))
        return response.status(400).json({ message: "Profesión inválida" });
            
    if (!Validators.email(email))
        return response.status(400).json({ message: "Correo inválido" });

    if (!Validators.password(password))
        return response.status(400).json({message:"La contraseña debe tener entre 6 y 25 caracteres, incluyendo al menos una letra y un número",
      });

    const photo_url = request.file ? request.file.path : null;

    const company: Omit<Companies, "company_id" | "role_description" | "doc_type_description"> = {bussines_name, profession, document_number,doc_type_id, email, password, years_experience, photo_url, role_id: 2, status: 1, created_at: new Date(),
    };

    const user_id = await this.app.createCompany(company);

    return response.status(201).json({
      message: "Empresa creada exitosamente",
      user_id,
      photo_url,
    });
  } catch (error) {
    console.error("Error en registerCompany:", error);
    return response.status(500).json({ message: "Error en el servidor" });
  }
}

async searchCompanyById(request: Request, response: Response): Promise<Response>{
    try{
        const company_id = parseInt(request.params.id);
        if(isNaN(company_id)) return response.status(400).json({message:"Error en parámetro"});
        const company = await this.app.getCompanyById(company_id);
        if(!company) return response.status(404).json({message:"Empresa no encontrada"});
    
        return response.status(200).json(company);
            
        }catch(error){
            if(error instanceof Error){
            return response.status(500).json({message:"Error en el servidor"});
            }
        }
        return response.status(400).json({message:"Error en la petición"});
    }
    
    async searchCompanyByEmail (request: Request, response: Response): Promise<Response>{
        try{
            const {email}= (request.params);
            if(!Validators.email(email))
                return response.status(400).json({ error: "Correo electrónico no válido" });
     
            const company = await this.app.getCompanyByEmail(email);
            if(!company) return response.status(404).json({message:"Empresa no encontrada"});
    
            return response.status(200).json(company);
            
        }catch(error){
            if(error instanceof Error){
                return response.status(500).json({message:"Error en el servidor"});
            }
        }
        return response.status(400).json({message:"Error en la petición"});
    }
    
    async allCompanies(request: Request, response: Response): Promise<Response>{
        try{
            const companies = await this.app.getAllCompanies();
            return response.status(200).json(companies)
            }catch(error){
            if(error instanceof Error){
                return response.status(500).json({message:"Error en el servidor"});
            }
        }
        return response.status(400).json({message:"Error en la petición"});
    }
    
    async downdCompany(request: Request, response: Response): Promise<Response>{
        try{
            const company_id = parseInt(request.params.id);
            if(isNaN(company_id)) return response.status(400).json({message:"Error en parámetro"});
            const company = await this.app.deleteCompany(company_id);
            if(!company) return response.status(404).json({message:"Empresa no encontrada"});
    
            return response.status(200).json(company);
            
            }catch(error){
            if(error instanceof Error){
                return response.status(500).json({message:"Error en el servidor"});
            }
        }
        return response.status(400).json({message:"Error en la petición"});
    }

    async restoreCompany(request: Request, response: Response): Promise<Response>{
        try{
            const company_id = parseInt(request.params.id);
            if(isNaN(company_id)) return response.status(400).json({message:"Error en parámetro"});
            const company = await this.app.restoreCompany(company_id);
            if(!company) return response.status(404).json({message:"Empresa no encontrada"});
    
            return response.status(200).json(company);
            
        }catch(error){
            if(error instanceof Error){
                return response.status(500).json({message:"Error en el servidor"});
            }
        }
        return response.status(400).json({message:"Error en la petición"});
    }
        
async updateCompany(request: Request, response: Response): Promise<Response> {
  try {
    const company_id = parseInt(request.params.id);
    if (isNaN(company_id)) {
      return response.status(400).json({ message: "Error en parámetro" });
    }

    let { bussines_name, document_number, profession, email, password, doc_type_id, years_experience } = request.body;

    let photo_url: string | null = null;
    if (request.file) {
      photo_url = request.file.path; 
    }

    // Validaciones
    if (bussines_name && !Validators.name(bussines_name)) {
      return response.status(400).json({
        message: "El nombre debe tener al menos 3 caracteres y solo contener letras",
      });
    }

    if (profession && !Validators.name(profession)) {
      return response.status(400).json({
        message: "La profesión debe tener al menos 3 caracteres y solo contener letras",
      });
    }

    if (document_number && !Validators.document(document_number)) {
      return response.status(400).json({
        message: "Número de documento debe ser válido",
      });
    }

    if (email && !Validators.email(email)) {
      return response.status(400).json({ error: "Correo electrónico no válido" });
    }

    if (password && !Validators.password(password)) {
      return response.status(400).json({
        message:
          "La contraseña debe tener al menos 6 caracteres, incluyendo al menos una letra y un número",
      });
    }

    const updated = await this.app.updateCompany(company_id, {
      bussines_name, document_number, profession, email, password, doc_type_id, years_experience, photo_url: photo_url ?? undefined, status: 1,
    });

    if (!updated) {
      return response
        .status(404)
        .json({ message: "Empresa no encontrada o sin cambios" });
    }

    return response.status(200).json({
      message: "Empresa actualizada exitosamente",
      photo_url: photo_url ?? "Sin cambios en la foto",
    });
  } catch (error) {
    console.error("Error en updateCompany:", error);
    return response.status(500).json({ message: "Error en el servidor" });
  }
}


}