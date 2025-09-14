import { Medias } from "../domain/Medias"
import { MediasPort } from '../domain/MediasPort';

export class MediasApplication {
    private port: MediasPort;

    constructor(port: MediasPort) {
        this.port = port;
    }

    async createMedia(media: Omit<Medias, "media_id">): Promise<number> {
        const existingMedia = await this.port.getMediaByMediaTypeId(media.media_type_id);
        if (existingMedia.length === 0) {
            return await this.port.createMedia(media);
        }
        throw new Error("Ya existe una media de este tipo");
    }

    async updateMedia(media_id: number, media: Partial<Medias>): Promise<boolean> {
        const existingPost = await this.port.getMediaById(media_id);
        if (!existingPost) {
            throw new Error("La media no existe");
        }

        if (media.media_type_id) {
            const mediasInType = await this.port.getMediaByMediaTypeId(media.media_type_id);
            const conflict = mediasInType.find(media => media.media_id !== media_id);
            if (conflict) {
                throw new Error("Error al actualizar: ya existe otra media de otro tipo");
            }
        }
        return await this.port.updateMedia(media_id, media);
    }

    async deleteMedia(media_id: number): Promise<boolean> {
        const existingMedia = await this.port.getMediaById(media_id);
        if (!existingMedia) {
            throw new Error("No se encontró la media");
        }
        return await this.port.deleteMedia(media_id);
    }

    async getMediaById(media_id: number): Promise<Medias | null> {
        return await this.port.getMediaById(media_id);
    }

    async getMediaByMediaTypeId(media_id: number): Promise<Medias[]> {
        return await this.port.getMediaByMediaTypeId(media_id);
    }

    async getAllMedias(): Promise<Medias[]> {
        return await this.port.getAllMedias();
    }
}
