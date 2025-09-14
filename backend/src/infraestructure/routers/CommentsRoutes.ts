import { Router } from "express";
import { CommentsAdapter } from "../adapter/CommentsAdapter";
import { CommentsApplication } from "../../application/CommentsApplication";
import { CommentsController } from "../controller/CommentsController";

const router = Router();

const commentsAdapter = new CommentsAdapter();
const commentsApp = new CommentsApplication(commentsAdapter);
const commentsController = new CommentsController(commentsApp);


router.post("/comments", async (req, res) => {
  try {
    await commentsController.registerComment(req, res);
  } catch (error) {
    console.error("Error creando comentario:", error);
    res.status(400).json({ message: "Error creando comentario" });
  }
});


router.get("/comments/:id", async (req, res) => {
  try {
    await commentsController.searchCommentById(req, res);
  } catch (error) {
    console.error("Error obteniendo comentario por ID:", error);
    res.status(400).json({ message: "Error obteniendo comentario por ID" });
  }
});


router.get("/comments/user/:id", async (req, res) => {
  try {
    await commentsController.searchCommentsByUserId(req, res);
  } catch (error) {
    console.error("Error obteniendo comentarios por usuario:", error);
    res.status(400).json({ message: "Error obteniendo comentarios por usuario" });
  }
});


router.put("/comments/:id", async (req, res) => {
  try {
    await commentsController.updateComment(req, res);
  } catch (error) {
    console.error("Error actualizando comentario:", error);
    res.status(400).json({ message: "Error actualizando comentario" });
  }
});


router.delete("/comments/:id", async (req, res) => {
  try {
    await commentsController.downComment(req, res);
  } catch (error) {
    console.error("Error eliminando comentario:", error);
    res.status(400).json({ message: "Error eliminando comentario" });
  }
});


router.get("/comments", async (req, res) => {
  try {
    await commentsController.allComments(req, res);
  } catch (error) {
    console.error("Error obteniendo todos los comentarios:", error);
    res.status(400).json({ message: "Error obteniendo todos los comentarios" });
  }
});

export default router;
