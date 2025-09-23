import { CropsApplication } from "../../application/CropsApplication";
import { Crops } from "../../domain/Crops";
import { Request, Response } from "express";
import { Validators } from "../config/validations";
import e from "cors";

export class CropsController {
  private app: CropsApplication;

  constructor(app: CropsApplication) {
    this.app = app;
  }

  async registerCrop(request: Request, response: Response): Promise<Response> {
    const { user_id, crop_type_id, latitude, longitude} = request.body;
    try {
      if (!user_id || isNaN(Number(user_id))) {
        return response.status(400).json({ message: "ID de usuario inválido" });
      }

      if (!crop_type_id || isNaN(Number(crop_type_id))) {
        return response.status(400).json({ message: "ID de tipo de cultivo inválido" });
      }

      if (latitude === undefined || isNaN(Number(latitude))) {
        return response.status(400).json({ message: "Latitud inválida" });
      }

      if (longitude === undefined || isNaN(Number(longitude))) {
        return response.status(400).json({ message: "Longitud inválida" });
      }

      const crop: Omit<Crops, "crop_id" | "user_email" | "crop_type_description"> = {
        user_id: Number(user_id),
        crop_type_id: Number(crop_type_id),
        latitude: Number(latitude),
        longitude: Number(longitude),
        created_at: new Date
      };

      const cropId = await this.app.createCrop(crop);

      return response.status(201).json({
        message: "Cultivo registrado exitosamente",
        cropId,
      });
    } catch (error) {
      if (error instanceof Error) {
        return response.status(500).json({ message: "Error en el servidor" });
      }
      return response.status(400).json({ message: "Error en la petición" });
    }
  }

  async searchCropById(request: Request, response: Response): Promise<Response> {
    try {
      const cropId = parseInt(request.params.id);
      if (isNaN(cropId)) {
        return response.status(400).json({ message: "Error en parámetro" });
      }

      const crop = await this.app.getCropById(cropId);
      if (!crop) {
        return response.status(404).json({ message: "Cultivo no encontrado" });
      }

      return response.status(200).json(crop);
    } catch (error) {
      if (error instanceof Error) {
        return response.status(500).json({ message: "Error en el servidor" });
      }
      return response.status(400).json({ message: "Error en la petición" });
    }
  }

  async searchCropsByCropTypeId(request: Request, response: Response): Promise<Response> {
    try {
      const cropTypeId = parseInt(request.params.id);
      if (isNaN(cropTypeId)) {
        return response.status(400).json({ error: "ID de tipo de cultivo no válido" });
      }

      const crops = await this.app.getCropByCropTypeId(cropTypeId);
      if (!crops || crops.length === 0) {
        return response.status(404).json({ message: "No se encontraron cultivos de este tipo" });
      }

      return response.status(200).json(crops);
    } catch (error) {
      if (error instanceof Error) {
        return response.status(500).json({ message: "Error en el servidor" });
      }
      return response.status(400).json({ message: "Error en la petición" });
    }
  }

  async searchCropsByCropTypeDescription(request: Request, response: Response): Promise<Response> {
    try {
      const { name } = request.params;
      if (!Validators.name(name)) {
      return response.status(400).json({ error: "Nombre de tipo de cultivo no válido" });
    }
    const crops = await this.app.getCropByCropTypeDescription(name);
    if (!crops || crops.length === 0) {
    return response.status(404).json({ message: "No se encontraron cultivos para ese tipo de cultivo" });
  }

    const result = crops.map(crops => ({
    crop_id: crops.crop_id,
    user_id: crops.user_id,
    user_email: crops.user_email,
    crop_type_id: crops.crop_type_id,
    crop_type_description: crops.crop_type_description,
    latitude: crops.latitude,
    longitude: crops.longitude,
    created_at: crops.created_at
  }));
  
  return response.status(200).json(result);
} catch (error) {
  return response.status(500).json({ message: "Error en el servidor" });
  }
}

  async searchCropsByUserEmail(request: Request, response: Response): Promise<Response> {
    try {
      const { email } = request.params;
      if (!Validators.email(email)) {
      return response.status(400).json({ error: "Nombre de tipo de cultivo no válido" });
    }
    const crops = await this.app.getCropByCropTypeUserEmail(email);
    if (!crops || crops.length === 0) {
    return response.status(404).json({ message: "No se encontraron cultivos para ese usuario" });
  }

    const result = crops.map(crops => ({
    crop_id: crops.crop_id,
    user_id: crops.user_id,
    user_email: crops.user_email,
    crop_type_id: crops.crop_type_id,
    crop_type_description: crops.crop_type_description,
    latitude: crops.latitude,
    longitude: crops.longitude,
    created_at: crops.created_at
  }));
  
  return response.status(200).json(result);
} catch (error) {
  return response.status(500).json({ message: "Error en el servidor" });
  }
  }

  async allCrops(request: Request, response: Response): Promise<Response> {
    try {
      const crops = await this.app.getAllCrops();
      return response.status(200).json(crops);
    } catch (error) {
      if (error instanceof Error) {
        return response.status(500).json({ message: "Error en el servidor" });
      }
      return response.status(400).json({ message: "Error en la petición" });
    }
  }

  async downCrop(request: Request, response: Response): Promise<Response> {
    try {
      const cropId = parseInt(request.params.id);
      if (isNaN(cropId)) {
        return response.status(400).json({ message: "Error en parámetro" });
      }

      const deleted = await this.app.deleteCrop(cropId);
      if (!deleted) {
        return response.status(404).json({ message: "Cultivo no encontrado" });
      }

      return response.status(200).json({ message: "Cultivo eliminado exitosamente" });
    } catch (error) {
      if (error instanceof Error) {
        return response.status(500).json({ message: "Error en el servidor" });
      }
      return response.status(400).json({ message: "Error en la petición" });
    }
  }

  async updateCrop(request: Request, response: Response): Promise<Response> {
    try {
      const cropId = parseInt(request.params.id);
      if (isNaN(cropId)) {
        return response.status(400).json({ message: "Error en parámetro" });
      }

      const { user_id, crop_type_id, latitude, longitude, created_at } = request.body;

      if (user_id && isNaN(Number(user_id))) {
        return response.status(400).json({ message: "ID de usuario inválido" });
      }

      if (crop_type_id && isNaN(Number(crop_type_id))) {
        return response.status(400).json({ message: "ID de tipo de cultivo inválido" });
      }

      if (latitude !== undefined && isNaN(Number(latitude))) {
        return response.status(400).json({ message: "Latitud inválida" });
      }

      if (longitude !== undefined && isNaN(Number(longitude))) {
        return response.status(400).json({ message: "Longitud inválida" });
      }

      if (created_at && !Validators.date(created_at)) {
        return response.status(400).json({ message: "Fecha inválida" });
      }

      const updated = await this.app.updateCrop(cropId, {
        user_id,
        crop_type_id,
        latitude,
        longitude,
        created_at: created_at ? new Date(created_at) as any : undefined,
      });

      if (!updated) {
        return response.status(404).json({ message: "Cultivo no encontrado o sin cambios" });
      }

      return response.status(200).json({ message: "Cultivo actualizado exitosamente" });
    } catch (error) {
      if (error instanceof Error) {
        return response.status(500).json({ message: "Error en el servidor" });
      }
      return response.status(400).json({ message: "Error en la petición" });
    }
  }
}
