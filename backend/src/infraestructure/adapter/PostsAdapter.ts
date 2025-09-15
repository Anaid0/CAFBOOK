import { Repository } from "typeorm";
import { Posts } from "../../domain/models/Posts";
import { PostsPort } from "../../domain/ports/PostsPort";
import { PostsEntity } from "../entities/PostsEntity";
import { AppDataSource } from "../config/con_data_bases";

export class PostsAdapter implements PostsPort {
  private postsRepository: Repository<PostsEntity>;

  constructor() {
    this.postsRepository = AppDataSource.getRepository(PostsEntity);
  }

  private toDomain(post: PostsEntity): Posts {
    return {
      post_id: post.post_id,
      tittle: post.tittle,
      description: post.description,
      post_category_id: post.post_category_id,
      user_id: post.user_id,
      creates_at: post.creates_at,
    };
  }

  private toEntity(domain: Omit<Posts, "post_id">): PostsEntity {
    const post = new PostsEntity();
    post.tittle = domain.tittle;
    post.description = domain.description;
    post.post_category_id = domain.post_category_id;
    post.user_id = domain.user_id;
    // ⚠️ Mejor dejar que la DB maneje created_at automáticamente
    if (domain.creates_at) post.creates_at = domain.creates_at;
    return post;
  }

  async createPost(post: Omit<Posts, "post_id">): Promise<number> {
    try {
      const newEntity = this.toEntity(post);
      const savedEntity = await this.postsRepository.save(newEntity);
      return savedEntity.post_id;
    } catch (error) {
      console.error("Error creando post:", error);
      throw error instanceof Error ? error : new Error("Error creando post");
    }
  }

  async updatePost(post_id: number, post: Partial<Posts>): Promise<boolean> {
    try {
      const existing = await this.postsRepository.findOne({ where: { post_id } });
      if (!existing) throw new Error("Post no encontrado");

      Object.assign(existing, post);
      await this.postsRepository.save(existing);

      return true;
    } catch (error) {
      console.error("Error actualizando post:", error);
      throw error instanceof Error ? error : new Error("Error actualizando post");
    }
  }

  async deletePost(post_id: number): Promise<boolean> {
    try {
      const result = await this.postsRepository.delete(post_id);
      if (result.affected === 0) throw new Error("Post no encontrado");
      return true;
    } catch (error) {
      console.error("Error eliminando post:", error);
      throw error instanceof Error ? error : new Error("Error eliminando post");
    }
  }

  async getAllPosts(): Promise<Posts[]> {
    try {
      const entities = await this.postsRepository.find();
      return entities.map(this.toDomain);
    } catch (error) {
      console.error("Error obteniendo todos los posts:", error);
      throw error instanceof Error ? error : new Error("Error obteniendo todos los posts");
    }
  }

  async getPostById(post_id: number): Promise<Posts | null> {
    try {
      const entity = await this.postsRepository.findOne({ where: { post_id } });
      return entity ? this.toDomain(entity) : null;
    } catch (error) {
      console.error("Error obteniendo post por ID:", error);
      throw error instanceof Error ? error : new Error("Error obteniendo post por ID");
    }
  }

  async getPostByPostCategorieId(post_category_id: number): Promise<Posts[]> {
        try {
            const post = await this.postsRepository.findOne({ where: { post_category_id: 
              { post_category_id: post_category_id } }, 
 relations: ["post_category_id"]
            });
            return post ? this.toDomain(post) : null;
        } catch (error) {
            console.error("Error fetching phone by number type id ", error);
            throw new Error("Error fetching phone by number type id");
        }
    }
}
