import { Repository } from "typeorm";
import { Departments } from '../../domain/entities/Departments';
import { DepartmentsPort } from "../../domain/port/DepartmentsPort";
import { DepartmentsEntity } from '../entities/DepartmentsEntity';
import { AppDataSource } from "../config/con_data_bases";


export class DepartmentsAdapter implements DepartmentsPort{
    private departmentRepository: Repository<DepartmentsEntity>;

    constructor(){
        this.departmentRepository = AppDataSource.getRepository(DepartmentsEntity);
    }
    private toDomain(department:DepartmentsEntity):Departments{
     return{
        department_id: department.department_id,
        department_name: department.department_name,
     }   
    }

    private toEntity(department: Omit<Departments, "department_id">): DepartmentsEntity{
        const departmentsEntity = new DepartmentsEntity();
        departmentsEntity.department_name = department.department_name;       
        return departmentsEntity;
    }

    async createDepartment(department: Omit<Departments, "department_id">): Promise<number> {
        try{
            const newDepartment = this.toEntity(department);
            const savedDepartment = await this.departmentRepository.save(newDepartment);
            return savedDepartment.department_id;
        }catch (error){
            console.error("Error creating department ", error);
            throw new Error("Error creating department")
        }
    }
    async updateDepartment(department_id: number, department: Partial<Departments>): Promise<boolean> {
        try {
            const existingDepartment = await this.departmentRepository.findOne({where:{department_id:department_id}});
            if(!existingDepartment){
                throw new Error("Department not found");
            }
           
            Object.assign( existingDepartment,{
             department_name: department.department_name ?? existingDepartment.department_name
            });
            await this.departmentRepository.save(existingDepartment);
            return true;
        } catch (error) {
            console.error("Error updating department", error);
            throw new Error("Error updating department");
            
        }
    }
    async deleteDepartment(department_id: number): Promise<boolean> {
        try {
            const existingDepartment = await this.departmentRepository.findOne({where:{department_id:department_id}});
            if(!existingDepartment){
                throw new Error("Department not found");
            }
            await this.departmentRepository.save(existingDepartment);
            return true;
        } catch (error) {
            console.error("Error deleting department", error);
            throw new Error("Error deleting department")
        }
    }
    async getAllDepartments(): Promise<Departments[]> {
        try {
            const departments = await this.departmentRepository.find();
            return departments.map(this.toDomain);
        } catch (error) {
            console.error("Error featching all departments ", error);
            throw new Error("Error featching all departments")
        }
    }
    async getDepartmentById(department_id: number): Promise<Departments | null> {
        try {
            const department = await this.departmentRepository.findOne({where:{department_id:department_id}});
            return department ? this.toDomain(department): null
        } catch (error) {
            console.error("Error featching department by id ", error);
            throw new Error("Error featching department by id");
        }
    }
    async getDepartmentByName(department_name: string): Promise<Departments | null> {
        try {
            const department = await this.departmentRepository.findOne({where:{department_name:department_name}});
            return department ? this.toDomain(department): null
        } catch (error) {
            console.error("Error featching department by name ", error);
            throw new Error("Error featching department by name");
        }

    }

}