import { Router, Request, Response } from 'express';
import { RolesAdapter } from "../adapter/RolesAdapter";
import { RolesApplication } from "../../application/RolesApplication";
import { RolesController } from "../controller/RolesController";

//Expreps
const router = Router();
//Inicialización de capas
const roleAdapter = new RolesAdapter();
const roleApp = new RolesApplication(roleAdapter);
const roleController = new RolesController(roleApp);

//Definición de rutas > endPoints ->especificacion de url
router.post("/role", async (req, res)=>{
    try {
      await  roleController.registerRole(req, res);
    } catch (error) {
        console.error("Error en rol:"+ error);
        res.status(400).json({message: "Error en la creación del rol" });
    }
});

router.get("/role/:id", async(req, res)=>{
    try {
        await  roleController.searchRoleById(req, res);
      } catch (error) {
          console.error("Error en rol:"+ error);
          res.status(400).json({message: "Error en rol" });
      }
})

router.get("/role/description/:description", async(req, res)=>{
    try {
        await  roleController.searchRoleByDescription(req, res);
      } catch (error) {
          console.error("Error en rol:"+ error);
          res.status(400).json({message: "Error en rol" });
      }
})

router.delete("/role/:id", async (req, res) => {
    try {
      await roleController.downRole(req, res);
    } catch (error) {
      console.error("Error eliminando rol: " + error);
      res.status(400).json({ message: "Error eliminando rol" });
    }
  });
  
  router.put("/rol/:id", async (req, res) => {
    try {
      await roleController.updateRole(req, res);
    } catch (error) {
      console.error("Error actualizando rol: " + error);
      res.status(400).json({ message: "Error actualizando rol" });
    }
  });

  router.post("/rol", async (req, res) =>{
    try {
      await roleController.registerRole(req, res);
    } catch (error) {
      console.error("Error creando rol: " + error);
      res.status(400).json({ message: "Error creando rol" });
    }
  });

  router.get("/roles", async (req, res)=> {
    try {
      await roleController.allRoles(req, res);
    } catch (error) {
      console.error("Error en roles: " + error);
      res.status(400).json({ message: "Error en roles" });
    }
  });
  
export default router;