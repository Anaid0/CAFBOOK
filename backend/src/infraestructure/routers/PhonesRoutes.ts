import { Router } from "express";
import { PhonesAdapter } from "../adapter/PhonesAdapter";
import { PhonesApplication } from "../../application/PhonesApplication";
import { PhonesController } from "../controller/PhonesController";

const router = Router();

const phoneAdapter = new PhonesAdapter();
const phoneApp = new PhonesApplication(phoneAdapter);
const phoneController = new PhonesController(phoneApp);


router.post("/phones", async (req, res) => {
  try {
    await phoneController.registerPhone(req, res);
  } catch (error) {
    console.error("Error en teléfono: " + error);
    res.status(400).json({ message: "Error en la creación del teléfono" });
  }
});


router.get("/phones", async (req, res) => {
  try {
    await phoneController.allPhones(req, res);
  } catch (error) {
    console.error("Error en teléfonos: " + error);
    res.status(400).json({ message: "Error en teléfonos" });
  }
});

router.get("/phones/:id", async (req, res) => {
  try {
    await phoneController.searchPhoneById(req, res);
  } catch (error) {
    console.error("Error en teléfono: " + error);
    res.status(400).json({ message: "Error en teléfono" });
  }
});


router.get("/phones/type/:number_type_id", async (req, res) => {
  try {
    await phoneController.searchPhoneByNumber_type_id(req, res);
  } catch (error) {
    console.error("Error en tipo de número: " + error);
    res.status(400).json({ message: "Error en tipo de número" });
  }
});


router.delete("/phones/:id", async (req, res) => {
  try {
    await phoneController.downPhone(req, res);
  } catch (error) {
    console.error("Error eliminando teléfono: " + error);
    res.status(400).json({ message: "Error eliminando teléfono" });
  }
});


router.put("/phones/:id", async (req, res) => {
  try {
    await phoneController.updatePhone(req, res);
  } catch (error) {
    console.error("Error actualizando teléfono: " + error);
    res.status(400).json({ message: "Error actualizando teléfono" });
  }
});

export default router;
