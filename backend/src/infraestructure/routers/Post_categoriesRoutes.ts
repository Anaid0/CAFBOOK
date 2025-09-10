import { Router, Request } from 'express';
import { Post_categoriesAdapter } from "../adapter/Post_categoriesAdapter";
import { Post_categoriesApplication } from "../../application/Post_categoriesApplication";
import { Post_categoriesController } from "../controller/Post_categoriesController";

//Express
const router = Router();
//Inicialización de capas
const post_categoriesAdapter = new Post_categoriesAdapter();
const post_categoriesApp = new Post_categoriesApplication(post_categoriesAdapter);
const post_categoriesController = new Post_categoriesController(post_categoriesApp);


router.post("/post_categories", async (Request, Response)=>{
    try {
      await  post_categoriesController.registerPost_category(Request, Response);
    } catch (error) {
        console.error("Error en categoria post:"+ error);
        Response.status(400).json({message: "Error en la creación de la categoria post" });
    }
});

router.get("/post_categories/:id", async(Request, Response)=>{
    try {
        await  post_categoriesController.searchPost_categoryById(Request, Response);
      } catch (error) {
          console.error("Error en rol:"+ error);
          Response.status(400).json({message: "Error en rol" });
      }
})

router.get("/post_categories/description/:description", async(Request, Response)=>{
    try {
        await  post_categoriesController.searchPost_categoryByDescription(Request, Response);
      } catch (error) {
          console.error("Error en categoria de post:"+ error);
          Response.status(400).json({message: "Error en categoria de post" });
      }
})

router.delete("/post_categories/:id", async (Request, Response) => {
    try {
      await post_categoriesController.downPost_category(Request, Response);
    } catch (error) {
      console.error("Error eliminando categoria de post: " + error);
      Response.status(400).json({ message: "Error eliminando categoria de post" });
    }
  });
  
  router.put("/post_categories/:id", async (Request, Response) => {
    try {
      await post_categoriesController.updatePost_category(Request, Response);
    } catch (error) {
      console.error("Error actualizando categoria de post: " + error);
      Response.status(400).json({ message: "Error actualizando categoria de post" });
    }
  });

  router.get("/post_categories", async (Request, Response)=>{
    try {
      await post_categoriesController.allPost_categories(Request, Response);
    } catch (error) {
      console.error("Error en categorias post: " + error);
      Response.status(400).json({ message: "Error en categorias post" });
    }
  });
  
export default router;