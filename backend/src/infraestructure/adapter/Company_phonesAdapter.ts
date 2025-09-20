import { Repository } from "typeorm";
import { Company_phones } from '../../domain/Company_phones';
import { Company_phonesPort } from "../../domain/Company_phonesPort";
import { Company_phonesEntity } from "../entities/Company_phonesEntity";
import { AppDataSource } from "../config/con_data_bases";
import { CompaniesEntity } from "../entities/CompaniesEntity";
import { PhonesEntity } from "../entities/PhonesEntity";

export class Company_phonesAdapter implements Company_phonesPort {
  private companyPhonesRepository: Repository<Company_phonesEntity>;

  constructor() {
    this.companyPhonesRepository = AppDataSource.getRepository(Company_phonesEntity);
  }
  
  private toDomain(entity: Company_phonesEntity): Company_phones {
    return {
      company_phone: entity.company_phone,
      phone_id: entity.phone_id.phone_id,
      phone_number: entity.phone_id.number,
      company_id: entity.company_id.company_id,
      bussines_name: entity.company_id.bussines_name
    };
  }

  private toEntity(domain: Omit<Company_phones, "company_phone">): Company_phonesEntity {
  const companyPhonesEntity = new Company_phonesEntity();

  const companyEntity = new CompaniesEntity();
  companyEntity.company_id = domain.company_id;
  companyPhonesEntity.company_id = companyEntity;

  const phoneEntity = new PhonesEntity();
  phoneEntity.phone_id = domain.phone_id;
  companyPhonesEntity.phone_id = phoneEntity;

  return companyPhonesEntity;
}

  async createCompanyPhone(companyPhone: Omit<Company_phones, "company_phone">): Promise<number> {
    try {
      const newEntity = this.toEntity(companyPhone);
      const savedEntity = await this.companyPhonesRepository.save(newEntity);
      return savedEntity.company_phone;
    } catch (error) {
      console.error("Error creando teléfono de la compañía:", error);
      throw new Error("Error creando teléfono de la compañía");
    }
  }

  async updateCompanyPhone(company_phone: number, companyPhone: Partial<Company_phones>): Promise<boolean> {
    try {
      const existing = await this.companyPhonesRepository.findOne({ where: { company_phone } });
      if (!existing) {
        throw new Error("Teléfono de la compañía no encontrado");
      }
      if (companyPhone.phone_id) {
      const phoneEntity = new PhonesEntity();
      phoneEntity.phone_id = companyPhone.phone_id;
      existing.phone_id = phoneEntity;
    }

    if (companyPhone.company_id) {
    const companyEntity = new CompaniesEntity();
    companyEntity.company_id = companyPhone.company_id;
    existing.company_id = companyEntity;
  }

      Object.assign(existing, {
        phone_id: companyPhone.phone_id ?? existing.phone_id,
        company_id: companyPhone.company_id ?? existing.company_id,
      });

      await this.companyPhonesRepository.save(existing);
      return true;
    } catch (error) {
      console.error("Error actualizando teléfono de la compañía:", error);
      throw new Error("Error actualizando teléfono de la compañía");
    }
  }

  async deleteCompanyPhone(company_phone: number): Promise<boolean> {
    try {
      const existing = await this.companyPhonesRepository.findOne({ where: { company_phone } });
      if (!existing) {
        throw new Error("Teléfono de la compañía no encontrado");
      }
      await this.companyPhonesRepository.delete({ company_phone });
      return true;
    } catch (error) {
      console.error("Error eliminando teléfono de la compañía:", error);
      throw new Error("Error eliminando teléfono de la compañía");
    }
  }

  async getAllCompanyPhones(): Promise<Company_phones[]> {
  try {
    const entities = await this.companyPhonesRepository.find({
      relations: ["company_id", "phone_id", "phone_id.number_type_id"]
    });
    return entities.map((entity) => this.toDomain(entity));
  } catch (error) {
    console.error("Error obteniendo todos los teléfonos de la compañía:", error);
    throw new Error("Error obteniendo todos los teléfonos de la compañía");
  }
}

async getCompanyPhonesByNumber(number: string): Promise<Company_phones[]> {
  try {
    const entities = await this.companyPhonesRepository.find({
      relations: ["company_id", "phone_id", "phone_id.number_type_id"],
      where: {
        phone_id: {
          number: number, 
        },
      },
    });

    return entities.map((entity) => this.toDomain(entity));
  } catch (error) {
    console.error("Error obteniendo los teléfonos de la compañía:", error);
    throw new Error("Error obteniendo los teléfonos de la compañía");
  }
}


async getCompanyPhoneById(company_phone: number): Promise<Company_phones | null> {
  try {
    const entity = await this.companyPhonesRepository.findOne({
      where: { company_phone },
      relations: ["company_id", "phone_id", "phone_id.number_type_id"]
    });
    return entity ? this.toDomain(entity) : null;
  } catch (error) {
    console.error("Error obteniendo teléfono de la compañía por ID:", error);
    throw new Error("Error obteniendo teléfono de la compañía por ID");
  }
}

async getCompanyPhonesByPhoneId(phone_id: number): Promise<Company_phones[]> {
  try {
   const entities = await this.companyPhonesRepository.find({
    where: { phone_id: phone_id as any }, 
    relations: ["company_id", "phone_id", "phone_id.number_type_id"],
  });
  return entities.map((entity) => this.toDomain(entity));
  } catch (error) {
    console.error("Error obteniendo teléfonos de la compañía por phone_id:", error);
    throw new Error("Error obteniendo teléfonos de la compañía por phone_id");
  }
}

async getCompanyPhonesByBussinesName(bussines_name: string): Promise<Company_phones[]> {
    try {
        const companiesPhones = await this.companyPhonesRepository.find({ relations: ["company_id"] });

        const filtered = companiesPhones.filter(Company_phones => Company_phones.company_id.bussines_name === bussines_name);

        return filtered.map(entity => this.toDomain(entity));
    } catch (error) {
        console.error("Error fetching phones by company name", error);
        throw new Error("Error fetching phones by company name");
    }
  }

}
