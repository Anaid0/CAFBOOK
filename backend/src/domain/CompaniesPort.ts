import { Companies } from './Companies';

export interface CompaniesPort{
    createCompany(company: Omit<Companies,"company_id"| "role_description" | "doc_type_description">): Promise<number>;
    updateCompany(company_id:number, company:Partial<Companies>):Promise<boolean>;
    deleteCompany(company_id:number): Promise<boolean>;
    restoreCompany(company_id:number): Promise<boolean>;
    getAllCompanies(): Promise<Companies[]>;
    getCompanyById(company_id:number): Promise<Companies | null>;
    getCompanyByEmail(email: string): Promise<Companies | null>;
}
//