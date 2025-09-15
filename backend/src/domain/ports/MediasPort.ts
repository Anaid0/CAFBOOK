import { Medias } from "../models/Medias";
export interface MediasPort {
    createMedia(media: Omit<Medias, "media_id">): Promise<number>;
    updateMedia(media_id: number, media: Partial<Medias>): Promise<boolean>;
    deleteMedia(media_id: number): Promise<boolean>;
    getAllMedias(): Promise<Medias[]>;
    getMediaById(media_id: number): Promise<Medias | null>;
    getMediaByMediaTypeId(media_type_id: number): Promise<Medias[]>;
  }