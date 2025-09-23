import { Repository } from "typeorm";
import { Medias } from "../../domain/entities/Medias";
import { MediasPort } from "../../domain/port/MediasPort";
import { MediasEntity } from "../entities/MediasEntity";
import { AppDataSource } from "../config/con_data_bases";
import { PostsEntity } from "../entities/PostsEntity";
import { Media_typesEntity } from "../entities/Media_typesEntity";

export class MediasAdapter implements MediasPort {
  private mediasRepository: Repository<MediasEntity>;

  constructor() {
    this.mediasRepository = AppDataSource.getRepository(MediasEntity);
  }

  private toDomain(entity: MediasEntity): Medias {
    return {
      media_id: entity.media_id,
      post_id: entity.post_id.post_id,
      media_type_id: entity.media_type_id.media_type_id,
      media_type_description: entity.media_type_id.description,
      file_url: entity.file_url,
      uploaded_at: entity.uploaded_at,
    };
  }

  private toEntity(domain: Omit<Medias, "media_id">): MediasEntity {
    const entity = new MediasEntity();
    const post = new PostsEntity();
    const media_type = new Media_typesEntity();

    post.post_id = domain.post_id;
    media_type.media_type_id = domain.media_type_id;

    entity.post_id = post;
    entity.media_type_id = media_type;
    entity.file_url = domain.file_url;
    entity.uploaded_at = domain.uploaded_at;
    return entity;
  }

  async createMedia(media: Omit<Medias, "media_id">): Promise<number> {
    try {
      const newEntity = this.toEntity(media);
      const savedEntity = await this.mediasRepository.save(newEntity);
      return savedEntity.media_id;
    } catch (error) {
      console.error("Error creando media:", error);
      throw new Error("Error creando media");
    }
  }

  async updateMedia(media_id: number, media: Partial<Medias>): Promise<boolean> {
    try {
      const existing = await this.mediasRepository.findOne({ where: { media_id } });
      if (!existing) {
        throw new Error("Media no encontrada");
      }

      Object.assign(existing, {
        post_id: media.post_id ?? existing.post_id,
        media_type_id: media.media_type_id ?? existing.media_type_id,
        file_url: media.file_url ?? existing.file_url,
        uploaded_at: media.uploaded_at ?? existing.uploaded_at,
      });

      await this.mediasRepository.save(existing);
      return true;
    } catch (error) {
      console.error("Error actualizando media:", error);
      throw new Error("Error actualizando media");
    }
  }

  async deleteMedia(media_id: number): Promise<boolean> {
    try {
      const existing = await this.mediasRepository.findOne({ where: { media_id } });
      if (!existing) {
        throw new Error("Media no encontrada");
      }
      await this.mediasRepository.delete({ media_id });
      return true;
    } catch (error) {
      console.error("Error eliminando media:", error);
      throw new Error("Error eliminando media");
    }
  }

  async getAllMedias(): Promise<Medias[]> {
    try {
      const entities = await this.mediasRepository.find();
      return entities.map((entity) => this.toDomain(entity));
    } catch (error) {
      console.error("Error obteniendo todas las medias:", error);
      throw new Error("Error obteniendo todas las medias");
    }
  }

  async getMediaById(media_id: number): Promise<Medias | null> {
    try {
      const entity = await this.mediasRepository.findOne({ where: { media_id } });
      return entity ? this.toDomain(entity) : null;
    } catch (error) {
      console.error("Error obteniendo media por ID:", error);
      throw new Error("Error obteniendo media por ID");
    }
  }

  async getMediaByMediaTypeId(media_type_id: number): Promise<Medias[]> {
    try {
      const entities = await this.mediasRepository.find({ relations:["post_id", "media_type_id"] });

      const filtered = entities.filter(MediasEntity => MediasEntity.media_type_id.media_type_id === media_type_id);

      return filtered.map(entity => this.toDomain(entity));
    } catch (error) {
      console.error("Error obteniendo medias por media_type_id:", error);
      throw new Error("Error obteniendo medias por media_type_id");
    }
  }
  
  async getMediaByPostId(post_id: number): Promise<Medias[]> {
    try {
      const entities = await this.mediasRepository.find({ relations:["post_id", "media_type_id"] });

      const filtered = entities.filter(MediasEntity => MediasEntity.post_id.post_id === post_id);

      return filtered.map(entity => this.toDomain(entity));
    } catch (error) {
      console.error("Error obteniendo medias por post_id:", error);
      throw new Error("Error obteniendo medias por post_id");
    }
  }

}
