import { Companies } from "../domain/Companies";
import { CompaniesPort } from "../domain/CompaniesPort";


export class CompaniesApplication{
    private port: CompaniesPort;

    constructor(port: CompaniesPort){
        this.port = port;
    }
    async createCompany(company:Omit<Companies,"company_id">):Promise<number>{
        const existingCompany= await this.port.getCompanyByEmail(company.email);
        if(!existingCompany){
            return await this.port.createCompany(company);
        }
        throw new Error("La compañia ya existe");
    }

    async updateCompany(company_id:number, company:Partial<Companies>):Promise<boolean>{
        const existingCompany= await this.port.getCompanyById(company_id);
        if(!existingCompany){
            throw new Error("La compañia no existe")
        }

        if(company.email){
            const emailTaken = await this.port.getCompanyByEmail(company.email);
            if(emailTaken && emailTaken.company_id !== company_id){
                throw new Error("Error en actualizar el email NO SE PUEDE!")
            }
        }
        return await this.port.updateCompany(company_id,company);
    }

    async deleteCompany(company_id:number): Promise<boolean>{
        const existingCompany = await this.port.getCompanyById(company_id);
        if(!existingCompany){
            throw new Error("No se encontró la compañia");
        }
        return await this.port.deleteCompany(company_id);

    }

    //consultas get
    async getCompanyById(company_id:number): Promise<Companies | null>{
        return await this.port.getCompanyById(company_id);

    }

    async getCompanyByEmail(email:string): Promise<Companies | null>{
        return await this.port.getCompanyByEmail(email);
    }

    async getAllCompanies(): Promise <Companies[]>{
        return await this.port.getAllCompanies();
    }
}