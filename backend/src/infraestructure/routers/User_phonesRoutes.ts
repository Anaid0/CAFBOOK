import { Router, Request, Response } from "express";
import { User_phonesAdapter } from "../adapter/User_phonesAdapter";
import { User_phonesApplication } from "../../application/User_phonesApplication";
import { User_phonesController } from "../controller/User_phonesController";

const router = Router();

const userPhoneAdapter = new User_phonesAdapter();
const userPhoneApp = new User_phonesApplication(userPhoneAdapter);
const userPhoneController = new User_phonesController(userPhoneApp);

router.post("/user_phones", async (req: Request, res: Response) => {
  try {
    await userPhoneController.registerUserPhone(req, res);
  } catch (error) {
    console.error("Error en creación de teléfono de usuario:", error);
    res.status(400).json({ message: "Error en la creación del teléfono de usuario" });
  }
});

router.get("/user_phones", async (req: Request, res: Response) => {
  try {
    await userPhoneController.allUserPhones(req, res);
  } catch (error) {
    console.error("Error listando teléfonos de usuario:", error);
    res.status(400).json({ message: "Error listando teléfonos de usuario" });
  }
});

router.get("/user_phones/:id", async (req: Request, res: Response) => {
  try {
    await userPhoneController.searchUserPhoneById(req, res);
  } catch (error) {
    console.error("Error en búsqueda de teléfono de usuario:", error);
    res.status(400).json({ message: "Error en búsqueda de teléfono de usuario" });
  }
});

router.get("/user_phones/phones/:phone_id", async (req: Request, res: Response) => {
  try {
    await userPhoneController.searchUserPhoneById(req, res);
  } catch (error) {
    console.error("Error en búsqueda de teléfonos por usuario:", error);
    res.status(400).json({ message: "Error en búsqueda de teléfonos por usuario" });
  }
});

router.get("/user_phones/user/:id", async (req: Request, res: Response) => {
  try {
    await userPhoneController.searchUserPhonesByUserId(req, res);
  } catch (error) {
    console.error("Error en búsqueda de teléfono de usuario:", error);
    res.status(400).json({ message: "Error en búsqueda de teléfono de usuario" });
  }
});

router.get("/user_phones/user/email/:email", async (req: Request, res: Response) => {
  try {
    await userPhoneController.searchUserPhonesByUserEmail(req, res);
  } catch (error) {
    console.error("Error en búsqueda de teléfono de usuario:", error);
    res.status(400).json({ message: "Error en búsqueda de teléfono de usuario" });
  }
});

router.delete("/user_phones/:id", async (req: Request, res: Response) => {
  try {
    await userPhoneController.downUserPhone(req, res);
  } catch (error) {
    console.error("Error eliminando teléfono de usuario:", error);
    res.status(400).json({ message: "Error eliminando teléfono de usuario" });
  }
});

router.put("/user_phones/:id", async (req: Request, res: Response) => {
  try {
    await userPhoneController.updateUserPhone(req, res);
  } catch (error) {
    console.error("Error actualizando teléfono de usuario:", error);
    res.status(400).json({ message: "Error actualizando teléfono de usuario" });
  }
});

export default router;
