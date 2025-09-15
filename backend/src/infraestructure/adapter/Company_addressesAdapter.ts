import { Repository } from "typeorm";
import { Company_addresses } from "../../domain/Company_addresses";
import { Company_addressPort } from "../../domain/Company_addressesPort";
import { Company_addressesEntity } from "../entities/Company_addressesEntity";
import { AppDataSource } from "../config/con_data_bases";

export class Company_addressAdapter implements Company_addressPort {
  private companyAddressesRepository: Repository<Company_addressesEntity>;

  constructor() {
    this.companyAddressesRepository = AppDataSource.getRepository(Company_addressesEntity);
  }

  private toDomain(entity: Company_addressesEntity): Company_addresses {
    return {
      company_address_id: entity.company_address_id,
      address_id: entity.address_id,
      company_id: entity.company_id,
    };
  }

  private toEntity(domain: Omit<Company_addresses, "company_address_id">): Company_addressesEntity {
    const entity = new Company_addressesEntity();
    entity.address_id = domain.address_id;
    entity.company_id = domain.company_id;
    return entity;
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
      const entities = await this.companyAddressesRepository.find({ where: { address_id } });
      return entities.map((entity) => this.toDomain(entity));
    } catch (error) {
      console.error("Error obteniendo direcciones de la compañía por address_id:", error);
      throw new Error("Error obteniendo direcciones de la compañía por address_id");
    }
  }
}
