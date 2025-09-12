import { Repository } from "typeorm";
import { Company_phones } from "../../domain/Company_phones";
import { Company_phonesPort } from "../../domain/Company_phonesPort";
import { Company_phonesEntity } from "../entities/Company_phonesEntity";
import { AppDataSource } from "../config/con_data_bases";

export class Company_phonesAdapter implements Company_phonesPort {
  private companyPhonesRepository: Repository<Company_phonesEntity>;

  constructor() {
    this.companyPhonesRepository = AppDataSource.getRepository(Company_phonesEntity);
  }

  private toDomain(entity: Company_phonesEntity): Company_phones {
    return {
      company_phone: entity.company_phone,
      phone_id: entity.phone_id,
      company_id: entity.company_id,
    };
  }

  private toEntity(domain: Omit<Company_phones, "company_phone">): Company_phonesEntity {
    const entity = new Company_phonesEntity();
    entity.phone_id = domain.phone_id;
    entity.company_id = domain.company_id;
    return entity;
  }

  async createCompanyPhone(companyPhone: Omit<Company_phones, "company_phone">): Promise<number> {
    try {
      const newEntity = this.toEntity(companyPhone);
      const savedEntity = await this.companyPhonesRepository.save(newEntity);
      return savedEntity.company_phone;
    } catch (error) {
      console.error("Error creando teléfono de la compañía", error);
      throw new Error("Error creando teléfono de la compañía");
    }
  }

  async updateCompanyPhone(company_phone: number, companyPhone: Partial<Company_phones>): Promise<boolean> {
    try {
      const existing = await this.companyPhonesRepository.findOne({ where: { company_phone } });
      if (!existing) {
        throw new Error("Teléfono de la compañía no encontrado");
      }

      Object.assign(existing, {
        phone_id: companyPhone.phone_id ?? existing.phone_id,
        company_id: companyPhone.company_id ?? existing.company_id,
      });

      await this.companyPhonesRepository.save(existing);
      return true;
    } catch (error) {
      console.error("Error actualizando teléfono de la compañía", error);
      throw new Error("Error actualizando teléfono de la compañía");
    }
  }

  async deleteCompanyPhone(company_phone: number): Promise<boolean> {
    try {
      const existing = await this.companyPhonesRepository.findOne({ where: { company_phone } });
      if (!existing) {
        throw new Error("Teléfono de la compañía no encontrado");
      }
      await this.companyPhonesRepository.delete(existing.company_phone);
      return true;
    } catch (error) {
      console.error("Error eliminando teléfono de la compañía", error);
      throw new Error("Error eliminando teléfono de la compañía");
    }
  }

  async getAllCompanyPhones(): Promise<Company_phones[]> {
    try {
      const entities = await this.companyPhonesRepository.find();
      return entities.map(this.toDomain);
    } catch (error) {
      console.error("Error obteniendo todos los teléfonos de la compañía", error);
      throw new Error("Error obteniendo todos los teléfonos de la compañía");
    }
  }

  async getCompanyPhoneById(company_phone: number): Promise<Company_phones | null> {
    try {
      const entity = await this.companyPhonesRepository.findOne({ where: { company_phone } });
      return entity ? this.toDomain(entity) : null;
    } catch (error) {
      console.error("Error obteniendo teléfono de la compañía por ID", error);
      throw new Error("Error obteniendo teléfono de la compañía por ID");
    }
  }

  async getCompanyPhonesByPhoneId(phone_id: number): Promise<Company_phones[]> {
    try {
      const entities = await this.companyPhonesRepository.find({ where: { phone_id } });
      return entities.map(this.toDomain);
    } catch (error) {
      console.error("Error obteniendo teléfonos de la compañía por phone_id", error);
      throw new Error("Error obteniendo teléfonos de la compañía por phone_id");
    }
  }
}
