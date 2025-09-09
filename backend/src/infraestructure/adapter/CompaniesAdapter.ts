import { Repository } from "typeorm";
import { Companies } from '../../domain/Companies';
import { CompaniesPort } from "../../domain/CompaniesPort";
import { CompaniesEntity } from "../entities/CompaniesEntity";
import { AppDataSource } from "../config/con_data_bases";

export class CompaniesAdapter implements CompaniesPort {
    private companyRepository: Repository<CompaniesEntity>;

    constructor() {
        this.companyRepository = AppDataSource.getRepository(CompaniesEntity);
    }

    private toDomain(company: CompaniesEntity): Companies {
        return {
            company_id: company.company_id_company,
            business_name: company.business_name_company,
            doc_type_id: company.doc_type_id_company,
            document_number: company.document_number_company,
            phone: company.phone_company,
            profession: company.profession_company,
            years_experience: company.years_experience_company,
            email: company.email_company,
            password: company.password_company,
            role_id: company.role_id_company,
            created_at: company.create_at,
            status: company.status
        };
    }

    private toEntity(company: Omit<Companies, "company_id">): CompaniesEntity {
        const companiesEntity = new CompaniesEntity();
        companiesEntity.business_name_company = company.business_name;
        companiesEntity.doc_type_id_company = company.doc_type_id;
        companiesEntity.document_number_company = company.document_number;
        companiesEntity.phone_company = company.phone;
        companiesEntity.profession_company = company.profession;
        companiesEntity.years_experience_company = company.years_experience;
        companiesEntity.email_company = company.email;
        companiesEntity.password_company = company.password;
        companiesEntity.role_id_company = company.role_id;
        return companiesEntity;
    }

    async createCompany(company: Omit<Companies, "company_id">): Promise<number> {
        try {
            const newcompany = this.toEntity(company);
            const savedCompany = await this.companyRepository.save(newcompany);
            return savedCompany.company_id_company;
        } catch (error) {
            console.error("Error creating company", error);
            throw new Error("Error creating company");
        }
    }

    async updateCompany(company_id: number, company: Partial<Companies>): Promise<boolean> {
        try {
            const existingCompany = await this.companyRepository.findOne({ where: { company_id_company: company_id } });
            if (!existingCompany) {
                throw new Error("Company not found");
            }

            // Actualizamos solo los campos enviados
            Object.assign(existingCompany, {
                business_name_company: company.business_name ?? existingCompany.business_name_company,
                doc_type_id_company: company.doc_type_id ?? existingCompany.doc_type_id_company,
                document_number_company: company.document_number ?? existingCompany.document_number_company,
                phone_company: company.phone ?? existingCompany.phone_company,
                profession_company: company.profession ?? existingCompany.profession_company,
                years_experience_company: company.years_experience ?? existingCompany.years_experience_company,
                email_company: company.email ?? existingCompany.email_company,
                password_company: company.password ?? existingCompany.password_company,
                role_id_company: company.role_id ?? existingCompany.role_id_company,
                
            });

            await this.companyRepository.save(existingCompany);
            return true;
        } catch (error) {
            console.error("Error updating company", error);
            throw new Error("Error updating company");
        }
    }

    async deleteCompany(company_id: number): Promise<boolean> {
        try {
            const existingCompany = await this.companyRepository.findOne({ where: { company_id_company: company_id } });
            if (!existingCompany) {
                throw new Error("Company not found");
            };

            await this.companyRepository.save(existingCompany);
            return true;
        } catch (error) {
            console.error("Error deleting company", error);
            throw new Error("Error deleting company");
        }
    }

    async getAllCompanies(): Promise<Companies[]> {
        try {
            const companies = await this.companyRepository.find();
            return companies.map((company) => this.toDomain(company));
        } catch (error) {
            console.error("Error fetching all companies", error);
            throw new Error("Error fetching all companies");
        }
    }

    async getCompanyById(company_id: number): Promise<Companies | null> {
        try {
            const company = await this.companyRepository.findOne({ where: { company_id_company: company_id } });
            return company ? this.toDomain(company) : null;
        } catch (error) {
            console.error("Error fetching company by id", error);
            throw new Error("Error fetching company by id");
        }
    }

    async getCompanyByEmail(email: string): Promise<Companies | null> {
        try {
            const company= await this.companyRepository.findOne({ where: { email_company: email } });
            return company ? this.toDomain(company) : null;
        } catch (error) {
            console.error("Error fetching user by email", error);
            throw new Error("Error fetching user by email");
        }
    }
}
