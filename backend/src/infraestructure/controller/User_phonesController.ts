import { User_phonesApplication } from "../../application/User_phonesApplication";
import { User_phones } from "../../domain/User_phones";
import { Request, Response } from "express";

export class User_phonesController {
  private app: User_phonesApplication;

  constructor(app: User_phonesApplication) {
    this.app = app;
  }

  async registerUserPhone(request: Request, response: Response): Promise<Response> {
    const { phone_id, user_id } = request.body;

    try {
      // Validaciones
      if (!phone_id || isNaN(Number(phone_id)))
        return response.status(400).json({ message: "phone_id inválido" });

      if (!user_id || isNaN(Number(user_id)))
        return response.status(400).json({ message: "user_id inválido" });

      const userPhone: Omit<User_phones, "user_phone"> = { phone_id, user_id };
      const userPhoneId = await this.app.createUserPhone(userPhone);

      return response.status(201).json({ message: "Teléfono de usuario creado exitosamente", userPhoneId });
    } catch (error) {
      if (error instanceof Error) {
        return response.status(500).json({ message: "Error en el servidor" });
      }
    }
    return response.status(400).json({ message: "Error en la petición" });
  }

  async searchUserPhoneById(request: Request, response: Response): Promise<Response> {
    try {
      const userPhoneId = parseInt(request.params.id);
      if (isNaN(userPhoneId)) return response.status(400).json({ message: "Error en parámetro" });

      const userPhone = await this.app.getUserPhoneById(userPhoneId);
      if (!userPhone) return response.status(404).json({ message: "Teléfono de usuario no encontrado" });

      return response.status(200).json(userPhone);
    } catch (error) {
      if (error instanceof Error) {
        return response.status(500).json({ message: "Error en el servidor" });
      }
    }
    return response.status(400).json({ message: "Error en la petición" });
  }

  async searchUserPhonesByPhoneId(request: Request, response: Response): Promise<Response> {
    try {
      const phoneId = parseInt(request.params.phone_id);
      if (isNaN(phoneId)) return response.status(400).json({ message: "Error en parámetro" });

      const phones = await this.app.getUserPhoneByPhoneId(phoneId);
      if (!phones || phones.length === 0) {
        return response.status(404).json({ message: "No se encontraron registros para ese phone_id" });
      }

      return response.status(200).json(phones);
    } catch (error) {
      console.error("Error en searchCompanyPhonesByPhoneId:", error);
      return response.status(500).json({ message: "Error en el servidor" });
    }
  }

  async allUserPhones(request: Request, response: Response): Promise<Response> {
    try {
      const userPhones = await this.app.getAllUserPhones();
      return response.status(200).json(userPhones);
    } catch (error) {
      if (error instanceof Error) {
        return response.status(500).json({ message: "Error en el servidor" });
      }
    }
    return response.status(400).json({ message: "Error en la petición" });
  }

  async downUserPhone(request: Request, response: Response): Promise<Response> {
    try {
      const userPhoneId = parseInt(request.params.id);
      if (isNaN(userPhoneId)) return response.status(400).json({ message: "Error en parámetro" });

      const deleted = await this.app.deleteUserPhone(userPhoneId);
      if (!deleted) return response.status(404).json({ message: "Teléfono de usuario no encontrado" });

      return response.status(200).json({ message: "Teléfono de usuario eliminado" });
    } catch (error) {
      if (error instanceof Error) {
        return response.status(500).json({ message: "Error en el servidor" });
      }
    }
    return response.status(400).json({ message: "Error en la petición" });
  }

  async updateUserPhone(request: Request, response: Response): Promise<Response> {
    try {
      const userPhoneId = parseInt(request.params.id);
      if (isNaN(userPhoneId)) return response.status(400).json({ message: "Error en parámetro" });

      const { phone_id, user_id } = request.body;

      
      if (phone_id && isNaN(Number(phone_id)))
        return response.status(400).json({ message: "phone_id inválido" });

      if (user_id && isNaN(Number(user_id)))
        return response.status(400).json({ message: "user_id inválido" });

      const updated = await this.app.updateUserPhone(userPhoneId, { phone_id, user_id });
      if (!updated) return response.status(404).json({ message: "Teléfono de usuario no encontrado o sin cambios" });

      return response.status(200).json({ message: "Teléfono de usuario actualizado exitosamente" });
    } catch (error) {
      if (error instanceof Error) {
        return response.status(500).json({ message: "Error en el servidor" });
      }
    }
    return response.status(400).json({ message: "Error en la petición" });
  }
}
