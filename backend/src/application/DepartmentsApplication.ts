import { Departments } from "../domain/domain/Departments"
import { DepartmentsPort } from '../domain/DepartmentsPort';

export class DepartmentsApplication {
    private port: DepartmentsPort;

    constructor(port: DepartmentsPort) {
        this.port = port;
    }

    async createDepartment(department:Omit<Departments, "department_id">):Promise<number>{
        const existingDepartment = await this.port.getDepartmentByName(department.department_name)
        if(!existingDepartment){
            return await this.port.createDepartment(department);
        }
        throw new Error("El departamento ya existe");
    }

    async updateDepartment(department_id:number, department:Partial<Departments>):Promise<boolean>{
        const existingDepartment= await this.port.getDepartmentById(department_id);
        if(!existingDepartment){
            throw new Error("El departamento no existe")
        }

        if(department.department_name){
            const department_nameTaken = await this.port.getDepartmentByName(department.department_name);
            if(department_nameTaken && department_nameTaken.department_id !== department_id){
                throw new Error("Error en actualizar el nombre NO SE PUEDE!")
            }
        }
        return await this.port.updateDepartment(department_id,department);
    }

    async deleteDepartment(department_id:number): Promise<boolean>{
        const existingDepartment = await this.port.getDepartmentById(department_id);
        if(!existingDepartment){
            throw new Error("No se encontró el departamento");
        }
        return await this.port.deleteDepartment(department_id);

    }

    async getDepartmentById(department_id:number): Promise<Departments | null>{
        return await this.port.getDepartmentById(department_id);

    }

    async getDepartmentByName(department_name:string): Promise<Departments | null>{
        return await this.port.getDepartmentByName(department_name);
    }

    async getAllDepartments(): Promise <Departments[]>{
        return await this.port.getAllDepartments();
    }
    
}