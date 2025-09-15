import { Repository } from "typeorm";
import { Posts } from "../../domain/Posts";
import { PostsPort } from "../../domain/PostsPort";
import { PostsEntity } from "../entities/PostsEntity";
import { AppDataSource } from "../config/con_data_bases";

export class PostsAdapter implements PostsPort {
  private postsRepository: Repository<PostsEntity>;

  constructor() {
    this.postsRepository = AppDataSource.getRepository(PostsEntity);
  }

  private toDomain(entity: PostsEntity): Posts {
    return {
      post_id: entity.post_id,
      tittle: entity.tittle,
      description: entity.description,
      post_category_id: entity.post_category_id,
      user_id: entity.user_id,
      creates_at: entity.creates_at,
    };
  }

  private toEntity(domain: Omit<Posts, "post_id">): PostsEntity {
    const entity = new PostsEntity();
    entity.tittle = domain.tittle;
    entity.description = domain.description;
    entity.post_category_id = domain.post_category_id;
    entity.user_id = domain.user_id;
    entity.creates_at = domain.creates_at;
    return entity;
  }

  async createPost(post: Omit<Posts, "post_id">): Promise<number> {
    try {
      const newEntity = this.toEntity(post);
      const savedEntity = await this.postsRepository.save(newEntity);
      return savedEntity.post_id;
    } catch (error) {
      console.error("Error creando post:", error);
      throw new Error("Error creando post");
    }
  }

  async updatePost(post_id: number, post: Partial<Posts>): Promise<boolean> {
    try {
      const existing = await this.postsRepository.findOne({ where: { post_id } });
      if (!existing) {
        throw new Error("Post no encontrado");
      }

      Object.assign(existing, {
        tittle: post.tittle ?? existing.tittle,
        description: post.description ?? existing.description,
        post_category_id: post.post_category_id ?? existing.post_category_id,
        user_id: post.user_id ?? existing.user_id,
        creates_at: post.creates_at ?? existing.creates_at,
      });

      await this.postsRepository.save(existing);
      return true;
    } catch (error) {
      console.error("Error actualizando post:", error);
      throw new Error("Error actualizando post");
    }
  }

  async deletePost(post_id: number): Promise<boolean> {
    try {
      const existing = await this.postsRepository.findOne({ where: { post_id } });
      if (!existing) {
        throw new Error("Post no encontrado");
      }
      await this.postsRepository.delete({ post_id });
      return true;
    } catch (error) {
      console.error("Error eliminando post:", error);
      throw new Error("Error eliminando post");
    }
  }

  async getAllPosts(): Promise<Posts[]> {
    try {
      const entities = await this.postsRepository.find();
      return entities.map((entity) => this.toDomain(entity));
    } catch (error) {
      console.error("Error obteniendo todos los posts:", error);
      throw new Error("Error obteniendo todos los posts");
    }
  }

  async getPostById(post_id: number): Promise<Posts | null> {
    try {
      const entity = await this.postsRepository.findOne({ where: { post_id } });
      return entity ? this.toDomain(entity) : null;
    } catch (error) {
      console.error("Error obteniendo post por ID:", error);
      throw new Error("Error obteniendo post por ID");
    }
  }

  async getPostByPostCategorieId(post_category_id: number): Promise<Posts[]> {
    try {
      const entities = await this.postsRepository.find({ where: { post_category_id } });
      return entities.map((entity) => this.toDomain(entity));
    } catch (error) {
      console.error("Error obteniendo posts por categoría:", error);
      throw new Error("Error obteniendo posts por categoría");
    }
  }
}
