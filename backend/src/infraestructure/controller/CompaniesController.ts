import { CompaniesApplication } from "../../application/CompaniesApplication";
import { Companies } from "../../domain/Companies";
import { Request, Response } from "express";

export class CompaniesController {
    private app: CompaniesApplication;

    constructor(app: CompaniesApplication) {
        this.app = app;
    }

    async registerCompany(request: Request, response: Response): Promise<Response> {
        const { business_name, doc_type_id, document_number, phone,
            profession, years_experience, email, password, role_id } = request.body;

        try {
            
            const businessnameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,}$/;
            if (!businessnameRegex.test(business_name?.trim()))
                return response.status(400).json({ message: "Nombre de empresa inválido" });

            const docTypeRegex = /^(CC|CE|NIT|PP)$/; // ejemplo, puedes ajustarlo
            if (!docTypeRegex.test(doc_type_id))
                return response.status(400).json({ message: "Tipo de documento inválido" });

            const docNumberRegex = /^\d{6,15}$/;
            if (!docNumberRegex.test(document_number))
                return response.status(400).json({ message: "Número de documento inválido" });

            const phoneRegex = /^[0-9]{7,15}$/;
            if (!phoneRegex.test(phone))
                return response.status(400).json({ message: "Teléfono inválido" });

            if (!businessnameRegex.test(profession?.trim()))
                return response.status(400).json({ message: "Profesión inválida" });

            if (isNaN(years_experience) || years_experience < 0 || years_experience > 80)
                return response.status(400).json({ message: "Años de experiencia inválido" });

            const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(email))
                return response.status(400).json({ message: "Correo electrónico no válido" });

            const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,25}$/;
            if (!passwordRegex.test(password))
                return response.status(400).json({
                    message: "La contraseña debe tener entre 6 y 25 caracteres, incluir al menos una letra y un número"
                });

            const roleRegex = /^(admin|company|manager)$/; // ejemplo
            if (!roleRegex.test(role_id))
                return response.status(400).json({ message: "Rol inválido" });

            const company: Omit<Companies, "company_id"> = {
                business_name, doc_type_id, document_number, phone,
                profession, years_experience, email, password, role_id
            };

            const companyId = await this.app.createCompany(company);
            return response
                .status(201)
                .json({ message: "Empresa registrada correctamente", companyId });

        } catch (error) {
            if (error instanceof Error) {
                return response.status(500).json({ message: "error en servidor" });
            }
        }
        return response.status(400).json({ message: "error en la petición" });
    }

    async searchCompanyById(request: Request, response: Response): Promise<Response> {
        try {
            const companyId = parseInt(request.params.id);
            if (isNaN(companyId))
                return response.status(400).json({ message: "error en parámetro" });

            const company = await this.app.getCompanyById(companyId);
            if (!company) {
                return response.status(404).json({ message: "Empresa no existe" });
            }
            return response.status(200).json(company);
        } catch (error) {
            if (error instanceof Error) {
                return response.status(500).json({ message: "error en servidor" });
            }
        }
        return response.status(400).json({ message: "error en la petición" });
    }

    async searchCompanyByEmail(request: Request, response: Response): Promise<Response> {
        try {
            const { email } = request.params;
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
                return response.status(400).json({ message: "Correo electrónico no válido" });

            const company = await this.app.getCompanyByEmail(email);
            if (!company) {
                return response.status(404).json({ message: "Empresa no existe" });
            }
            return response.status(200).json(company);
        } catch (error) {
            if (error instanceof Error) {
                return response.status(500).json({ message: "error en servidor" });
            }
        }
        return response.status(400).json({ message: "error en la petición" });
    }

    async allCompanies(request: Request, response: Response): Promise<Response> {
        try {
            const companies = await this.app.getAllCompanies();
            return response.status(200).json(companies);
        } catch (error) {
            if (error instanceof Error) {
                return response.status(500).json({ message: "error en servidor" });
            }
        }
        return response.status(400).json({ message: "error en la petición" });
    }

    async downCompany(request: Request, response: Response): Promise<Response> {
        try {
            const companyId = parseInt(request.params.id);
            if (isNaN(companyId))
                return response.status(400).json({ message: "error en parámetro" });

            const company = await this.app.deleteCompany(companyId);
            if (!company) {
                return response.status(404).json({ message: "Empresa no existe" });
            }
            return response.status(200).json(company);
        } catch (error) {
            if (error instanceof Error) {
                return response.status(500).json({ message: "error en servidor" });
            }
        }
        return response.status(400).json({ message: "error en la petición" });
    }

    async updateCompany(request: Request, response: Response): Promise<Response> {
        try {
            const companyId = parseInt(request.params.id);
            if (isNaN(companyId))
                return response.status(400).json({ message: "error en parámetro" });

            let { business_name, doc_type_id, document_number, phone,
                profession, years_experience, email, password, role_id } = request.body;

            
            const businessnameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,}$/;

            if (business_name && !businessnameRegex.test(business_name.trim()))
                return response.status(400).json({ message: "Nombre de empresa inválido" });

            const docTypeRegex = /^(CC|CE|NIT|PP)$/;
            if (doc_type_id && !docTypeRegex.test(doc_type_id))
                return response.status(400).json({ message: "Tipo de documento inválido" });

            const docNumberRegex = /^\d{6,15}$/;
            if (document_number && !docNumberRegex.test(document_number))
                return response.status(400).json({ message: "Número de documento inválido" });

            const phoneRegex = /^[0-9]{7,15}$/;
            if (phone && !phoneRegex.test(phone))
                return response.status(400).json({ message: "Teléfono inválido" });

            if (profession && !businessnameRegex.test(profession.trim()))
                return response.status(400).json({ message: "Profesión inválida" });

            if (years_experience && (isNaN(years_experience) || years_experience < 0 || years_experience > 80))
                return response.status(400).json({ message: "Años de experiencia inválido" });

            const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
            if (email && !emailRegex.test(email.trim()))
                return response.status(400).json({ message: "Correo electrónico no válido" });

            const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,25}$/;
            if (password && !passwordRegex.test(password.trim()))
                return response.status(400).json({
                    message: "La contraseña debe tener entre 6 y 25 caracteres, incluir al menos una letra y un número"
                });

            const roleRegex = /^(admin|company|manager)$/;
            if (role_id && !roleRegex.test(role_id))
                return response.status(400).json({ message: "Rol inválido" });

            const updated = await this.app.updateCompany(companyId, {
                business_name, doc_type_id, document_number, phone,
                profession, years_experience, email, password, role_id
            });

            if (!updated)
                return response.status(404).json({ message: "Empresa no encontrada o sin cambios" });

            return response.status(200).json({ message: "Empresa actualizada con éxito" });
        } catch (error) {
            if (error instanceof Error)
                return response.status(500).json({ message: "error en servidor" });
        }
        return response.status(400).json({ message: "error en la petición" });
    }
}
