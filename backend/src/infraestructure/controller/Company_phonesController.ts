import { Company_phonesApplication } from "../../application/Company_phonesApplication";
import { Company_phones } from "../../domain/Company_phones";
import { Request, Response } from "express";
import { Validators } from "../config/validations";
import { number } from "joi";

export class Company_phonesController {
  private app: Company_phonesApplication;

  constructor(app: Company_phonesApplication) {
    this.app = app;
  }

  async registerCompanyPhone(request: Request, response: Response): Promise<Response> {
  const { phone_id, company_id } = request.body;
  try {
    if (!phone_id || !company_id) {
      return response.status(400).json({ error: "phone_id y company_id son obligatorios" });
    }

  const companyPhone: Omit<Company_phones, "company_phone" | "bussines_name" | "phone_number"> = { 
      phone_id: { id: phone_id } as any,
      company_id: { id: company_id } as any
    };

    const id = await this.app.createCompanyPhone(companyPhone);

    return response.status(201).json({ message: "Teléfono de la compañía creado exitosamente", id });
  } catch (error) {
    console.error("Error en registerCompanyPhone:", error);
    return response.status(500).json({ message: "Error en el servidor" });
  }
}

  async searchCompanyPhoneById(request: Request, response: Response): Promise<Response> {
    try {
      const company_phone = parseInt(request.params.company_phone);
      if (isNaN(company_phone)) {
        return response.status(400).json({ message: "Error en parámetro" });
      }
  
      const phone = await this.app.getCompanyPhoneById(company_phone);
      if (!phone) {
        return response.status(404).json({ message: "Teléfono de la compañía no encontrado" });
      }
  
      return response.status(200).json(phone);
    } catch (error) {
      console.error("Error en searchCompanyPhoneById:", error);
      return response.status(500).json({ message: "Error en el servidor" });
    }
  }

  async searchCompanyPhonesByPhoneId(request: Request, response: Response): Promise<Response> {
    try {
      const phoneId = parseInt(request.params.phone_id);
      if (isNaN(phoneId)) return response.status(400).json({ message: "Error en parámetro" });

      const phones = await this.app.getCompanyPhonesByPhoneId(phoneId);
      if (!phones || phones.length === 0) {
        return response.status(404).json({ message: "No se encontraron registros para ese phone_id" });
      }

      return response.status(200).json(phones);
    } catch (error) {
      console.error("Error en searchCompanyPhonesByPhoneId:", error);
      return response.status(500).json({ message: "Error en el servidor" });
    }
  }

 async searchCompanyPhonesByNumber(request: Request, response: Response): Promise<Response> {
  try {
    const number = request.params.number; 

    if (!number || number.trim().length === 0) {
      return response.status(400).json({ message: "Parámetro 'number' inválido" });
    }

    const phones = await this.app.getCompanyPhonesByNumber(number);

    if (!phones || phones.length === 0) {
      return response.status(404).json({ message: "Teléfono no encontrado" });
    }

    return response.status(200).json(phones);
  } catch (error) {
    console.error("Error en searchCompanyPhonesByNumber:", error);
    return response.status(500).json({ message: "Error en el servidor" });
  }
}

  async getCompanyPhonesByBussinesName(request: Request, response: Response): Promise<Response> {
    try {
      const { name } = request.params;
      if (!Validators.name(name)) {
      return response.status(400).json({ error: "Nombre de empresa no válido" });
      }
      const phones = await this.app.getCompanyPhonesByBussinesName(name);
      if (!phones || phones.length === 0) {
        return response.status(404).json({ message: "No se encontraron telefonos para esa empresa" });
      }

      const result = phones.map(phone => ({
        company_address_id: phone.company_phone,
        bussines_name: phone.bussines_name,
        phone_id: phone.phone_id,
        phone_number: phone.phone_number,
        company_id: phone.company_id,
      }));
      return response.status(200).json(result);
        } catch (error) {
          return response.status(500).json({ message: "Error en el servidor" });
        }
    }

  async allCompanyPhones(request: Request, response: Response): Promise<Response> {
    try {
      const phones = await this.app.getAllCompanyPhones();
      return response.status(200).json(phones);
    } catch (error) {
      console.error("Error en allCompanyPhones:", error);
      return response.status(500).json({ message: "Error en el servidor" });
    }
  }

  async downCompanyPhone(request: Request, response: Response): Promise<Response> {
    try {
      const id = parseInt(request.params.id);
      if (isNaN(id)) return response.status(400).json({ message: "Error en parámetro" });

      const deleted = await this.app.deleteCompanyPhone(id);
      if (!deleted) return response.status(404).json({ message: "Teléfono de la compañía no encontrado" });

      return response.status(200).json({ message: "Teléfono de la compañía eliminado exitosamente" });
    } catch (error) {
      console.error("Error en deleteCompanyPhone:", error);
      return response.status(500).json({ message: "Error en el servidor" });
    }
  }

  async updateCompanyPhone(request: Request, response: Response): Promise<Response> {
    try {
      const id = parseInt(request.params.id);
      if (isNaN(id)) return response.status(400).json({ message: "Error en parámetro" });

      const { phone_id, company_id } = request.body;

      const updated = await this.app.updateCompanyPhone(id, { phone_id, company_id });
      if (!updated) return response.status(404).json({ message: "Teléfono de la compañía no encontrado o sin cambios" });

      return response.status(200).json({ message: "Teléfono de la compañía actualizado exitosamente" });
    } catch (error) {
      console.error("Error en updateCompanyPhone:", error);
      return response.status(500).json({ message: "Error en el servidor" });
    }
  }
}
