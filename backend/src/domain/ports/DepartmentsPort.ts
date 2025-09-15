import { Departments } from "../models/Departments";
export interface DepartmentsPort{
     createDepartment(department: Omit<Departments,"department_id">): Promise<number>;
     updateDepartment(department_id:number, roles:Partial<Departments>):Promise<boolean>;
     deleteDepartment(department_id:number): Promise<boolean>;
     getAllDepartments(): Promise<Departments[]>;
     getDepartmentById(department_id:number): Promise<Departments | null>;
     getDepartmentByName(department_name:string): Promise <Departments | null>;

}