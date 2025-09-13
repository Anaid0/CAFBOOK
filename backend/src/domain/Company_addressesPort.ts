import { Company_addresses } from "./Company_addresses";
export interface Company_addressPort {
    createCompanyAddress(companyaddress: Omit<Company_addresses, "company_address_id">): Promise<number>;
    updateCompanyAddress(company_address_id: number, companyaddress: Partial<Company_addresses>): Promise<boolean>;
    deleteCompanyAddress(company_address_id: number): Promise<boolean>;
    getAllCompanyAddresses(): Promise<Company_addresses[]>;
    getCompanyAddressById(company_address_id: number): Promise<Company_addresses | null>;
    getCompanyAddressByAddressId(address_id: number): Promise<Company_addresses[]>;
  }