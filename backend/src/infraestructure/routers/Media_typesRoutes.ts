import { Router, Request } from 'express';
import { Media_typesAdapter } from "../adapter/Media_typesAdapter";
import { Media_typesApplication } from "../../application/Media_typesApplication";
import { Media_typesController } from "../controller/Media_typesController";

//Express
const router = Router();
//Inicialización de capas
const media_typesAdapter = new Media_typesAdapter();
const media_typesApp = new Media_typesApplication(media_typesAdapter);
const media_typesController = new Media_typesController(media_typesApp);


router.post("/media_types", async (Request, Response)=>{
    try {
      await  media_typesController.registerMedia_type(Request, Response);
    } catch (error) {
        console.error("Error en media type:"+ error);
        Response.status(400).json({message: "Error en la creación de la media type" });
    }
});

router.get("/media_types/:id", async(Request, Response)=>{
    try {
        await  media_typesController.searchMedia_typeById(Request, Response);
      } catch (error) {
          console.error("Error en media type:"+ error);
          Response.status(400).json({message: "Error en media type" });
      }
})

router.get("/media_types/description/:description", async(Request, Response)=>{
    try {
        await  media_typesController.searchMedia_typeByDescription(Request, Response);
      } catch (error) {
          console.error("Error en media_types:"+ error);
          Response.status(400).json({message: "Error en media_types" });
      }
})

router.delete("/media_types/:id", async (Request, Response) => {
    try {
      await media_typesController.downMedia_type(Request, Response);
    } catch (error) {
      console.error("Error eliminando media_types: " + error);
      Response.status(400).json({ message: "Error eliminando media_types" });
    }
  });
  
  router.put("/media_types/:id", async (Request, Response) => {
    try {
      await media_typesController.updateMedia_type(Request, Response);
    } catch (error) {
      console.error("Error actualizando media_types: " + error);
      Response.status(400).json({ message: "Error actualizando media_types" });
    }
  });

  router.get("/media_types", async (Request, Response)=>{
    try {
      await media_typesController.allMedia_types(Request, Response);
    } catch (error) {
      console.error("Error en media_types: " + error);
      Response.status(400).json({ message: "Error en media_types" });
    }
  });
  
export default router;