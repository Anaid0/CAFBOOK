import { Repository } from "typeorm";
import { User_addresses } from "../../domain/User_addresses";
import { User_addressPort } from "../../domain/User_addressesPort";
import { User_addressesEntity } from "../entities/User_addressesEntity";
import { AppDataSource } from "../config/con_data_bases";

export class User_addressAdapter implements User_addressPort {
  private userAddressesRepository: Repository<User_addressesEntity>;

  constructor() {
    this.userAddressesRepository = AppDataSource.getRepository(User_addressesEntity);
  }

  private toDomain(entity: User_addressesEntity): User_addresses {
    return {
      user_address_id: entity.user_address_id,
      address_id: entity.address_id,
      user_id: entity.user_id,
    };
  }

  private toEntity(domain: Omit<User_addresses, "user_address_id">): User_addressesEntity {
    const entity = new User_addressesEntity();
    entity.address_id = domain.address_id;
    entity.user_id = domain.user_id;
    return entity;
  }

  async createUserAddress(userAddress: Omit<User_addresses, "user_address_id">): Promise<number> {
    try {
      const newEntity = this.toEntity(userAddress);
      const savedEntity = await this.userAddressesRepository.save(newEntity);
      return savedEntity.user_address_id;
    } catch (error) {
      console.error("Error creando dirección del usuario:", error);
      throw new Error("Error creando dirección del usuario");
    }
  }

  async updateUserAddress(user_address_id: number, userAddress: Partial<User_addresses>): Promise<boolean> {
    try {
      const existing = await this.userAddressesRepository.findOne({ where: { user_address_id } });
      if (!existing) {
        throw new Error("Dirección de la compañía no encontrada");
      }

      Object.assign(existing, {
        address_id: userAddress.address_id ?? existing.address_id,
        user_id: userAddress.user_id ?? existing.user_id,
      });

      await this.userAddressesRepository.save(existing);
      return true;
    } catch (error) {
      console.error("Error actualizando dirección del usuario:", error);
      throw new Error("Error actualizando dirección del usuario");
    }
  }

  async deleteUserAddress(user_address_id: number): Promise<boolean> {
    try {
      const existing = await this.userAddressesRepository.findOne({ where: { user_address_id } });
      if (!existing) {
        throw new Error("Dirección del usuario no encontrada");
      }
      await this.userAddressesRepository.delete({ user_address_id });
      return true;
    } catch (error) {
      console.error("Error eliminando dirección del usuario:", error);
      throw new Error("Error eliminando dirección del usuario");
    }
  }

  async getAllUserAddresses(): Promise<User_addresses[]> {
    try {
      const entities = await this.userAddressesRepository.find();
      return entities.map((entity) => this.toDomain(entity));
    } catch (error) {
      console.error("Error obteniendo todas las direcciones del usuario:", error);
      throw new Error("Error obteniendo todas las direcciones del usuario");
    }
  }

  async getUserAddressById(user_address_id: number): Promise<User_addresses | null> {
    try {
      const entity = await this.userAddressesRepository.findOne({ where: { user_address_id } });
      return entity ? this.toDomain(entity) : null;
    } catch (error) {
      console.error("Error obteniendo dirección del usuario por ID:", error);
      throw new Error("Error obteniendo dirección del usuario por ID");
    }
  }

  async getUserAddressByAddressId(address_id: number): Promise<User_addresses[]> {
    try {
      const entities = await this.userAddressesRepository.find({ where: { address_id } });
      return entities.map((entity) => this.toDomain(entity));
    } catch (error) {
      console.error("Error obteniendo direcciones de la compañía por address_id:", error);
      throw new Error("Error obteniendo direcciones de la compañía por address_id");
    }
  }
}
