import { Company_addressApplication } from "../../application/Company_addressesApplicattion";
import { Company_addresses } from "../../domain/Company_addresses";
import { Request, Response } from "express";
import { Validators } from "../config/validations";

export class Company_addressController {
    private app: Company_addressApplication;

    constructor(app: Company_addressApplication) {
        this.app = app;
    }

    async registerCompanyAddress(request: Request, response: Response): Promise<Response> {
        const { address_id, company_id } = request.body;
        try {
            if (!address_id || isNaN(Number(address_id))) {
                return response.status(400).json({ message: "ID de dirección inválido" });
            }

            if (!company_id || isNaN(Number(company_id))) {
                return response.status(400).json({ message: "ID de compañía inválido" });
            }

            const companyAddress: Omit<Company_addresses, "company_address_id" | "bussines_name" | "address_street"> = {
                address_id: Number(address_id),
                company_id: Number(company_id),
            };

            const companyAddressId = await this.app.createCompanyaddress(companyAddress);

            return response.status(201).json({
                message: "Dirección de compañía creada exitosamente",
                companyAddressId,
            });
        } catch (error) {
            return response.status(500).json({ message: "Error en el servidor" });
        }
    }

    async searchCompanyAddressById(request: Request, response: Response): Promise<Response> {
        try {
            const companyAddressId = parseInt(request.params.id);
            if (isNaN(companyAddressId)) {
                return response.status(400).json({ message: "Error en parámetro" });
            }

            const companyAddress = await this.app.getCompanyaddressById(companyAddressId);
            if (!companyAddress) {
                return response.status(404).json({ message: "Dirección de compañía no encontrada" });
            }

            return response.status(200).json(companyAddress);
        } catch (error) {
            return response.status(500).json({ message: "Error en el servidor" });
        }
    }

    async searchCompanyAddressByAddressId(request: Request, response: Response): Promise<Response> {
        try {
            const addressId = parseInt(request.params.id);
            if (isNaN(addressId)) {
                return response.status(400).json({ error: "ID de dirección no válido" });
            }

            const companyAddress = await this.app.getCompanyAddressByAddressid(addressId);
            if (!companyAddress) {
                return response.status(404).json({ message: "Dirección de compañía no encontrada" });
            }

            return response.status(200).json(companyAddress);
        } catch (error) {
            return response.status(500).json({ message: "Error en el servidor" });
        }
    }

    async getCompanyAddressByBussinesName(request: Request, response: Response): Promise<Response> {
        try {
            const { name } = request.params;
            if (!Validators.name(name)) {
                return response.status(400).json({ error: "Nombre de empresa no válido" });
            }

            const addresses = await this.app.getCompanyAddressByBussinesName(name);
            if (!addresses || addresses.length === 0) {
                return response.status(404).json({ message: "No se encontraron direcciones para esa empresa" });
            }

            const result = addresses.map(addr => ({
                company_address_id: addr.company_address_id,
                bussines_name: addr.bussines_name,
                address_id: addr.address_id,
                address_street: addr.address_street,
                company_id: addr.company_id,
            }));

            return response.status(200).json(result);
        } catch (error) {
            return response.status(500).json({ message: "Error en el servidor" });
        }
    }

    async getCompanyAddressByDepartmentName(request: Request, response: Response): Promise<Response> {
        try {
            const { department } = request.params;
            if (!Validators.name(department)) {
                return response.status(400).json({ error: "Nombre de departamento no válido" });
            }

            const addresses = await this.app.getCompanyAddressByDepartmentName(department);
            if (!addresses || addresses.length === 0) {
                return response.status(404).json({ message: "No se encontraron direcciones para ese departamento" });
            }

            return response.status(200).json(addresses);
        } catch (error) {
            return response.status(500).json({ message: "Error en el servidor" });
        }
    }

    async allCompanyAddresses(request: Request, response: Response): Promise<Response> {
        try {
            const companyAddresses = await this.app.getAllCompanyAddresses();
            return response.status(200).json(companyAddresses);
        } catch (error) {
            return response.status(500).json({ message: "Error en el servidor" });
        }
    }

    async downCompanyAddress(request: Request, response: Response): Promise<Response> {
        try {
            const companyAddressId = parseInt(request.params.id);
            if (isNaN(companyAddressId)) {
                return response.status(400).json({ message: "Error en parámetro" });
            }

            const deleted = await this.app.deleteCompanyAddress(companyAddressId);
            if (!deleted) {
                return response.status(404).json({ message: "Dirección de compañía no encontrada" });
            }

            return response.status(200).json({ message: "Dirección de compañía eliminada exitosamente" });
        } catch (error) {
            return response.status(500).json({ message: "Error en el servidor" });
        }
    }

    async updateCompanyAddress(request: Request, response: Response): Promise<Response> {
        try {
            const companyAddressId = parseInt(request.params.id);
            if (isNaN(companyAddressId)) {
                return response.status(400).json({ message: "Error en parámetro" });
            }

            const { address_id, company_id } = request.body;

            if (address_id && isNaN(Number(address_id))) {
                return response.status(400).json({ message: "ID de dirección inválido" });
            }

            if (company_id && isNaN(Number(company_id))) {
                return response.status(400).json({ message: "ID de compañía inválido" });
            }

            const updated = await this.app.updateCompanyAddress(companyAddressId, {
                address_id,
                company_id,
            });

            if (!updated) {
                return response.status(404).json({ message: "Dirección de compañía no encontrada o sin cambios" });
            }

            return response.status(200).json({ message: "Dirección de compañía actualizada exitosamente" });
        } catch (error) {
            return response.status(500).json({ message: "Error en el servidor" });
        }
    }
}
