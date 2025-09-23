import { User_phones } from '../domain/entities/User_phones';
import { User_phonesPort } from '../domain/port/User_PhonesPort';

export class User_phonesApplication {
  private port: User_phonesPort;

  constructor(port: User_phonesPort) {
    this.port = port;
  }

  async createUserPhone(userphone: Omit<User_phones, "user_phone" | "user_name" | "phone_number" | "user_email">): Promise<number> {
    const existingPhones = await this.port.getUserPhoneByPhoneId(userphone.phone_id);
    if (existingPhones.length === 0) {
      return await this.port.createUserPhone(userphone);
    }
    throw new Error("El teléfono del usuario ya existe");
  }

  async updateUserPhone(user_phone: number, userphone: Partial<User_phones>): Promise<boolean> {
    const existingUserPhone = await this.port.getUserPhoneById(user_phone);
    if (!existingUserPhone) {
      throw new Error("El teléfono del usuario no existe");
    }

    if (userphone.phone_id) {
      const userPhonesWithSamePhoneId = await this.port.getUserPhoneByPhoneId(userphone.phone_id);
      const isTaken = userPhonesWithSamePhoneId.some(
        up => up.user_phone !== user_phone
      );
      if (isTaken) {
        throw new Error("Ya existe un registro con este phone_id, no se puede actualizar");
      }
    }

    return await this.port.updateUserPhone(user_phone, userphone);
  }

  async deleteUserPhone(user_phone: number): Promise<boolean> {
    const existingUserPhone = await this.port.getUserPhoneById(user_phone);
    if (!existingUserPhone) {
      throw new Error("No se encontró el teléfono del usuario");
    }
    return await this.port.deleteUserPhone(user_phone);
  }

  async getUserPhoneById(user_phone: number): Promise<User_phones | null> {
    return await this.port.getUserPhoneById(user_phone);
  }

  async getUserPhoneByPhoneId(phone_id: number): Promise<User_phones[]> {
    return await this.port.getUserPhoneByPhoneId(phone_id);
  }

  async getUserPhonesByPhoneId(phone_id: number): Promise<User_phones[]> {
    return await this.port.getUserPhoneByPhoneId(phone_id);
  }

  async getUserPhoneByUserId(user_id: number): Promise<User_phones[]> {
    return await this.port.getUserPhonesByUserId(user_id);
  }

  async getUserPhonesByUserEmail(email: string): Promise<User_phones[]> {
    return await this.port.getUserPhonesByUserEmail(email);
  }

  async getAllUserPhones(): Promise<User_phones[]> {
    return await this.port.getAllUserPhones();
  }
}
