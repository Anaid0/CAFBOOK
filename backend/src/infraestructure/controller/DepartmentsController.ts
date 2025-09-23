import { DepartmentsApplication } from "../../application/DepartmentsApplication";
import { Departments } from "../../domain/entities/Departments";
import {Request, Response} from "express";
import { Validators } from "../config/validations";

export class DepartmentsController{
    private app: DepartmentsApplication;
    constructor(app: DepartmentsApplication){
        this.app = app;
    }

    async registerDepartment(request: Request, response: Response): Promise <Response>{
        const { department_name } = request.body;
        try{

            if(!Validators.name(department_name))
                return response.status(400).json({message: "nombre departamento inválida"});
        
            const department: Omit<Departments, "department_id"> = {department_name};
            const departmentId = await this.app.createDepartment(department);

            return response.status(201).json({message:"Departamento creado exitosamente:", departmentId});
        }catch(error){

            if(error instanceof Error){
                return response.status(500).json({message:"Error en el servidor"});
            }
        }
        return response.status(400).json({message:"Error en la petición"});
    }

    async searchDepartmentById (request: Request, response: Response): Promise<Response>{
        try{
            const departmentId = parseInt(request.params.id);
            if(isNaN(departmentId)) return response.status(400).json({message:"Error en parámetro"});
            const department = await this.app.getDepartmentById (departmentId);
            if(!department) return response.status(404).json({message:"Departamento no encontrado"});

            return response.status(200).json(department);
        
        }catch(error){
            if(error instanceof Error){
                return response.status(500).json({message:"Error en el servidor"});
            }
        }
        return response.status(400).json({message:"Error en la petición"});
    }

    async searchDepartmentByName (request: Request, response: Response): Promise<Response>{
        try{
            const {department_name}= (request.params);
            if(!Validators.name(department_name))
                return response.status(400).json({ error: "Nombre del Departamento no válido" });
 
            const department = await this.app.getDepartmentByName(department_name);
            if(!department) return response.status(404).json({message:"Departamento no encontrado"});

            return response.status(200).json(department);
        
        }catch(error){
            if(error instanceof Error){
                return response.status(500).json({message:"Error en el servidor"});
            }
        }
        return response.status(400).json({message:"Error en la petición"});
    }

    async allDepartments (request: Request, response: Response): Promise<Response>{
        try{
            const departments = await this.app.getAllDepartments();
            return response.status(200).json(departments)
        }catch(error){
            if(error instanceof Error){
                return response.status(500).json({message:"Error en el servidor"});
            }
        }
        return response.status(400).json({message:"Error en la petición"});
    }

    async downDepartment(request: Request, response: Response): Promise<Response>{
        try{
            const departmentId = parseInt(request.params.id);
            if(isNaN(departmentId)) return response.status(400).json({message:"Error en parámetro"});
            const department = await this.app.deleteDepartment(departmentId);
            if(!department) return response.status(404).json({message:"Departamento no encontrado"});

            return response.status(200).json(department);
        
        }catch(error){
            if(error instanceof Error){
                return response.status(500).json({message:"Error en el servidor"});
            }
        }
        return response.status(400).json({message:"Error en la petición"});
    }
    
    async updateDepartment(request: Request, response: Response): Promise<Response>{
        try{
            const departmentId = parseInt(request.params.id);
            if(isNaN(departmentId)) return response.status(400).json({message:"Error en parámetro"});
            
            let { department_name } = request.body;

             
            if (department_name && !Validators.name(department_name)) 
                return response.status(400).json({message:"El Nombre solo debe contener letras",
            });
 
      
      const updated = await this.app.updateDepartment(departmentId,{department_name});
      if(!updated) return response.status(404).json({message: "Departamento no encontrado o sin cambios"});

      return response.status(200).json({message:"Departamento actualización exitosamente"})
 
        }catch(error){
            if(error instanceof Error){
                return response.status(500).json({message:"Error en el servidor"});
            }
        }
        return response.status(400).json({message:"Error en la petición"});
    }
}