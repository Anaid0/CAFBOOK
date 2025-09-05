import { Crops } from "../domain/Crops";
import { CropsPort } from "../domain/CropsPort";

export class CropsApplication {
    private port: CropsPort;

    constructor(port: CropsPort) {
        this.port = port;
    }

    // Crear cultivo
    async createCrop(crop: Omit<Crops, "crop_id">): Promise<number> {
        const existingCrop = await this.port.getCropById(crop.user_id);
        if (!existingCrop) {
            return await this.port.createCrop(crop);
        }
        throw new Error("El cultivo ya existe para este usuario");
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

    
    async getCropById(crop_id: number): Promise<Crops | null> {
        return await this.port.getCropById(crop_id);
    }

    async getAllCrops(): Promise<Crops[]> {
        return await this.port.getAllCrops();
    }

}
