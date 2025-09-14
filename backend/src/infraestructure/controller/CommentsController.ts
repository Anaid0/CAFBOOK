import { CommentsApplication } from "../../application/CommentsApplication";
import { Comments } from "../../domain/Comments";
import { Request, Response } from "express";
import { Validators } from "../config/validations";

export class CommentsController {
  private app: CommentsApplication;

  constructor(app: CommentsApplication) {
    this.app = app;
  }

  async registerComment(request: Request, response: Response): Promise<Response> {
    const { user_id, content, created_at } = request.body;
    try {
      if (!user_id || isNaN(Number(user_id))) {
        return response.status(400).json({ message: "ID de usuario inválido" });
      }

      if (!content || !Validators.description(content)) {
        return response.status(400).json({ message: "Contenido inválido" });
      }

      if (!created_at || !Validators.date(created_at)) {
        return response.status(400).json({ message: "Fecha inválida" });
      }

      const comment: Omit<Comments, "comment_id"> = {
        user_id: Number(user_id),
        content: content.trim(),
        created_at: new Date(created_at) as any,
      };

      const commentId = await this.app.createComment(comment);

      return response.status(201).json({
        message: "Comentario creado exitosamente",
        commentId,
      });
    } catch (error) {
      console.error("Error en registerComment:", error);
      return response.status(500).json({ message: "Error en el servidor" });
    }
  }

  async searchCommentById(request: Request, response: Response): Promise<Response> {
    try {
      const commentId = parseInt(request.params.id);
      if (isNaN(commentId)) {
        return response.status(400).json({ message: "Error en parámetro" });
      }

      const comment = await this.app.getCommentById(commentId);
      if (!comment) {
        return response.status(404).json({ message: "Comentario no encontrado" });
      }

      return response.status(200).json(comment);
    } catch (error) {
      console.error("Error en searchCommentById:", error);
      return response.status(500).json({ message: "Error en el servidor" });
    }
  }

  async searchCommentsByUserId(request: Request, response: Response): Promise<Response> {
    try {
      const userId = parseInt(request.params.id);
      if (isNaN(userId)) {
        return response.status(400).json({ message: "Error en parámetro" });
      }

      const comments = await this.app.getCommentsByUserId(userId);
      if (!comments || comments.length === 0) {
        return response.status(404).json({ message: "No se encontraron comentarios para este usuario" });
      }

      return response.status(200).json(comments);
    } catch (error) {
      console.error("Error en searchCommentsByUserId:", error);
      return response.status(500).json({ message: "Error en el servidor" });
    }
  }

  async allComments(request: Request, response: Response): Promise<Response> {
    try {
      const comments = await this.app.getAllComments();
      return response.status(200).json(comments);
    } catch (error) {
      console.error("Error en allComments:", error);
      return response.status(500).json({ message: "Error en el servidor" });
    }
  }

  async downComment(request: Request, response: Response): Promise<Response> {
    try {
      const commentId = parseInt(request.params.id);
      if (isNaN(commentId)) {
        return response.status(400).json({ message: "Error en parámetro" });
      }

      const deleted = await this.app.deleteComment(commentId);
      if (!deleted) {
        return response.status(404).json({ message: "Comentario no encontrado" });
      }

      return response.status(200).json({ message: "Comentario eliminado exitosamente" });
    } catch (error) {
      console.error("Error en downComment:", error);
      return response.status(500).json({ message: "Error en el servidor" });
    }
  }

  async updateComment(request: Request, response: Response): Promise<Response> {
    try {
      const commentId = parseInt(request.params.id);
      if (isNaN(commentId)) {
        return response.status(400).json({ message: "Error en parámetro" });
      }

      const { user_id, content, created_at } = request.body;

      if (user_id && isNaN(Number(user_id))) {
        return response.status(400).json({ message: "ID de usuario inválido" });
      }

      if (content && !Validators.description(content)) {
        return response.status(400).json({ message: "Contenido inválido" });
      }

      if (created_at && !Validators.date(created_at)) {
        return response.status(400).json({ message: "Fecha inválida" });
      }

      const updated = await this.app.updateComment(commentId, {
        user_id,
        content,
        created_at: created_at ? new Date(created_at) as any : undefined,
      });

      if (!updated) {
        return response.status(404).json({ message: "Comentario no encontrado o sin cambios" });
      }

      return response.status(200).json({ message: "Comentario actualizado exitosamente" });
    } catch (error) {
      console.error("Error en updateComment:", error);
      return response.status(500).json({ message: "Error en el servidor" });
    }
  }
}
