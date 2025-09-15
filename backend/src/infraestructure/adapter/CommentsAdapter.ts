import { Repository } from "typeorm";
import { Comments } from "../../domain/Comments";
import { CommentsPort } from "../../domain/CommentsPort";
import { CommentsEntity } from "../entities/CommentsEntity";
import { AppDataSource } from "../config/con_data_bases";

export class CommentsAdapter implements CommentsPort {
  private commentsRepository: Repository<CommentsEntity>;

  constructor() {
    this.commentsRepository = AppDataSource.getRepository(CommentsEntity);
  }

  private toDomain(entity: CommentsEntity): Comments {
    return {
      comment_id: entity.comment_id,
      user_id: entity.user_id,
      content: entity.content,
      created_at: entity.created_at,
    };
  }

  private toEntity(domain: Omit<Comments, "comment_id">): CommentsEntity {
    const entity = new CommentsEntity();
    entity.user_id = domain.user_id;
    entity.content = domain.content;
    entity.created_at = domain.created_at;
    return entity;
  }

  async createComments(comment: Omit<Comments, "comment_id">): Promise<number> {
    try {
      const newEntity = this.toEntity(comment);
      const savedEntity = await this.commentsRepository.save(newEntity);
      return savedEntity.comment_id;
    } catch (error) {
      console.error("Error creando comentario:", error);
      throw new Error("Error creando comentario");
    }
  }

  async updateComments(comment_id: number, comment: Partial<Comments>): Promise<boolean> {
    try {
      const existing = await this.commentsRepository.findOne({ where: { comment_id } });
      if (!existing) {
        throw new Error("Comentario no encontrado");
      }

      Object.assign(existing, {
        user_id: comment.user_id ?? existing.user_id,
        content: comment.content ?? existing.content,
        created_at: comment.created_at ?? existing.created_at,
      });

      await this.commentsRepository.save(existing);
      return true;
    } catch (error) {
      console.error("Error actualizando comentario:", error);
      throw new Error("Error actualizando comentario");
    }
  }

  async deleteComments(comment_id: number): Promise<boolean> {
    try {
      const existing = await this.commentsRepository.findOne({ where: { comment_id } });
      if (!existing) {
        throw new Error("Comentario no encontrado");
      }
      await this.commentsRepository.delete({ comment_id });
      return true;
    } catch (error) {
      console.error("Error eliminando comentario:", error);
      throw new Error("Error eliminando comentario");
    }
  }

  async getAllComments(): Promise<Comments[]> {
    try {
      const entities = await this.commentsRepository.find();
      return entities.map((entity) => this.toDomain(entity));
    } catch (error) {
      console.error("Error obteniendo todos los comentarios:", error);
      throw new Error("Error obteniendo todos los comentarios");
    }
  }

  async getCommentsById(comment_id: number): Promise<Comments | null> {
    try {
      const entity = await this.commentsRepository.findOne({ where: { comment_id } });
      return entity ? this.toDomain(entity) : null;
    } catch (error) {
      console.error("Error obteniendo comentario por ID:", error);
      throw new Error("Error obteniendo comentario por ID");
    }
  }

  async getCommentsByUserId(user_id: number): Promise<Comments[]> {
    try {
      const entities = await this.commentsRepository.find({ where: { user_id } });
      return entities.map((entity) => this.toDomain(entity));
    } catch (error) {
      console.error("Error obteniendo comentarios por usuario:", error);
      throw new Error("Error obteniendo comentarios por usuario");
    }
  }
}
