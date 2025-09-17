import { Router } from 'express';
import { Crop_typesAdapter } from '../adapter/Crop_typesAdapter';
import { Crop_typesApplication } from '../../application/Crop_typesApplication';
import { Crop_typesController } from '../controller/Crop_typesController';

const router = Router();

const crop_typeAdapter = new Crop_typesAdapter();
const crop_typeApp = new Crop_typesApplication(crop_typeAdapter);
const crop_typeController = new Crop_typesController(crop_typeApp);


router.post("/crop_types", async (Request, Response)=>{
    try {
      await  crop_typeController.registerCrop_types(Request, Response);
    } catch (error) {
        console.error("Error en rol:"+ error);
        Response.status(400).json({message: "Error en la creación del rol" });
    }
});

router.get("/crop_types", async(Request, Response)=>{
    try {
        await  crop_typeController.allCrop_types(Request, Response);
      } catch (error) {
          console.error("Error en roles:"+ error);
          Response.status(400).json({message: "Error en roles" });
      }
});

router.get("/crop_type/:id", async(Request, Response)=>{
    try {
        await  crop_typeController.searchCrop_typeById(Request, Response);
      } catch (error) {
          console.error("Error en rol:"+ error);
          Response.status(400).json({message: "Error en rol" });
      }
})

router.get("/crop_type/description/:description",  async(Request, Response)=>{
    try {
        await  crop_typeController.searchCrop_typeByDescription(Request, Response);
      } catch (error) {
          console.error("Error en descripción:"+ error);
          Response.status(400).json({message: "Error en descripción" });
      }
})

router.delete("/crop_type/:id", async (Request, Response) => {
    try {
      await crop_typeController.downCrop_type(Request, Response);
    } catch (error) {
      console.error("Error eliminando rol: " + error);
      Response.status(400).json({ message: "Error eliminando rol" });
    }
  });
  
  router.put("/crop_type/:id", async (Request, Response) => {
    try {
      await crop_typeController.updateCrop_type(Request, Response);
    } catch (error) {
      console.error("Error actualizando rol: " + error);
      Response.status(400).json({ message: "Error actualizando rol" });
    }
  });
  
export default router;