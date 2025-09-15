import { Repository } from "typeorm";
import { User_phones } from "../../domain/User_Phones";
import { User_phonesPort } from "../../domain/User_PhonesPort";
import { User_phonesEntity } from "../entities/User_phonesEntity";
import { AppDataSource } from "../config/con_data_bases";

export class User_phonesAdapter implements User_phonesPort {
  private userPhonesRepository: Repository<User_phonesEntity>;

  constructor() {
    this.userPhonesRepository = AppDataSource.getRepository(User_phonesEntity);
  }

  private toDomain(entity: User_phonesEntity): User_phones {
    return {
      user_phone: entity.user_phone,
      phone_id: entity.phone_id,
      user_id: entity.user_id,
    };
  }

  private toEntity(domain: Omit<User_phones, "user_phone">): User_phonesEntity {
    const entity = new User_phonesEntity();
    entity.phone_id = domain.phone_id;
    entity.user_id = domain.user_id;
    return entity;
  }

  async createUserPhone(userphone: Omit<User_phones, "user_phone">): Promise<number> {
    try {
      const newEntity = this.toEntity(userphone);
      const savedEntity = await this.userPhonesRepository.save(newEntity);
      return savedEntity.user_phone;
    } catch (error) {
      console.error("Error creando teléfono de usuario:", error);
      throw new Error("Error creando teléfono de usuario");
    }
  }

  async updateUserPhone(user_phone: number, userphone: Partial<User_phones>): Promise<boolean> {
    try {
      const existing = await this.userPhonesRepository.findOne({ where: { user_phone } });
      if (!existing) {
        throw new Error("Teléfono de usuario no encontrado");
      }

      Object.assign(existing, {
        phone_id: userphone.phone_id ?? existing.phone_id,
        user_id: userphone.user_id ?? existing.user_id,
      });

      await this.userPhonesRepository.save(existing);
      return true;
    } catch (error) {
      console.error("Error actualizando teléfono de usuario:", error);
      throw new Error("Error actualizando teléfono de usuario");
    }
  }

  async deleteUserPhone(user_phone: number): Promise<boolean> {
    try {
      const existing = await this.userPhonesRepository.findOne({ where: { user_phone } });
      if (!existing) {
        throw new Error("Teléfono de usuario no encontrado");
      }
      await this.userPhonesRepository.delete({ user_phone });
      return true;
    } catch (error) {
      console.error("Error eliminando teléfono de usuario:", error);
      throw new Error("Error eliminando teléfono de usuario");
    }
  }

  async getAllUserPhones(): Promise<User_phones[]> {
    try {
      const entities = await this.userPhonesRepository.find();
      return entities.map((entity) => this.toDomain(entity));
    } catch (error) {
      console.error("Error obteniendo todos los teléfonos de usuario:", error);
      throw new Error("Error obteniendo todos los teléfonos de usuario");
    }
  }

  async getUserPhoneById(user_phone: number): Promise<User_phones | null> {
    try {
      const entity = await this.userPhonesRepository.findOne({ where: { user_phone } });
      return entity ? this.toDomain(entity) : null;
    } catch (error) {
      console.error("Error obteniendo teléfono de usuario por ID:", error);
      throw new Error("Error obteniendo teléfono de usuario por ID");
    }
  }

  async getUserPhoneByPhoneId(phone_id: number): Promise<User_phones[]> {
    try {
      const entities = await this.userPhonesRepository.find({ where: { phone_id } });
      return entities.map((entity) => this.toDomain(entity));
    } catch (error) {
      console.error("Error obteniendo teléfonos de usuario por phone_id:", error);
      throw new Error("Error obteniendo teléfonos de usuario por phone_id");
    }
  }
}
