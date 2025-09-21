import { MediasApplication } from "../../application/MediasApplication";
import { Medias } from "../../domain/Medias";
import { Request, Response } from "express";
import { Validators } from "../config/validations";

export class MediasController {
  private app: MediasApplication;

  constructor(app: MediasApplication) {
    this.app = app;
  }

 async registerMedia(request: Request, response: Response): Promise<Response> {
  try {
    const { post_id } = request.body;

    if (!post_id || isNaN(Number(post_id))) {
      return response.status(400).json({ message: "ID de post inválido" });
    }

    if (!request.file) {
      return response.status(400).json({ message: "No se subió ningún archivo" });
    }

    const mimeType = request.file.mimetype;
    let media_type_id: number;

    if (mimeType === "application/pdf") media_type_id = 1; 
    else if (mimeType.startsWith("video/")) media_type_id = 2; 
    else if (mimeType.startsWith("image/")) media_type_id = 3; 
    else if (mimeType.startsWith("audio/")) media_type_id = 4; 
    else media_type_id = 5;

    const media: Omit<Medias, "media_id" | "media_type_description"> = {
      post_id: Number(post_id),
      media_type_id,
      file_url: request.file.path, 
      uploaded_at: new Date(),
    };

    const mediaId = await this.app.createMedia(media);

    return response.status(201).json({
      message: "Media creada exitosamente",
      mediaId,
      file_url: request.file.path,
      media_type_id,
    });
  } catch (error) {
    console.error("Error en registerMedia:", error);
    return response.status(500).json({ message: "Error en el servidor" });
  }
}

  async searchMediaById(request: Request, response: Response): Promise<Response> {
    try {
      const mediaId = parseInt(request.params.id);
      if (isNaN(mediaId)) {
        return response.status(400).json({ message: "Error en parámetro" });
      }

      const media = await this.app.getMediaById(mediaId);
      if (!media) {
        return response.status(404).json({ message: "Media no encontrada" });
      }

      return response.status(200).json(media);
    } catch (error) {
      return response.status(500).json({ message: "Error en el servidor" });
    }
  }

  async searchMediaByTypeId(request: Request, response: Response): Promise<Response> {
    try {
      const typeId = parseInt(request.params.id);
      if (isNaN(typeId)) {
        return response.status(400).json({ message: "Error en parámetro" });
      }

      const medias = await this.app.getMediaByMediaTypeId(typeId);
      if (!medias || medias.length === 0) {
        return response.status(404).json({ message: "No se encontraron medias con este tipo" });
      }

      return response.status(200).json(medias);
    } catch (error) {
      return response.status(500).json({ message: "Error en el servidor" });
    }
  }

  async searchMediaByPostId(request: Request, response: Response): Promise<Response> {
    try {
      const postId = parseInt(request.params.id);
      if (isNaN(postId)) {
        return response.status(400).json({ message: "Error en parámetro" });
      }

      const medias = await this.app.getMediaByPostId(postId);
      if (!medias || medias.length === 0) {
        return response.status(404).json({ message: "No se encontraron medias con este post" });
      }

      return response.status(200).json(medias);
    } catch (error) {
      return response.status(500).json({ message: "Error en el servidor" });
    }
  }

  async allMedias(request: Request, response: Response): Promise<Response> {
    try {
      const medias = await this.app.getAllMedias();
      return response.status(200).json(medias);
    } catch (error) {
      return response.status(500).json({ message: "Error en el servidor" });
    }
  }

  async downMedia(request: Request, response: Response): Promise<Response> {
    try {
      const mediaId = parseInt(request.params.id);
      if (isNaN(mediaId)) {
        return response.status(400).json({ message: "Error en parámetro" });
      }

      const deleted = await this.app.deleteMedia(mediaId);
      if (!deleted) {
        return response.status(404).json({ message: "Media no encontrada" });
      }

      return response.status(200).json({ message: "Media eliminada exitosamente" });
    } catch (error) {
      return response.status(500).json({ message: "Error en el servidor" });
    }
  }

  async updateMedia(request: Request, response: Response): Promise<Response> {
    try {
      const mediaId = parseInt(request.params.id);
      if (isNaN(mediaId)) {
        return response.status(400).json({ message: "Error en parámetro" });
      }

      const { post_id, media_type_id, file_url, uploaded_at } = request.body;

      if (post_id && isNaN(Number(post_id))) {
        return response.status(400).json({ message: "ID de post inválido" });
      }

      if (media_type_id && isNaN(Number(media_type_id))) {
        return response.status(400).json({ message: "ID de tipo de media inválido" });
      }

      if (file_url && !Validators.url(file_url)) {
        return response.status(400).json({ message: "URL inválida" });
      }

      if (uploaded_at && !Validators.date(uploaded_at)) {
        return response.status(400).json({ message: "Fecha inválida" });
      }

      const updated = await this.app.updateMedia(mediaId, {
        post_id,
        media_type_id,
        file_url,
        uploaded_at: uploaded_at ? new Date(uploaded_at) as any : undefined,
      });

      if (!updated) {
        return response.status(404).json({ message: "Media no encontrada o sin cambios" });
      }

      return response.status(200).json({ message: "Media actualizada exitosamente" });
    } catch (error) {
      return response.status(500).json({ message: "Error en el servidor" });
    }
  }
}
