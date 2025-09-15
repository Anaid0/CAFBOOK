import { Company_addresses } from '../domain/models/Company_addresses';
import { Company_addressPort } from '../domain/ports/Company_addressesPort';

export class Company_addressApplication {
    private port: Company_addressPort;

    constructor(port: Company_addressPort) {
        this.port = port;
    }

    async createCompanyaddress(companyaddress: Omit<Company_addresses, "company_address_id">): Promise<number> {
        const existingAddress = await this.port.getCompanyAddressByAddressId(companyaddress.address_id);
        if (existingAddress.length === 0) {
            return await this.port.createCompanyAddress(companyaddress);
        }
        throw new Error("La dirección de compañia ya existe");
    }

    async updateCompanyAddress(company_address_id: number, companyaddress: Partial<Company_addresses>): Promise<boolean> {
        const existingAddress = await this.port.getCompanyAddressById(company_address_id);
        if (!existingAddress) {
            throw new Error("La dirección de la compañia no existe");
        }

        if (companyaddress.address_id) {
            const companyaddressTaken = await this.port.getCompanyAddressByAddressId(companyaddress.address_id);
            const isTaken = companyaddressTaken.some(addr => addr.company_address_id !== company_address_id);
            if (isTaken) {
                throw new Error("Error en actualizar la dirección de la compañia");
            }
        }
        return await this.port.updateCompanyAddress(company_address_id, companyaddress);
    }

    async deleteCompanyAddress(company_address_id: number): Promise<boolean> {
        const existingCompanyaddress = await this.port.getCompanyAddressById(company_address_id);
        if (!existingCompanyaddress) {
            throw new Error("No se encontró la dirección de compañia");
        }
        return await this.port.deleteCompanyAddress(company_address_id);
    }

    async getCompanyaddressById(company_address_id: number): Promise<Company_addresses | null> {
        return await this.port.getCompanyAddressById(company_address_id);
    }

    async getCompanyAddressByAddressid(address_id: number): Promise<Company_addresses[]> {
        return await this.port.getCompanyAddressByAddressId(address_id);
    }

    async getAllCompanyAddresses(): Promise<Company_addresses[]> {
        return await this.port.getAllCompanyAddresses();
    }
}
