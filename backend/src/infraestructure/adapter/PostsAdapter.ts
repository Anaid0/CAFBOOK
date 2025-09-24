import { Repository } from "typeorm";
import { Posts } from "../../domain/entities/Posts";
import { PostsPort } from "../../domain/port/PostsPort";
import { PostsEntity } from "../entities/PostsEntity";
import { AppDataSource } from "../config/con_data_bases";
import { UserEntity } from "../entities/UsersEntity";
import { Post_categoriesEntity } from "../entities/Post_categoriesEntity";

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
      post_category_id: entity.post_category_id.post_category_id,
      post_category_description: entity.post_category_id.description,
      user_id: entity.user_id.user_id,
      user_email: entity.user_id.email,      
      created_at: entity.created_at,
      status: entity.status,
      deleted_at: entity.deleted_at
    };
  }

  private toEntity(domain: Omit<Posts, "post_id">): PostsEntity {
    const entity = new PostsEntity();
    const user = new UserEntity();
    const post_category = new Post_categoriesEntity();

    user.user_id = domain.user_id;
    post_category.post_category_id = domain.post_category_id;

    entity.tittle = domain.tittle;
    entity.description = domain.description;
    entity.user_id = user;
    entity.post_category_id = post_category;
    entity.created_at = domain.created_at;
    entity.status = domain.status;
    entity.deleted_at = domain.deleted_at;

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
    const existing = await this.postsRepository.findOne({ where: { post_id }, relations: ["post_category_id", "user_id"] });
    if (!existing) throw new Error("Post no encontrado");

    if (post.post_category_id) {
      const category = new Post_categoriesEntity();
      category.post_category_id = post.post_category_id;
      existing.post_category_id = category;
    }

    if (post.user_id) {
      const user = new UserEntity();
      user.user_id = post.user_id;
      existing.user_id = user;
    }

    existing.tittle = post.tittle ?? existing.tittle;
    existing.description = post.description ?? existing.description;
    existing.created_at = post.created_at ?? existing.created_at;

    await this.postsRepository.save(existing);
    return true;
  } catch (error) {
    console.error("Error actualizando post:", error);
    throw new Error("Error actualizando post");
  }
}


  async deletePost(post_id: number): Promise<boolean> {
    try {
      const existing = await this.postsRepository.findOne({ where: { post_id: post_id} });
      if (!existing) {
        throw new Error("Post no encontrado");
      }

      Object.assign(existing,{
        status: 0,
        deleted_at: new Date()
      });

      await this.postsRepository.save(existing);
      return true;
    } catch (error) {
      console.error("Error eliminando post:", error);
      throw new Error("Error eliminando post");
    }
  }

  async restorePost(post_id: number): Promise<boolean> {
    const post = await this.postsRepository.findOne({ where: { post_id } });
    if (!post || post.status !== 0) return false;

    post.status = 1;
    post.deleted_at = null;
    await this.postsRepository.save(post);

  return true;
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

  async getAllPostsActive(status:1): Promise<Posts[]> {
    try {
      const entities = await this.postsRepository.find({where:{status: status}});
      return entities.map((entity) => this.toDomain(entity));
    } catch (error) {
      console.error("Error obteniendo todos los posts:", error);
      throw new Error("Error obteniendo todos los posts");
    }
  }

  async getPostById(post_id: number): Promise<Posts | null> {
    try {
      const entity = await this.postsRepository.findOne({ where: { post_id }, relations:["post_category_id", "user_id"] });
      return entity ? this.toDomain(entity) : null;
    } catch (error) {
      console.error("Error obteniendo post por ID:", error);
      throw new Error("Error obteniendo post por ID");
    }
  }

async getPostByPostCategoryId(post_category_id: number): Promise<Posts[]> {
    try {
      const entities = await this.postsRepository.find({relations:["post_category_id", "user_id"] });

      const filtered = entities.filter(Post_categories => Post_categories.post_category_id.post_category_id === post_category_id);

      return filtered.map(entity => this.toDomain(entity));
    } catch (error) {
      console.error("Error obteniendo posts por categoría:", error);
      throw new Error("Error obteniendo posts por categoría");
    }
  }

  async getPostByPostCategoryDescription(post_category_description: string): Promise<Posts[]> {
    try {
      const entities = await this.postsRepository.find({
        where: { post_category_id: { description: post_category_description } }, 
        relations: ["user_id", "post_category_id"],
      });
      return entities.map((entity) => this.toDomain(entity));
    } catch (error) {
      console.error("Error obteniendo posts por descripción de categoría:", error);
      throw new Error("Error obteniendo posts por descripción de categoría");
    }
  }

  async getPostByPostUserId(user_id: number): Promise<Posts[]> {
    try {
      const entities = await this.postsRepository.find({relations: ["user_id", "post_category_id"]
      });
      const filtered = entities.filter(PostsEntity => PostsEntity.user_id.user_id === user_id);

      return filtered.map(entity => this.toDomain(entity));
    } catch (error) {
      console.error("Error obteniendo posts por user_id:", error);
      throw new Error("Error obteniendo posts por user_id");
    }
  }

async getPostByPostUserEmail(user_email: string): Promise<Posts[]> {
  try {
    const entities = await this.postsRepository.find({
        relations: ["user_id", "post_category_id"],
      });

      const filtered = entities.filter(PostsEntity => PostsEntity.user_id.email === user_email);

      return filtered.map(entity => this.toDomain(entity));
  } catch (error) {
    console.error("Error obteniendo posts por user_email:", error);
    throw new Error("Error obteniendo posts por user_email");
  }
}

async getPostByUserIdAndCategoryId(user_id: number, post_category: number): Promise<Posts[]> {
  try {
    const entities = await this.postsRepository.find({
      relations: ["post_category_id"],
    });

    const filtered = entities.filter(PostsEntity =>PostsEntity.user_id.user_id === user_id &&
    PostsEntity.post_category_id.post_category_id === post_category
    );

    return filtered.map(entity => this.toDomain(entity));
  } catch (error) {
    console.error("Error obteniendo posts por user_id y post_category:", error);
    throw new Error("Error obteniendo posts por user_id y post_category");
  }
}

async getPostsByCategoryIdAndActive(post_category: number): Promise<Posts[]> {
  try {
    const entities = await this.postsRepository.find({
      relations: ["post_category_id"],
    });

    const filtered = entities.filter(PostsEntity =>PostsEntity.status === 1 &&
    PostsEntity.post_category_id.post_category_id === post_category
    );

    return filtered.map(entity => this.toDomain(entity));
  } catch (error) {
    console.error("Error obteniendo posts por user_id y post_category:", error);
    throw new Error("Error obteniendo posts por user_id y post_category");
  }
}


}