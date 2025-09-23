import { PostsApplication } from "../../application/PostsApplication";
import { Posts } from "../../domain/domain/Posts";
import { Request, Response } from "express";
import { Validators } from "../config/validations";

export class PostsController {
  private app: PostsApplication;

  constructor(app: PostsApplication) {
    this.app = app;
  }

  async registerPost(request: Request, response: Response): Promise<Response> {
    const { tittle, description, post_category_id, user_id} = request.body;
    try {
      if (!tittle || !Validators.tittle(tittle)) {
        return response.status(400).json({ message: "Título inválido" });
      }

      if (!description || !Validators.description(description)) {
        return response.status(400).json({ message: "Descripción inválida" });
      }

      if (!post_category_id || isNaN(Number(post_category_id))) {
        return response.status(400).json({ message: "ID de categoría inválido" });
      }

      if (!user_id || isNaN(Number(user_id))) {
        return response.status(400).json({ message: "ID de usuario inválido" });
      }

      const post: Omit<Posts, "post_id" | "user_email" | "post_category_description"| "deleted_at"> = {
        tittle: tittle.trim(),
        description: description.trim(),
        post_category_id: Number(post_category_id),
        user_id: Number(user_id),
        status: 1,
        created_at: new Date 
      };

      const postId = await this.app.createPost(post);

      return response.status(201).json({
        message: "Post creado exitosamente",
        postId,
      });
    } catch (error) {
      if (error instanceof Error) {
        return response.status(500).json({ message: "Error en el servidor" });
      }
    }
    return response.status(400).json({ message: "Error en la petición" });
  }

  async searchPostById(request: Request, response: Response): Promise<Response> {
    try {
      const postId = parseInt(request.params.id);
      if (isNaN(postId)) {
        return response.status(400).json({ message: "Error en parámetro" });
      }

      const post = await this.app.getPostById(postId);
      if (!post) {
        return response.status(404).json({ message: "Post no encontrado" });
      }

      return response.status(200).json(post);
    } catch (error) {
      if (error instanceof Error) {
        return response.status(500).json({ message: "Error en el servidor" });
      }
    }
    return response.status(400).json({ message: "Error en la petición" });
  }

  async searchPostByPostCategoryId(request: Request, response: Response): Promise<Response> {
    try {
      const postcategoryId = parseInt(request.params.id);
      if (isNaN(postcategoryId)) {
        return response.status(400).json({ error: "ID de categoría no válido" });
      }

      const posts = await this.app.getPostByPostCategoryById(postcategoryId);
      if (!posts || posts.length === 0) {
        return response.status(404).json({ message: "No se encontraron posts en esta categoría" });
      }

      return response.status(200).json(posts);
    } catch (error) {
      if (error instanceof Error) {
        return response.status(500).json({ message: "Error en el servidor" });
      }
    }
    return response.status(400).json({ message: "Error en la petición" });
  }

  async searchPostByPostCategoryDescription(request: Request, response: Response): Promise<Response> {
    try {
      const { name } = request.params;
      if (!Validators.name(name)) {
        return response.status(400).json({ error: "Nombre de categoria no válido" });
      }
      const posts = await this.app.getPostByPostCategorieDescription(name);
      if (!posts || posts.length === 0) {
        return response.status(404).json({ message: "No se encontraron posts en esta categoría" });
      }

      return response.status(200).json(posts);
    } catch (error) {
      if (error instanceof Error) {
        return response.status(500).json({ message: "Error en el servidor" });
      }
    }
    return response.status(400).json({ message: "Error en la petición" });
  }

  async searchPostByUserEmail(request: Request, response: Response): Promise<Response> {
    try {
      const { email } = request.params;

      const posts = await this.app.getPostByPostUserEmail(email);
      if (!posts || posts.length === 0) {
        return response.status(404).json({ message: "No se encontraron posts en esta categoría" });
      }
      const result = posts.map(posts => ({
        post_id: posts.post_id,
        tittle: posts.tittle,
        description: posts.description,
        post_category: posts.post_category_id,
        post_category_description: posts.post_category_description,
        user_id: posts.user_id,
        user_email: posts.user_email,
        status: posts.status,
        created_at: new Date
      }));

      return response.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) {
        return response.status(500).json({ message: "Error en el servidor" });
      }
    }
    return response.status(400).json({ message: "Error en la petición" });
  }

  async searchPostByUserId(request: Request, response: Response): Promise<Response> {
    try {
      const userId = parseInt(request.params.id);
      if (isNaN(userId)) {
        return response.status(400).json({ error: "ID de usuario no válido" });
      }

      const posts = await this.app.getPostByPostUserId(userId);
      if (!posts || posts.length === 0) {
        return response.status(404).json({ message: "No se encontraron posts por id de user" });
      }

      return response.status(200).json(posts);
    } catch (error) {
      if (error instanceof Error) {
        return response.status(500).json({ message: "Error en el servidor" });
      }
    }
    return response.status(400).json({ message: "Error en la petición" });
  }

  async allPosts(request: Request, response: Response): Promise<Response> {
    try {
      const posts = await this.app.getAllPosts();
      return response.status(200).json(posts);
    } catch (error) {
      if (error instanceof Error) {
        return response.status(500).json({ message: "Error en el servidor" });
      }
    }
    return response.status(400).json({ message: "Error en la petición" });
  }

  async allPostsActive(request: Request, response: Response): Promise<Response> {
    try {
      const status = 1;
      const posts = await this.app.getAllPostsActive(status);
      return response.status(200).json(posts);
    } catch (error) {
      if (error instanceof Error) {
        return response.status(500).json({ message: "Error en el servidor" });
      }
    }
    return response.status(400).json({ message: "Error en la petición" });
  }

  async downPost(request: Request, response: Response): Promise<Response> {
    try {
      const postId = parseInt(request.params.id);
      if (isNaN(postId)) {
        return response.status(400).json({ message: "Error en parámetro" });
      }

      const deleted = await this.app.deletePost(postId);
      if (!deleted) {
        return response.status(404).json({ message: "Post no encontrado" });
      }

      return response.status(200).json({ message: "Post eliminado exitosamente" });

    } catch (error) {
      if (error instanceof Error) {
        return response.status(500).json({ message: "Error en el servidor" });
      }
    }
    return response.status(400).json({ message: "Error en la petición" });
  }

  async restorePost(request: Request, response: Response): Promise<Response> {
    try {
      const postId = parseInt(request.params.id);
      if (isNaN(postId)) {
        return response.status(400).json({ message: "Error en parámetro" });
      }

      const restored = await this.app.restorePost(postId);
      if (!restored) {
        return response.status(404).json({ message: "Post no encontrado" });
      }

      return response.status(200).json({ message: "Post restaurado exitosamente" });

    } catch (error) {
      if (error instanceof Error) {
        return response.status(500).json({ message: "Error en el servidor" });
      }
    }
    return response.status(400).json({ message: "Error en la petición" });
  }

  async updatePost(request: Request, response: Response): Promise<Response> {
    try {
      const postId = parseInt(request.params.id);
      if (isNaN(postId)) {
        return response.status(400).json({ message: "Error en parámetro" });
      }

      const { tittle, description, post_category_id, user_id, creates_at } = request.body;

      if (tittle && !Validators.tittle(tittle)) {
        return response.status(400).json({ message: "Título inválido" });
      }

      if (description && !Validators.description(description)) {
        return response.status(400).json({ message: "Descripción inválida" });
      }

      if (post_category_id && isNaN(Number(post_category_id))) {
        return response.status(400).json({ message: "ID de categoría inválido" });
      }

      if (user_id && isNaN(Number(user_id))) {
        return response.status(400).json({ message: "ID de usuario inválido" });
      }

      if (creates_at && !Validators.date(creates_at)) {
        return response.status(400).json({ message: "Fecha inválida" });
      }

      const updated = await this.app.updatePost(postId, {
        tittle,
        description,
        post_category_id,
        user_id,
        created_at: new Date
      });

      if (!updated) {
        return response.status(404).json({ message: "Post no encontrado o sin cambios" });
      }

      return response.status(200).json({ message: "Post actualizado exitosamente" });
    } catch (error) {
      if (error instanceof Error) {
        return response.status(500).json({ message: "Error en el servidor" });
      }
    }
    return response.status(400).json({ message: "Error en la petición" });
  }
}
