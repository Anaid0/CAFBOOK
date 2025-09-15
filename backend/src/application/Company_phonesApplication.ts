import { Company_phones } from '../domain/models/Company_phones';
import { Company_phonesPort } from '../domain/ports/Company_phonesPort';

export class Company_phonesApplication {
  private port: Company_phonesPort;

  constructor(port: Company_phonesPort) {
    this.port = port;
  }

  async createCompanyPhone(companyPhone: Omit<Company_phones, "company_phone">): Promise<number> {
    const existingPhones = await this.port.getCompanyPhonesByPhoneId(companyPhone.phone_id);
    if (existingPhones.length === 0) {
      return await this.port.createCompanyPhone(companyPhone);
    }
    throw new Error("El teléfono de la compañía ya existe");
  }

  async updateCompanyPhone(company_phone: number, companyPhone: Partial<Company_phones>): Promise<boolean> {
    const existingCompanyPhone = await this.port.getCompanyPhoneById(company_phone);
    if (!existingCompanyPhone) {
      throw new Error("El teléfono de la compañía no existe");
    }

    if (companyPhone.phone_id) {
      const companyPhonesWithSamePhoneId = await this.port.getCompanyPhonesByPhoneId(companyPhone.phone_id);
      const isTaken = companyPhonesWithSamePhoneId.some(
        cp => cp.company_phone !== company_phone
      );
      if (isTaken) {
        throw new Error("Ya existe un registro con este phone_id, no se puede actualizar");
      }
    }

    return await this.port.updateCompanyPhone(company_phone, companyPhone);
  }

  async deleteCompanyPhone(company_phone: number): Promise<boolean> {
    const existingCompanyPhone = await this.port.getCompanyPhoneById(company_phone);
    if (!existingCompanyPhone) {
      throw new Error("No se encontró el teléfono de la compañía");
    }
    return await this.port.deleteCompanyPhone(company_phone);
  }

  async getCompanyPhoneById(company_phone: number): Promise<Company_phones | null> {
    return await this.port.getCompanyPhoneById(company_phone);
  }

  async getCompanyPhonesByPhoneId(phone_id: number): Promise<Company_phones[]> {
    return await this.port.getCompanyPhonesByPhoneId(phone_id);
  }

  async getAllCompanyPhones(): Promise<Company_phones[]> {
    return await this.port.getAllCompanyPhones();
  }
}
