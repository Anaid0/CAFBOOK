import { Company_phonesApplication } from "../../application/Company_phonesApplication";
import { Company_phones } from "../../domain/models/Company_phones";
import { Request, Response } from "express";
import { Validators } from "../config/validations";

export class Company_phonesController {
  private app: Company_phonesApplication;

  constructor(app: Company_phonesApplication) {
    this.app = app;
  }

  async registerCompanyPhone(request: Request, response: Response): Promise<Response> {
    const { phone_id, company_id } = request.body;
    try {
      if (!Validators.phoneId(phone_id) || !Validators.companyId(company_id)) {
        return response.status(400).json({ message: "Parámetros inválidos" });
      }

      const companyPhone: Omit<Company_phones, "company_phone"> = { phone_id, company_id };
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

      if (phone_id && !Validators.phoneId(phone_id)) {
        return response.status(400).json({ message: "phone_id inválido" });
      }

      if (company_id && !Validators.companyId(company_id)) {
        return response.status(400).json({ message: "company_id inválido" });
      }

      const updated = await this.app.updateCompanyPhone(id, { phone_id, company_id });
      if (!updated) return response.status(404).json({ message: "Teléfono de la compañía no encontrado o sin cambios" });

      return response.status(200).json({ message: "Teléfono de la compañía actualizado exitosamente" });
    } catch (error) {
      console.error("Error en updateCompanyPhone:", error);
      return response.status(500).json({ message: "Error en el servidor" });
    }
  }
}
