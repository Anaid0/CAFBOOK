import { Router, Request } from 'express';
import { PostsAdapter } from "../adapter/PostsAdapter";
import { PostsApplication } from "../../application/PostsApplication";
import { PostsController } from "../controller/PostsController";

const router = Router();

const postsAdapter = new PostsAdapter();
const postsApp = new PostsApplication(postsAdapter);
const postsController = new PostsController(postsApp);

router.post("/posts", async (Request, Response) => {
  try {
    await postsController.registerPost(Request, Response);
  } catch (error) {
    console.error("Error creando post: " + error);
    Response.status(400).json({ message: "Error creando post" });
  }
});

router.get("/posts/all", async (Request, Response) => {
  try {
    await postsController.allPosts(Request, Response);
  } catch (error) {
    console.error("Error obteniendo posts" + error);
    Response.status(400).json({ message: "Error obteniendo post por ID" });
  }
});

router.get("/posts", async (Request, Response) => {
  try {
    await postsController.allPostsActive(Request, Response);
  } catch (error) {
    console.error("Error obteniendo posts eliminados" + error);
    Response.status(400).json({ message: "Error obteniendo post por ID" });
  }
});

router.get("/posts/:id", async (Request, Response) => {
  try {
    await postsController.searchPostById(Request, Response);
  } catch (error) {
    console.error("Error obteniendo post por ID: " + error);
    Response.status(400).json({ message: "Error obteniendo post por ID" });
  }
});

router.get("/posts/user/:id", async (Request, Response) => {
  try {
    await postsController.searchPostByUserId(Request, Response);
  } catch (error) {
    console.error("Error obteniendo post por ID: " + error);
    Response.status(400).json({ message: "Error obteniendo post por ID" });
  }
});

router.get("/posts/user/email/:email", async (Request, Response) => {
  try {
    await postsController.searchPostByUserEmail(Request, Response);
  } catch (error) {
    console.error("Error obteniendo post por ID: " + error);
    Response.status(400).json({ message: "Error obteniendo post por email" });
  }
});

router.get("/posts/category/:categoryId", async (Request, Response) => {
  try {
    await postsController.searchPostByCategoryIdAndActive(Request, Response);
  } catch (error) {
    console.error("Error obteniendo posts por categoría: " + error);
    Response.status(400).json({ message: "Error obteniendo posts por categoría" });
  }
});

router.get("/posts/category/name/:name", async (Request, Response) => {
  try {
    await postsController.searchPostByPostCategoryDescription(Request, Response);
  } catch (error) {
    console.error("Error obteniendo posts por categoría: " + error);
    Response.status(400).json({ message: "Error obteniendo posts por categoría" });
  }
});

router.get("/posts/user/:userId/category/:categoryId", async (Request, Response) => {
  try {
    await postsController.searchPostByUserIdAndCategoryId(Request, Response);
  } catch (error) {
    console.error("Error obteniendo posts por categoría y user: " + error);
    Response.status(400).json({ message: "Error obteniendo posts por categoría y por user" });
  }
});

router.get("/posts/category/all/all", async (Request, Response) => {
  try {
    await postsController.allPosts(Request, Response);
  } catch (error) {
    console.error("Error obteniendo posts por categoría y user: " + error);
    Response.status(400).json({ message: "Error obteniendo posts por categoría y por user" });
  }
});

router.put("/posts/:id", async (Request, Response) => {
  try {
    await postsController.updatePost(Request, Response);
  } catch (error) {
    console.error("Error actualizando post: " + error);
    Response.status(400).json({ message: "Error actualizando post" });
  }
});

router.put("/posts/restore/:id", async (Request, Response) => {
  try {
    await postsController.restorePost(Request, Response);
  } catch (error) {
    console.error("Error actualizando post: " + error);
    Response.status(400).json({ message: "Error actualizando post" });
  }
});

router.delete("/posts/:id", async (Request, Response) => {
  try {
    await postsController.downPost(Request, Response);
  } catch (error) {
    console.error("Error eliminando post: " + error);
    Response.status(400).json({ message: "Error eliminando post" });
  }
});


router.get("/posts", async (Request, Response) => {
  try {
    await postsController.allPostsActive(Request, Response);
  } catch (error) {
    console.error("Error obteniendo todos los posts: " + error);
    Response.status(400).json({ message: "Error obteniendo todos los posts" });
  }
});

export default router;
