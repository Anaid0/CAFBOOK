import { Repository } from "typeorm";
import { Company_addresses } from '../../domain/Company_addresses';
import { Company_addressPort } from "../../domain/Company_addressesPort";
import { Company_addressesEntity } from "../entities/Company_addressesEntity";
import { AppDataSource } from "../config/con_data_bases";
import { AddressesEntity } from "../entities/AddressesEntity";
import { CompaniesEntity } from "../entities/CompaniesEntity";

export class Company_addressAdapter implements Company_addressPort {
  private companyAddressesRepository: Repository<Company_addressesEntity>;

  constructor() {
    this.companyAddressesRepository = AppDataSource.getRepository(Company_addressesEntity);
  } 

  private toDomain(entity: Company_addressesEntity): Company_addresses {
    return {
      company_address_id: entity.company_address_id,
      address_id: entity.address_id.address_id,
      address_street: entity.address_id.street,
      company_id: entity.company_id.company_id,
      bussines_name: entity.company_id.bussines_name
    };
  }

  private toEntity(domain: Omit<Company_addresses, "company_address_id">): Company_addressesEntity {
    const companyAddress = new Company_addressesEntity();
    const addressEntity = new AddressesEntity();
    const companyEntity = new CompaniesEntity();

    addressEntity.address_id = domain.address_id;
    companyEntity.company_id = domain.company_id;

    companyAddress.address_id = addressEntity;
    companyAddress.company_id = companyEntity;

    return companyAddress;
  }

  async createCompanyAddress(companyAddress: Omit<Company_addresses, "company_address_id">): Promise<number> {
    try {
      const newEntity = this.toEntity(companyAddress);
      const savedEntity = await this.companyAddressesRepository.save(newEntity);
      return savedEntity.company_address_id;
    } catch (error) {
      console.error("Error creando dirección de la compañía:", error);
      throw new Error("Error creando dirección de la compañía");
    }
  }

  async updateCompanyAddress(company_address_id: number, companyAddress: Partial<Company_addresses>): Promise<boolean> {
    try {
      const existing = await this.companyAddressesRepository.findOne({ where: { company_address_id } });
      if (!existing) {
        throw new Error("Dirección de la compañía no encontrada");
      }

      Object.assign(existing, {
        address_id: companyAddress.address_id ?? existing.address_id,
        company_id: companyAddress.company_id ?? existing.company_id,
      });

      await this.companyAddressesRepository.save(existing);
      return true;
    } catch (error) {
      console.error("Error actualizando dirección de la compañía:", error);
      throw new Error("Error actualizando dirección de la compañía");
    }
  }

  async deleteCompanyAddress(company_address_id: number): Promise<boolean> {
    try {
      const existing = await this.companyAddressesRepository.findOne({ where: { company_address_id } });
      if (!existing) {
        throw new Error("Dirección de la compañía no encontrada");
      }
      await this.companyAddressesRepository.delete({ company_address_id });
      return true;
    } catch (error) {
      console.error("Error eliminando dirección de la compañía:", error);
      throw new Error("Error eliminando dirección de la compañía");
    }
  }

  async getAllCompanyAddresses(): Promise<Company_addresses[]> {
    try {
      const entities = await this.companyAddressesRepository.find();
      return entities.map((entity) => this.toDomain(entity));
    } catch (error) {
      console.error("Error obteniendo todas las direcciones de la compañía:", error);
      throw new Error("Error obteniendo todas las direcciones de la compañía");
    }
  }

  async getCompanyAddressById(company_address_id: number): Promise<Company_addresses | null> {
    try {
      const entity = await this.companyAddressesRepository.findOne({ where: { company_address_id } });
      return entity ? this.toDomain(entity) : null;
    } catch (error) {
      console.error("Error obteniendo dirección de la compañía por ID:", error);
      throw new Error("Error obteniendo dirección de la compañía por ID");
    }
  }

  async getCompanyAddressByAddressId(address_id: number): Promise<Company_addresses[]> {
    try {
      const entities = await this.companyAddressesRepository.find({relations:["address_id"] });

      const filtered = entities.filter(Company_addresses => Company_addresses.address_id.address_id === address_id);

      return filtered.map(entity => this.toDomain(entity));
    } catch (error) {
      console.error("Error obteniendo direcciones de la compañía por address_id:", error);
      throw new Error("Error obteniendo direcciones de la compañía por address_id");
    }
  }

  async getCompanyAddressByBussinesName(bussines_name: string): Promise<Company_addresses[]> {
    try {
        const companiesAddresses = await this.companyAddressesRepository.find({ relations: ["company_id"] });

        const filtered = companiesAddresses.filter(Company_addresses => Company_addresses.company_id.bussines_name === bussines_name);

        return filtered.map(entity => this.toDomain(entity));
    } catch (error) {
        console.error("Error fetching addresses by company name", error);
        throw new Error("Error fetching addresses by company name");
    }
  }
  
  async getCompanyAddressByDepartmentName(department_name: string): Promise<Company_addresses[]> {
    try {
        const addresses = await this.companyAddressesRepository.find({ relations: ["department_id"] });

        const filtered = addresses.filter(Company_addresses => Company_addresses.address_id.city_id.department_id.department_name === department_name);

        return filtered.map(entity => this.toDomain(entity));
    } catch (error) {
        console.error("Error fetching addresses by company name", error);
        throw new Error("Error fetching addresses by company name");
    }
  }
}
