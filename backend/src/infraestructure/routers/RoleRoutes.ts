import { Router, Request } from 'express';
import { RoleAdapter } from "../adapter/RoleAdapter";
import { RoleApplication } from "../../application/RoleApplication";
import { RoleController } from "../controller/RoleController";

//Express
const router = Router();
//Inicialización de capas
const roleAdapter = new RoleAdapter();
const roleApp = new RoleApplication(roleAdapter);
const roleController = new RoleController(roleApp);
//Definición de rutas > endPoints ->especificacion de url
router.post("/role", async (Request, Response)=>{
    try {
      await  roleController.registerRole(Request, Response);
    } catch (error) {
        console.error("Error en rol:"+ error);
        Response.status(400).json({message: "Error en la creación del rol" });
    }
});

router.get("/role/:id", async(Request, Response)=>{
    try {
        await  roleController.searchRoleById(Request, Response);
      } catch (error) {
          console.error("Error en rol:"+ error);
          Response.status(400).json({message: "Error en rol" });
      }
})

router.get("/role/description/:description", async(Request, Response)=>{
    try {
        await  roleController.searchRoleByDescription(Request, Response);
      } catch (error) {
          console.error("Error en rol:"+ error);
          Response.status(400).json({message: "Error en rol" });
      }
})

router.delete("/role/:id", async (Request, Response) => {
    try {
      await roleController.downRole(Request, Response);
    } catch (error) {
      console.error("Error eliminando rol: " + error);
      Response.status(400).json({ message: "Error eliminando rol" });
    }
  });
  
  router.put("/rol/:id", async (Request, Response) => {
    try {
      await roleController.updateRole(Request, Response);
    } catch (error) {
      console.error("Error actualizando rol: " + error);
      Response.status(400).json({ message: "Error actualizando rol" });
    }
  });
  
export default router;