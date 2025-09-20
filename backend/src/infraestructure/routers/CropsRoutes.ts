import { Router, Request } from 'express';
import { CropsAdapter } from "../adapter/CropsAdapter";
import { CropsApplication } from "../../application/CropsApplication";
import { CropsController } from "../controller/CropsController";


const router = Router();


const cropsAdapter = new CropsAdapter();
const cropsApp = new CropsApplication(cropsAdapter);
const cropsController = new CropsController(cropsApp);


router.post("/crops", async (Request, Response)=> {
    try {
    await cropsController.registerCrop(Request, Response);
  } catch (error) {
    console.error("Error en cultivo: " + error);
    Response.status(400).json({ message: "Error en la creación del cultivo" });
  }
});

router.get("/crops/:id", async (Request, Response) => {
    try {
    await cropsController.searchCropById(Request, Response);
  } catch (error) {
    console.error("Error en cultivo: " + error);
    Response.status(400).json({ message: "Error buscando el cultivo" });
  }
});

router.get("/crops/type/:id", async (Request, Response) => {
    try {
    await cropsController.searchCropsByCropTypeId(Request, Response);
  } catch (error) {
    console.error("Error en cultivo: " + error);
    Response.status(400).json({ message: "Error buscando el cultivo" });
  }
});

router.get("/crops", async (Request, Response) => {
    try {
    await cropsController.allCrops(Request, Response);
  } catch (error) {
    console.error("Error en cultivos: " + error);
    Response.status(400).json({ message: "Error buscando tpdos los cultivos" });
  }
});

router.get("/crops/type/name/:name", async (Request, Response) => {
    try {
    await cropsController.searchCropsByCropTypeDescription(Request, Response);
  } catch (error) {
    console.error("Error en cultivo: " + error);
    Response.status(400).json({ message: "Error buscando el cultivo" });
  }
});

router.get("/crops/email/:email", async (Request, Response) => {
    try {
    await cropsController.searchCropsByCropTypeId(Request, Response);
  } catch (error) {
    console.error("Error en cultivo: " + error);
    Response.status(400).json({ message: "Error buscando el cultivo por email de usuario" });
  }
});

router.put("/crops/:id", async (Request, Response) => {
    try {
    await cropsController.updateCrop(Request, Response);
  } catch (error) {
    console.error("Error en cultivo: " + error);
    Response.status(400).json({ message: "Error actualizando el cultivo" });
  }
});

router.delete("/crops/:id", async (Request, Response) => {
    try {
    await cropsController.searchCropsByCropTypeId(Request, Response);
  } catch (error) {
    console.error("Error en cultivo: " + error);
    Response.status(400).json({ message: "Error eliminando el cultivo" });
  }
});

export default router;
