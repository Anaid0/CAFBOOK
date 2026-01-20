import { Router } from 'express';
import { PostsAdapter } from "../adapter/PostsAdapter";
import { PostsApplication } from "../../application/PostsApplication";
import { PostsController } from "../controller/PostsController";

const router = Router();

const postsAdapter = new PostsAdapter();
const postsApp = new PostsApplication(postsAdapter);
const postsController = new PostsController(postsApp);

// Crear post
router.post("/posts", async (req, res) => {
  try {
    await postsController.registerPost(req, res);
  } catch (error) {
    console.error("Error creando post: " + error);
    res.status(400).json({ message: "Error creando post" });
  }
});

// Obtener TODOS los posts (incluye eliminados)
router.get("/posts/all", async (req, res) => {
  try {
    await postsController.allPosts(req, res);
  } catch (error) {
    console.error("Error obteniendo posts: " + error);
    res.status(400).json({ message: "Error obteniendo posts" });
  }
});

// Obtener posts activos
router.get("/posts", async (req, res) => {
  try {
    await postsController.allPostsActive(req, res);
  } catch (error) {
    console.error("Error obteniendo posts activos: " + error);
    res.status(400).json({ message: "Error obteniendo posts activos" });
  }
});

// Buscar post por ID
router.get("/posts/:id", async (req, res) => {
  try {
    await postsController.searchPostById(req, res);
  } catch (error) {
    console.error("Error obteniendo post por ID: " + error);
    res.status(400).json({ message: "Error obteniendo post por ID" });
  }
});

// Posts por ID de usuario
router.get("/posts/user/:id", async (req, res) => {
  try {
    await postsController.searchPostByUserId(req, res);
  } catch (error) {
    console.error("Error obteniendo posts por usuario: " + error);
    res.status(400).json({ message: "Error obteniendo posts por usuario" });
  }
});

// Posts por email de usuario
router.get("/posts/user/email/:email", async (req, res) => {
  try {
    await postsController.searchPostByUserEmail(req, res);
  } catch (error) {
    console.error("Error obteniendo posts por email: " + error);
    res.status(400).json({ message: "Error obteniendo posts por email" });
  }
});

// Posts por categoría (solo activos)
router.get("/posts/category/:categoryId", async (req, res) => {
  try {
    await postsController.searchPostByCategoryIdAndActive(req, res);
  } catch (error) {
    console.error("Error obteniendo posts por categoría: " + error);
    res.status(400).json({ message: "Error obteniendo posts por categoría" });
  }
});

// Posts por nombre de categoría
router.get("/posts/category/name/:name", async (req, res) => {
  try {
    await postsController.searchPostByPostCategoryDescription(req, res);
  } catch (error) {
    console.error("Error obteniendo posts por nombre de categoría: " + error);
    res.status(400).json({ message: "Error obteniendo posts por nombre de categoría" });
  }
});

// Posts por user + category
router.get("/posts/user/:userId/category/:categoryId", async (req, res) => {
  try {
    await postsController.searchPostByUserIdAndCategoryId(req, res);
  } catch (error) {
    console.error("Error obteniendo posts por categoría y usuario: " + error);
    res.status(400).json({ message: "Error obteniendo posts por categoría y usuario" });
  }
});

// Actualizar post
router.put("/posts/:id", async (req, res) => {
  try {
    await postsController.updatePost(req, res);
  } catch (error) {
    console.error("Error actualizando post: " + error);
    res.status(400).json({ message: "Error actualizando post" });
  }
});

// Restaurar post
router.put("/posts/restore/:id", async (req, res) => {
  try {
    await postsController.restorePost(req, res);
  } catch (error) {
    console.error("Error restaurando post: " + error);
    res.status(400).json({ message: "Error restaurando post" });
  }
});

// Eliminar (baja lógica)
router.delete("/posts/:id", async (req, res) => {
  try {
    await postsController.downPost(req, res);
  } catch (error) {
    console.error("Error eliminando post: " + error);
    res.status(400).json({ message: "Error eliminando post" });
  }
});

export default router;
