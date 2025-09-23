import { User_addressApplication } from "../../application/User_addressesApplication";
import { User_addresses } from "../../domain/domain/User_addresses";
import { Request, Response } from "express";
import { Validators } from "../config/validations";

export class User_addressController {
    private app: User_addressApplication;

    constructor(app: User_addressApplication) {
        this.app = app;
    }

    async registerUserAddress(request: Request, response: Response): Promise<Response> {
        const { address_id, user_id } = request.body;
        try {
            if (!address_id || isNaN(Number(address_id))) {
                return response.status(400).json({ message: "ID de dirección inválido" });
            }

            if (!user_id || isNaN(Number(user_id))) {
                return response.status(400).json({ message: "ID de usuario inválido" });
            }

            const userAddress: Omit<User_addresses, "user_address_id" | "user_name" | "address_street"> = {
                address_id: Number(address_id),
                user_id: Number(user_id),
            };

            const userAddressId = await this.app.createUseraddress(userAddress);

            return response.status(201).json({
                message: "Dirección de usuario creada exitosamente",
                userAddressId,
            });
        } catch (error) {
            if (error instanceof Error) {
                return response.status(500).json({ message: "Error en el servidor" });
            }
        }
        return response.status(400).json({ message: "Error en la petición" });
    }

    async searchUserAddressById(request: Request, response: Response): Promise<Response> {
        try {
            const userAddressId = parseInt(request.params.id);
            if (isNaN(userAddressId)) {
                return response.status(400).json({ message: "Error en parámetro" });
            }

            const userAddress = await this.app.getUseraddressById(userAddressId);
            if (!userAddress) {
                return response.status(404).json({ message: "Dirección de usuario no encontrada" });
            }

            return response.status(200).json(userAddress);
        } catch (error) {
            if (error instanceof Error) {
                return response.status(500).json({ message: "Error en el servidor" });
            }
        }
        return response.status(400).json({ message: "Error en la petición" });
    }

    async searchUserAddressByAddressId(request: Request, response: Response): Promise<Response> {
        try {
            const addressId = parseInt(request.params.id);
            if (isNaN(addressId)) {
                return response.status(400).json({ error: "ID de dirección no válido" });
            }

            const userAddress = await this.app.getUserAddressByAddressid(addressId);
            if (!userAddress) {
                return response.status(404).json({ message: "Dirección de usuario no encontrada" });
            }

            return response.status(200).json(userAddress);
        } catch (error) {
            if (error instanceof Error) {
                return response.status(500).json({ message: "Error en el servidor" });
            }
        }
        return response.status(400).json({ message: "Error en la petición" });
    }

    async searchUserAddressByUserEmail(request: Request, response: Response): Promise<Response> {
        try {
            const {email} = request.params;
            const userAddress = await this.app.getUseraddressByUserEmail(email);
            if (!userAddress) {
                return response.status(404).json({ message: "Dirección de usuario no encontrada" });
            }

            return response.status(200).json(userAddress);
        } catch (error) {
            if (error instanceof Error) {
                return response.status(500).json({ message: "Error en el servidor" });
            }
        }
        return response.status(400).json({ message: "Error en la petición" });
    }

     async searchUserAddressByDepartmentName(request: Request, response: Response): Promise<Response> {
        try {
            const {department} = request.params;
            if (!Validators.name(department)) {
                return response.status(400).json({ error: "Nombre de departamento no válido" });
            }

            const addresses = await this.app.getUseraddressByDepartmentName(department);
            if (!addresses || addresses.length === 0) {
                return response.status(404).json({ message: "No se encontraron direcciones para ese departamento" });
            }

            return response.status(200).json(addresses);
        } catch (error) {
            if (error instanceof Error) {
                return response.status(500).json({ message: "Error en el servidor" });
            }
        }
        return response.status(400).json({ message: "Error en la petición" });
    }

    async allUserAddresses(request: Request, response: Response): Promise<Response> {
        try {
            const userAddresses = await this.app.getAllUserAddresses();
            return response.status(200).json(userAddresses);
        } catch (error) {
            if (error instanceof Error) {
                return response.status(500).json({ message: "Error en el servidor" });
            }
        }
        return response.status(400).json({ message: "Error en la petición" });
    }

    async downUserAddress(request: Request, response: Response): Promise<Response> {
        try {
            const userAddressId = parseInt(request.params.id);
            if (isNaN(userAddressId)) {
                return response.status(400).json({ message: "Error en parámetro" });
            }

            const userAddress = await this.app.deleteUserAddress(userAddressId);
            if (!userAddress) {
                return response.status(404).json({ message: "Dirección de usuario no encontrado" });
            }

            return response.status(200).json({ message: "Dirección de usuario eliminado exitosamente" });
        } catch (error) {
            if (error instanceof Error) {
                return response.status(500).json({ message: "Error en el servidor" });
            }
        }
        return response.status(400).json({ message: "Error en la petición" });
    }

    async updateUserAddress(request: Request, response: Response): Promise<Response> {
        try {
            const userAddressId = parseInt(request.params.id);
            if (isNaN(userAddressId)) {
                return response.status(400).json({ message: "Error en parámetro" });
            }

            const { address_id, user_id } = request.body;

            if (address_id && isNaN(Number(address_id))) {
                return response.status(400).json({ message: "ID de usuario inválido" });
            }

            if (user_id && isNaN(Number(user_id))) {
                return response.status(400).json({ message: "ID de usuario inválido" });
            }

            const updated = await this.app.updateUserAddress(userAddressId, {
                address_id,
                user_id,
            });

            if (!updated) {
                return response.status(404).json({ message: "Dirección de usuario no encontrado o sin cambios" });
            }

            return response.status(200).json({ message: "Dirección de usuario actualizado exitosamente" });
        } catch (error) {
            if (error instanceof Error) {
                return response.status(500).json({ message: "Error en el servidor" });
            }
        }
        return response.status(400).json({ message: "Error en la petición" });
    }
}
