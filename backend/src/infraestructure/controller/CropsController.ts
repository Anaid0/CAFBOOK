import { CropsApplication } from "../../application/CropsApplication";
import { Crops } from "../../domain/Crops";
import { Request, Response } from "express";

export class CropsController {
    private app: CropsApplication;

    constructor(app: CropsApplication) {
        this.app = app;
    }

    async registerCrop(request: Request, response: Response): Promise<Response> {
        const { user_id, crop_type, latitude, longitude } = request.body;

        try {
            // Validaciones
            if (!user_id || isNaN(user_id))
                return response.status(400).json({ message: "ID de usuario inválido" });

            if (!crop_type || typeof crop_type !== "string" || crop_type.trim().length < 3)
                return response.status(400).json({ message: "Tipo de cultivo inválido" });

            if (isNaN(latitude) || latitude < -90 || latitude > 90)
                return response.status(400).json({ message: "Latitud inválida" });

            if (isNaN(longitude) || longitude < -180 || longitude > 180)
                return response.status(400).json({ message: "Longitud inválida" });

            const crop: Omit<Crops, "crop_id"> = {
                user_id,
                crop_type: crop_type.trim(),
                latitude,
                longitude
            };

            const cropId = await this.app.createCrop(crop);
            return response.status(201).json({ message: "Cultivo registrado correctamente", cropId });

        } catch (error) {
            if (error instanceof Error) {
                return response.status(500).json({ message: "Error en el servidor" });
            }
        }
        return response.status(400).json({ message: "Error en la petición" });
    }

    async searchCropById(request: Request, response: Response): Promise<Response> {
        try {
            const cropId = parseInt(request.params.id);
            if (isNaN(cropId))
                return response.status(400).json({ message: "Parámetro inválido" });

            const crop = await this.app.getCropById(cropId);
            if (!crop) {
                return response.status(404).json({ message: "Cultivo no existe" });
            }
            return response.status(200).json(crop);
        } catch (error) {
            if (error instanceof Error) {
                return response.status(500).json({ message: "Error en el servidor" });
            }
        }
        return response.status(400).json({ message: "Error en la petición" });
    }

    async allCrops(request: Request, response: Response): Promise<Response> {
        try {
            const crops = await this.app.getAllCrops();
            return response.status(200).json(crops);
        } catch (error) {
            if (error instanceof Error) {
                return response.status(500).json({ message: "Error en el servidor" });
            }
        }
        return response.status(400).json({ message: "Error en la petición" });
    }

    async downCrop(request: Request, response: Response): Promise<Response> {
        try {
            const cropId = parseInt(request.params.id);
            if (isNaN(cropId))
                return response.status(400).json({ message: "Parámetro inválido" });

            const deleted = await this.app.deleteCrop(cropId);
            if (!deleted) {
                return response.status(404).json({ message: "Cultivo no existe" });
            }
            return response.status(200).json({ message: "Cultivo eliminado con éxito" });
        } catch (error) {
            if (error instanceof Error) {
                return response.status(500).json({ message: "Error en el servidor" });
            }
        }
        return response.status(400).json({ message: "Error en la petición" });
    }

    async updateCrop(request: Request, response: Response): Promise<Response> {
        try {
            const cropId = parseInt(request.params.id);
            if (isNaN(cropId))
                return response.status(400).json({ message: "Parámetro inválido" });

            const { user_id, crop_type, latitude, longitude } = request.body;

            // Validaciones
            if (user_id && isNaN(user_id))
                return response.status(400).json({ message: "ID de usuario inválido" });

            if (crop_type && (typeof crop_type !== "string" || crop_type.trim().length < 3))
                return response.status(400).json({ message: "Tipo de cultivo inválido" });

            if (latitude && (isNaN(latitude) || latitude < -90 || latitude > 90))
                return response.status(400).json({ message: "Latitud inválida" });

            if (longitude && (isNaN(longitude) || longitude < -180 || longitude > 180))
                return response.status(400).json({ message: "Longitud inválida" });

            const updated = await this.app.updateCrop(cropId, {
                user_id,
                crop_type: crop_type?.trim(),
                latitude,
                longitude
            });

            if (!updated)
                return response.status(404).json({ message: "Cultivo no encontrado o sin cambios" });

            return response.status(200).json({ message: "Cultivo actualizado con éxito" });

        } catch (error) {
            if (error instanceof Error)
                return response.status(500).json({ message: "Error en el servidor" });
        }
        return response.status(400).json({ message: "Error en la petición" });
    }
}
