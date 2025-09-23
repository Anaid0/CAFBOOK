import { Repository } from "typeorm";
import { Comments } from "../../domain/domain/Comments";
import { CommentsPort } from "../../domain/ports/CommentsPort";
import { CommentsEntity } from "../entities/CommentsEntity";
import { AppDataSource } from "../config/con_data_bases";
import { UserEntity } from "../entities/UsersEntity";
import { PostsEntity } from "../entities/PostsEntity";

export class CommentsAdapter implements CommentsPort {
  private commentsRepository: Repository<CommentsEntity>;

  constructor() {
    this.commentsRepository = AppDataSource.getRepository(CommentsEntity);
  }

  private toDomain(entity: CommentsEntity): Comments {
    return {
      comment_id: entity.comment_id,
      user_id: entity.user_id.user_id,
      user_name: `${entity.user_id.firts_name} ${entity.user_id.last_name}`,
      post_id: entity.post_id.post_id,
      content: entity.content,
      created_at: entity.created_at,
    };
  }

  private toEntity(domain: Omit<Comments, "comment_id" >): CommentsEntity {
    const entity = new CommentsEntity();
    const user = new UserEntity();
    const post = new PostsEntity();

    user.user_id = domain.user_id;
    post.post_id = domain.post_id;

    entity.user_id = user;
    entity.post_id = post;
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

    if (comment.user_id) {
      const user = new UserEntity();
      user.user_id = comment.user_id;
      existing.user_id = user;
    }

    if (comment.post_id) {
      const post = new PostsEntity();
      post.post_id = comment.post_id;
      existing.post_id = post;
    }

    if (comment.content) {
      existing.content = comment.content;
    }

    if (comment.created_at) {
      existing.created_at = comment.created_at;
    }

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
      const entity = await this.commentsRepository.findOne({ where: { comment_id }, relations:["user_id", "post_id"] });
      return entity ? this.toDomain(entity) : null;
    } catch (error) {
      console.error("Error obteniendo comentario por ID:", error);
      throw new Error("Error obteniendo comentario por ID");
    }
  }

  async getCommentsByUserId(user_id: number): Promise<Comments[]> {
    try {
      const entities = await this.commentsRepository.find({relations:["user_id"]});
      
      const filtered = entities.filter(CommentsEntity => CommentsEntity.user_id.user_id === user_id);

      return filtered.map(entity => this.toDomain(entity));
    } catch (error) {
      console.error("Error obteniendo comentarios por usuario:", error);
      throw new Error("Error obteniendo comentarios por usuario");
    }
  }

  async getCommentsByUserEmail(email: string): Promise<Comments[]> {
    try {
      const entities = await this.commentsRepository.find({relations:["user_id", "post_id"]});
      
      const filtered = entities.filter(CommentsEntity => CommentsEntity.user_id.email === email);

      return filtered.map(entity => this.toDomain(entity));
    } catch (error) {
      console.error("Error obteniendo comentarios por usuario:", error);
      throw new Error("Error obteniendo comentarios por usuario");
    }
  }
  async getCommentsByPostId(post_id: number): Promise<Comments[]> {
    try {
      const entities = await this.commentsRepository.find({relations:["post_id"]});
      
      const filtered = entities.filter(CommentsEntity => CommentsEntity.post_id.post_id === post_id);

      return filtered.map(entity => this.toDomain(entity));
    } catch (error) {
      console.error("Error obteniendo comentarios por publicacion:", error);
      throw new Error("Error obteniendo comentarios por publicacion");
    }
  }
}
