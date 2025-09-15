import { Company_phones } from "../models/Company_phones";
export interface Company_phonesPort {
    createCompanyPhone(companyphone: Omit<Company_phones, "company_phone">): Promise<number>;
    updateCompanyPhone(company_phone: number, companyphone: Partial<Company_phones>): Promise<boolean>;
    deleteCompanyPhone(company_phone: number): Promise<boolean>;
    getAllCompanyPhones(): Promise<Company_phones[]>;
    getCompanyPhoneById(company_phone: number): Promise<Company_phones | null>;
    getCompanyPhonesByPhoneId(phone_id: number): Promise<Company_phones[]>;
  }