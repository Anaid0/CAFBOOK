import { Repository } from "typeorm";
import { Crops } from "../../domain/models/Crops";
import { CropsPort } from "../../domain/ports/CropsPort";
import { CropsEntity } from "../entities/CropsEntity";
import { AppDataSource } from "../config/con_data_bases";

export class CropsAdapter implements CropsPort {
  private cropsRepository: Repository<CropsEntity>;

  constructor() {
    this.cropsRepository = AppDataSource.getRepository(CropsEntity);
  }

  private toDomain(entity: CropsEntity): Crops {
    return {
      crop_id: entity.crop_id,
      user_id: entity.user_id,
      crop_type_id: entity.crop_type_id,
      latitude: entity.latitude,
      longitude: entity.longitude,
      created_at: entity.created_at,
    };
  }

  private toEntity(domain: Omit<Crops, "crop_id">): CropsEntity {
    const entity = new CropsEntity();
    entity.user_id = domain.user_id;
    entity.crop_type_id = domain.crop_type_id;
    entity.latitude = domain.latitude;
    entity.longitude = domain.longitude;
    entity.created_at = domain.created_at;
    return entity;
  }

  async createCrop(crop: Omit<Crops, "crop_id">): Promise<number> {
    try {
      const newEntity = this.toEntity(crop);
      const savedEntity = await this.cropsRepository.save(newEntity);
      return savedEntity.crop_id;
    } catch (error) {
      console.error("Error creando crop:", error);
      throw new Error("Error creando crop");
    }
  }

  async updateCrop(crop_id: number, crop: Partial<Crops>): Promise<boolean> {
    try {
      const existing = await this.cropsRepository.findOne({ where: { crop_id } });
      if (!existing) {
        throw new Error("Crop no encontrado");
      }

      Object.assign(existing, {
        user_id: crop.user_id ?? existing.user_id,
        crop_type_id: crop.crop_type_id ?? existing.crop_type_id,
        latitude: crop.latitude ?? existing.latitude,
        longitude: crop.longitude ?? existing.longitude,
        created_at: crop.created_at ?? existing.created_at,
      });

      await this.cropsRepository.save(existing);
      return true;
    } catch (error) {
      console.error("Error actualizando crop:", error);
      throw new Error("Error actualizando crop");
    }
  }

  async deleteCrop(crop_id: number): Promise<boolean> {
    try {
      const existing = await this.cropsRepository.findOne({ where: { crop_id } });
      if (!existing) {
        throw new Error("Crop no encontrado");
      }
      await this.cropsRepository.delete({ crop_id });
      return true;
    } catch (error) {
      console.error("Error eliminando crop:", error);
      throw new Error("Error eliminando crop");
    }
  }

  async getAllCrops(): Promise<Crops[]> {
    try {
      const entities = await this.cropsRepository.find();
      return entities.map((entity) => this.toDomain(entity));
    } catch (error) {
      console.error("Error obteniendo todos los crops:", error);
      throw new Error("Error obteniendo todos los crops");
    }
  }

  async getCropById(crop_id: number): Promise<Crops | null> {
    try {
      const entity = await this.cropsRepository.findOne({ where: { crop_id } });
      return entity ? this.toDomain(entity) : null;
    } catch (error) {
      console.error("Error obteniendo crop por ID:", error);
      throw new Error("Error obteniendo crop por ID");
    }
  }

  async getCropByCropTypeId(crop_type_id: number): Promise<Crops[]> {
    try {
      const entities = await this.cropsRepository.find({ where: { crop_type_id } });
      return entities.map((entity) => this.toDomain(entity));
    } catch (error) {
      console.error("Error fetching crops by crop_type_id:", error);
      throw new Error("Error fetching crops by crop_type_id");
    }
  }
  
}

