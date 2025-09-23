import { Company_phones } from "../entities/Company_phones";
export interface Company_phonesPort {
    createCompanyPhone(companyphone: Omit<Company_phones, "company_phone" | "phone_number" | "bussines_name" | "company_email">): Promise<number>;
    updateCompanyPhone(company_phone: number, companyphone: Partial<Company_phones>): Promise<boolean>;
    deleteCompanyPhone(company_phone: number): Promise<boolean>;
    getAllCompanyPhones(): Promise<Company_phones[]>;
    getCompanyPhoneById(company_phone: number): Promise<Company_phones | null>;
    getCompanyPhonesByPhoneId(phone_id: number): Promise<Company_phones[]>;
    getCompanyPhonesByNumber(number: string): Promise<Company_phones[]>;
    getCompanyPhonesByBussinesName(bussines_name:string): Promise <Company_phones[]>;
    getCompanyPhonesByCompanyEmail(email:string): Promise <Company_phones[]>;
  }
  //