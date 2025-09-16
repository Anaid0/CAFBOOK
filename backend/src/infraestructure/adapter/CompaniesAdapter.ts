import { Repository } from "typeorm";
import { CompaniesPort } from "../../domain/CompaniesPort";
import { AppDataSource } from "../config/con_data_bases";
import { CompaniesEntity } from "../entities/CompaniesEntity";
import { Companies } from "../../domain/Companies";
import { RolesEntity } from "../entities/RolesEntity";
import { Document_typesEntity } from "../entities/Document_typesEntity";
import { x } from "joi";

export class CompaniesAdapter implements CompaniesPort{
    private companiesRepository: Repository<CompaniesEntity>

    constructor(){
        this.companiesRepository = AppDataSource.getRepository(CompaniesEntity);
    }

    private toDomain(company: CompaniesEntity): Companies{
        return{
            company_id: company.company_id,
            bussines_name: company.bussines_name,
            document_number: company.document_number,
            profession: company.profession,
            years_experience: company.years_experience,
            email: company.email,
            password: company.password,
            status: company.status,
            created_at: company.created_at,
            role_id: company.role_id.role_id,
            doc_type_id: company.doc_type_id.doc_type_id
        }
    }

    private toEntity(company: Omit<Companies, "company_id">): CompaniesEntity{
        const companyEntity = new CompaniesEntity();
        const rolesEntity = new RolesEntity();
        const document_type = new Document_typesEntity();

        rolesEntity.role_id = company.role_id;
        document_type.doc_type_id = company.doc_type_id;
        companyEntity.bussines_name = company.bussines_name;
        companyEntity.document_number = company.document_number;
        companyEntity.profession = company.profession;
        companyEntity.years_experience = company.years_experience;
        companyEntity.email = company.email;
        companyEntity.password = company.password;
        companyEntity.status = company.status;
        companyEntity.created_at = company.created_at;
        companyEntity.role_id = rolesEntity;
        companyEntity.doc_type_id = document_type;
        return companyEntity;
    }

    async createCompany(company: Omit<Companies, "company_id">): Promise<number> {
        try{
            const newCompany = this.toEntity(company);
            const savedCompany = await this.companiesRepository.save(newCompany);
            return savedCompany.company_id;
        }catch(error){
            console.error("Error creating company", error);
            throw new Error("Error creating company");
        }
    }

    async updateCompany(company_id: number, company: Partial<Companies>): Promise<boolean> {
        try{
            const existingCompany = await this.companiesRepository.findOne({where:{company_id:company_id}});
            if (!existingCompany){
                throw new Error("Company not found");
            }

            if(company.doc_type_id){
                const doc_type_id = new Document_typesEntity();
                doc_type_id.doc_type_id = company.doc_type_id;
                existingCompany.doc_type_id = doc_type_id;
            }
            
            Object.assign(existingCompany,{
               bussines_name: company.bussines_name ??  existingCompany.bussines_name,
               profession: company.profession ?? existingCompany.profession,
               document_number: company.document_number ?? existingCompany.document_number,
               email: company.email ?? existingCompany.email,
               years_experience: company.years_experience ?? existingCompany.years_experience,
               password: company.password ?? existingCompany.password,
               doc_type_id: company.doc_type_id ?? existingCompany.doc_type_id,
               status: 1,
            });
            
            await this.companiesRepository.save(existingCompany);
            return true;
        }catch(error){
            console.error("Error deleting all companies", error);
            throw new Error("Error deleting all companies");
        }
    }

    async deleteCompany(company_id: number): Promise<boolean> {
        try{
            const existingCompany = await this.companiesRepository.findOne({where:{company_id:company_id}});
            if (!existingCompany){
                throw new Error("User not found");
            }
            Object.assign(existingCompany, {
                status: 0
            });
            await this.companiesRepository.save(existingCompany);
            return true;
        }catch(error){
            console.error("Error deleting all companies", error);
            throw new Error("Error deleting all companies");
        }
    }

    async getAllCompanies(): Promise<Companies[]> {
        try{
            const companies = await this.companiesRepository.find({relations:["role_id", "doc_type_id"]});
            return companies.map(this.toDomain);
        }catch(error){
            console.error("Error fetching all companies", error);
            throw new Error("Error fetching all companies");
        }
    }

    async getCompanyById(company_id: number): Promise<Companies | null> {
        try{
            const company = await this.companiesRepository.findOne({relations:["role_id", "doc_type_id"], where:{company_id:company_id}});
            return company ? this.toDomain(company): null;
        }catch(error){
            console.error("Error fetching all companies", error);
            throw new Error("Error fetching all companies");
        }
    }

    async getCompanyByEmail(email: string): Promise<Companies | null> {
        try{
            const company = await this.companiesRepository.findOne({relations:["role_id", "doc_type_id"], where:{email:email}});
            return company ? this.toDomain(company): null;
        }catch(error){
            console.error("Error fetching all companies", error);
            throw new Error("Error fetching all companies");
        }
    }

}