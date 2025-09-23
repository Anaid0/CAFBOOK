import { Crops } from "../domain/entities/Crops";
import { CropsPort } from "../domain/port/CropsPort";

export class CropsApplication {
    private port: CropsPort;

    constructor(port: CropsPort) {
        this.port = port;
    }

    async createCrop(crop: Omit<Crops, "crop_id" | "user_email" | "crop_type_description">): Promise<number> {
        return await this.port.createCrop(crop);
    }

    async updateCrop(crop_id: number, crop: Partial<Crops>): Promise<boolean> {
        const existingCrop = await this.port.getCropById(crop_id);
        if (!existingCrop) {
            throw new Error("El cultivo no existe");
        }
        return await this.port.updateCrop(crop_id, crop);
    }

    async deleteCrop(crop_id: number): Promise<boolean> {
        const existingCrop = await this.port.getCropById(crop_id);
        if (!existingCrop) {
            throw new Error("No se encontró el cultivo");
        }
        return await this.port.deleteCrop(crop_id);
    }

    async getAllCrops(): Promise<Crops[]> {
        return await this.port.getAllCrops();
    }

    async getCropById(crop_id: number): Promise<Crops | null> {
        return await this.port.getCropById(crop_id);
    }

    async getCropByCropTypeId(crop_type_id: number): Promise<Crops[]> {
        return await this.port.getCropByCropTypeId(crop_type_id);
    }

    async getCropByCropTypeUserEmail(email: string): Promise<Crops[]>{
        return await this.port.getCropByCropTypeUserEmail(email);
    }
    
    async getCropByCropTypeDescription(crop_type_description: string): Promise<Crops[]>{
        return await this.port.getCropByCropTypeDescription(crop_type_description);
    }
}
