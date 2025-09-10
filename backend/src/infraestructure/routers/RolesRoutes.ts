import { Router, Request } from 'express';
import { RolesAdapter } from "../adapter/RolesAdapter";
import { RolesApplication } from "../../application/RolesApplication";
import { RolesController } from "../controller/RolesController";


const router = Router();

const roleAdapter = new RolesAdapter();
const roleApp = new RolesApplication(roleAdapter);
const roleController = new RolesController(roleApp);


router.post("/roles", async (Request, Response)=>{
    try {
      await  roleController.registerRole(Request, Response);
    } catch (error) {
        console.error("Error en rol:"+ error);
        Response.status(400).json({message: "Error en la creación del rol" });
    }
});

router.get("/roles", async(Request, Response)=>{
    try {
        await  roleController.allRoles(Request, Response);
      } catch (error) {
          console.error("Error en roles:"+ error);
          Response.status(400).json({message: "Error en roles" });
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

router.get("/roles/description/:description",  async(Request, Response)=>{
    try {
        await  roleController.searchRoleByDescription(Request, Response);
      } catch (error) {
          console.error("Error en descripción:"+ error);
          Response.status(400).json({message: "Error en descripción" });
      }
})

router.delete("/roles/:id", async (Request, Response) => {
    try {
      await roleController.downRole(Request, Response);
    } catch (error) {
      console.error("Error eliminando rol: " + error);
      Response.status(400).json({ message: "Error eliminando rol" });
    }
  });
  
  router.put("/roles/:id", async (Request, Response) => {
    try {
      await roleController.updateRole(Request, Response);
    } catch (error) {
      console.error("Error actualizando rol: " + error);
      Response.status(400).json({ message: "Error actualizando rol" });
    }
  });
  
export default router;