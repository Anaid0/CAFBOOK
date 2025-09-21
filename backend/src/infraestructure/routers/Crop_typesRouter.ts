import { Router } from "express";
import { Crop_typesAdapter } from "../adapter/Crop_typesAdapter";
import { Crop_typesApplication } from "../../application/Crop_typesApplication";
import { Crop_typesController } from "../controller/Crop_typesController";

const router = Router();

const crop_typeAdapter = new Crop_typesAdapter();
const crop_typeApp = new Crop_typesApplication(crop_typeAdapter);
const crop_typeController = new Crop_typesController(crop_typeApp);

router.post("/crop_types", async (req, res) => {
  try {
    await crop_typeController.registerCrop_types(req, res);
  } catch (error) {
    console.error("Error creando tipo de cultivo:", error);
    res.status(400).json({ message: "Error creando tipo de cultivo" });
  }
});

router.get("/crop_types", async (req, res) => {
  try {
    await crop_typeController.allCrop_types(req, res);
  } catch (error) {
    console.error("Error obteniendo tipos de cultivo:", error);
    res.status(400).json({ message: "Error obteniendo tipos de cultivo" });
  }
});

router.get("/crop_types/:id", async (req, res) => {
  try {
    await crop_typeController.searchCrop_typeById(req, res);
  } catch (error) {
    console.error("Error obteniendo tipo de cultivo:", error);
    res.status(400).json({ message: "Error obteniendo tipo de cultivo" });
  }
});

router.get("/crop_types/description/:description", async (req, res) => {
  try {
    await crop_typeController.searchCrop_typeByDescription(req, res);
  } catch (error) {
    console.error("Error obteniendo tipo de cultivo:", error);
    res.status(400).json({ message: "Error obteniendo tipo de cultivo" });
  }
});

router.put("/crop_types/:id", async (req, res) => {
  try {
    await crop_typeController.updateCrop_type(req, res);
  } catch (error) {
    console.error("Error actualizando tipo de cultivo:", error);
    res.status(400).json({ message: "Error actualizando tipo de cultivo" });
  }
});

router.delete("/crop_types/:id", async (req, res) => {
  try {
    await crop_typeController.downCrop_type(req, res);
  } catch (error) {
    console.error("Error eliminando tipo de cultivo:", error);
    res.status(400).json({ message: "Error eliminando tipo de cultivo" });
  }
});

export default router;
