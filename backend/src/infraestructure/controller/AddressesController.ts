import { AddressesApplication } from "../../application/AddressesApplication";
import { Addresses } from "../../domain/domain/Addresses";
import { Request, Response } from "express";
import { Validators } from "../config/validations";

export class AddressesController {
    private app: AddressesApplication;
    constructor(app: AddressesApplication) {
        this.app = app;
    }

    async registerAddress(request: Request, response: Response): Promise<Response> {
        const { street, vereda, postal_code, city_id } = request.body;
        try {
            if (!Validators.street(street))
                return response.status(400).json({ message: "Calle inválida" });

            if (vereda && !Validators.vereda(vereda))
                return response.status(400).json({ message: "Vereda inválida" });

            if (!Validators.postalCode(postal_code))
                return response.status(400).json({ message: "Código postal inválido" });

            if (!city_id || isNaN(Number(city_id))) {
                return response.status(400).json({ message: "ID de la ciudad inválido" });
            }

            const address: Omit<Addresses, "address_id" | "city_name"> = {
            street: street.trim(),
            vereda: vereda?.trim(),
            postal_code: postal_code.trim(),
            city_id: Number(city_id),
            };

            const addressId = await this.app.createAddress(address);

            return response.status(201).json({ message: "Dirección creada exitosamente", addressId });
        } catch (error) {
            if (error instanceof Error) {
                return response.status(500).json({ message: "Error en el servidor" });
            }
        }
        return response.status(400).json({ message: "Error en la petición" });
    }

    async searchAddressById(request: Request, response: Response): Promise<Response> {
        try {
            const addressId = parseInt(request.params.id);
            if (isNaN(addressId))
                return response.status(400).json({ message: "Error en parámetro" });

            const address = await this.app.getAddressById(addressId);
            if (!address)
                return response.status(404).json({ message: "Dirección no encontrada" });

            return response.status(200).json(address);
        } catch (error) {
            if (error instanceof Error) {
                return response.status(500).json({ message: "Error en el servidor" });
            }
        }
        return response.status(400).json({ message: "Error en la petición" });
    }

    async searchAddressByVereda(request: Request, response: Response): Promise<Response> {
        try {
            const { vereda } = request.params;
            if (!Validators.name(vereda))
                return response.status(400).json({ error: "Nombre de vereda no válido" });

            const address = await this.app.getAddressByVereda(vereda);
            if (!address)
                return response.status(404).json({ message: "Dirección no encontrada" });

            return response.status(200).json(address);
        } catch (error) {
            if (error instanceof Error) {
                return response.status(500).json({ message: "Error en el servidor" });
            }
        }
        return response.status(400).json({ message: "Error en la petición" });
    }

    async searchAddressByCityId(request: Request, response: Response): Promise<Response> {
        try {
            const id = parseInt(request.params.id);
            const address = await this.app.getAddressByCityId(id);
            if (!address)
                return response.status(404).json({ message: "Direcciones no encontradas por id de ciudad" });

            return response.status(200).json(address);
        } catch (error) {
            if (error instanceof Error) {
                return response.status(500).json({ message: "Error en el servidor" });
            }
        }
        return response.status(400).json({ message: "Error en la petición" });
    }

    async searchAddressByCityName(request: Request, response: Response): Promise<Response> {
    try {
        const { name } = request.params;
        if (!Validators.name(name)) {
            return response.status(400).json({ error: "Nombre de ciudad no válido" });
        }

        const addresses = await this.app.getAddressByCityName(name);
        if (!addresses || addresses.length === 0) {
            return response.status(404).json({ message: "Direcciones no encontradas para la ciudad" });
        }

        const result = addresses.map(addr => ({
            address_id: addr.address_id,
            street: addr.street,
            vereda: addr.vereda,
            postal_code: addr.postal_code,
            city_id: addr.city_id,
            city_name: addr.city_name
        }));

        return response.status(200).json(result);
    } catch (error) {
        console.error("Error searching addresses by city name:", error);
        return response.status(500).json({ message: "Error en el servidor" });
    }
}


    async allAddresses(request: Request, response: Response): Promise<Response> {
        try {
            const addresses = await this.app.getAllAddresses();
            return response.status(200).json(addresses);
        } catch (error) {
            if (error instanceof Error) {
                return response.status(500).json({ message: "Error en el servidor" });
            }
        }
        return response.status(400).json({ message: "Error en la petición" });
    }


    async deleteAddress(request: Request, response: Response): Promise<Response> {
        try {
            const addressId = parseInt(request.params.id);
            if (isNaN(addressId))
                return response.status(400).json({ message: "Error en parámetro" });

            const deleted = await this.app.deleteAddress(addressId);
            if (!deleted)
                return response.status(404).json({ message: "Dirección no encontrada" });

            return response.status(200).json({ message: "Dirección eliminada exitosamente" });
        } catch (error) {
            if (error instanceof Error) {
                return response.status(500).json({ message: "Error en el servidor" });
            }
        }
        return response.status(400).json({ message: "Error en la petición" });
    }


    async updateAddress(request: Request, response: Response): Promise<Response> {
        try {
            const addressId = parseInt(request.params.id);
            if (isNaN(addressId))
                return response.status(400).json({ message: "Error en parámetro" });

            const { street, vereda, postal_code, city_id } = request.body;

            if (street && !Validators.street(street))
                return response.status(400).json({ message: "Calle inválida" });

            if (vereda && !Validators.vereda(vereda))
                return response.status(400).json({ message: "Vereda inválida" });

            if (postal_code && !Validators.postalCode(postal_code))
                return response.status(400).json({ message: "Código postal inválido" });

            const updated = await this.app.updateAddress(addressId, { street, vereda, postal_code, city_id });
            if (!updated)
                return response.status(404).json({ message: "Dirección no encontrada o sin cambios" });

            return response.status(200).json({ message: "Dirección actualizada exitosamente" });
        } catch (error) {
            if (error instanceof Error) {
                return response.status(500).json({ message: "Error en el servidor" });
            }
        }
        return response.status(400).json({ message: "Error en la petición" });
    }
}
