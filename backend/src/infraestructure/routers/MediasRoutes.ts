import { Router, Request } from "express";
import { MediasAdapter } from "../adapter/MediasAdapter";
import { MediasApplication } from "../../application/MediasApplication";
import { MediasController } from "../controller/MediasController";

const router = Router();


const mediasAdapter = new MediasAdapter();
const mediasApp = new MediasApplication(mediasAdapter);
const mediasController = new MediasController(mediasApp);


router.post("/medias", async (Request, Response) => {
  try {
    await mediasController.registerMedia(Request, Response);
  } catch (error) {
    console.error("Error creando media: " + error);
    Response.status(400).json({ message: "Error creando media" });
  }
});


router.get("/medias/:id", async (Request, Response) => {
  try {
    await mediasController.searchMediaById(Request, Response);
  } catch (error) {
    console.error("Error obteniendo media por ID: " + error);
    Response.status(400).json({ message: "Error obteniendo media por ID" });
  }
});


router.get("/medias/type/:id", async (Request, Response) => {
  try {
    await mediasController.searchMediaByTypeId(Request, Response);
  } catch (error) {
    console.error("Error obteniendo medias por tipo: " + error);
    Response.status(400).json({ message: "Error obteniendo medias por tipo" });
  }
});


router.put("/medias/:id", async (Request, Response) => {
  try {
    await mediasController.updateMedia(Request, Response);
  } catch (error) {
    console.error("Error actualizando media: " + error);
    Response.status(400).json({ message: "Error actualizando media" });
  }
});


router.delete("/medias/:id", async (Request, Response) => {
  try {
    await mediasController.downMedia(Request, Response);
  } catch (error) {
    console.error("Error eliminando media: " + error);
    Response.status(400).json({ message: "Error eliminando media" });
  }
});


router.get("/medias", async (Request, Response) => {
  try {
    await mediasController.allMedias(Request, Response);
  } catch (error) {
    console.error("Error obteniendo todas las medias: " + error);
    Response.status(400).json({ message: "Error obteniendo todas las medias" });
  }
});

export default router;
