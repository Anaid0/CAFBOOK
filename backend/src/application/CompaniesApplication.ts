import bcrypt from "bcryptjs";
import { CompaniesPort } from "../domain/ports/CompaniesPort";
import { AuthApplication } from "./AuthApplication";
import { Companies } from "../domain/domain/Companies";

export class CompaniesApplication{
    private port: CompaniesPort;

    constructor(port:CompaniesPort){
        this.port = port;
    }

    async login(email:string, password:string):Promise<string>{
            const existingCompany = await this.port.getCompanyByEmail(email);
            if(!existingCompany){  
                throw new Error("Credenciales Inválidas");
            }
    
            const passwordMath= await bcrypt.compare(password, existingCompany.password);
            if(!passwordMath){
                throw new Error("Invalid Credencials")
            }
    
            const token = AuthApplication.generateToken({
                id: existingCompany.company_id,
                email: existingCompany.email
            });
    
            return token; 
        }
        
    async createCompany(company: Omit<Companies,"company_id"| "role_description" | "doc_type_description">): Promise<number>{
        const existingCompany = await this.port.getCompanyByEmail(company.email);
        if(!existingCompany){
            const hashedPass= await bcrypt.hash(company.password, 10);
            company.password = hashedPass;
            return await this.port.createCompany(company);
        }
        throw new Error("Ya existe una empresa asociado a este email");
    }
     
    async updateCompany(company_id:number, company: Partial<Companies>): Promise<boolean>{
        const existingCompany = await this.port.getCompanyById(company_id);
        if(!existingCompany){
            throw new Error("La empresa no existe");
        }
        if(company.email){
            const emailTaken = await this.port.getCompanyByEmail(company.email)
            if(emailTaken && emailTaken.company_id !==company_id){
                throw new Error("Error, no se puede actualizar el email")
            }
        }
        return await this.port.updateCompany(company_id,company);
    }
    
    async deleteCompany(company_id:number): Promise<boolean>{
        const existingUser = await this.port.getCompanyById(company_id);
        if(!existingUser){
            throw new Error("No se encntró la empresa");
        }
        return await this.port.deleteCompany(company_id);
    }

    async restoreCompany(company_id:number): Promise<boolean>{
        const existingUser = await this.port.getCompanyById(company_id);
        if(!existingUser){
            throw new Error("No se encntró la empresa");
        }
        return await this.port.restoreCompany(company_id);
    } 

    async getCompanyById(company_id:number): Promise <Companies | null>{
        return await this.port.getCompanyById(company_id);
    }
    
    async getCompanyByEmail(email:string): Promise <Companies | null>{
        return await this.port.getCompanyByEmail(email);
    }
    
    async getAllCompanies(): Promise<Companies[]>{
        return await this.port.getAllCompanies();
    }
}