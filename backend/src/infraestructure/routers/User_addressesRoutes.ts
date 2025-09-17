import { Router, Request } from 'express';
import { User_addressAdapter } from "../adapter/User_addressesAdapter";
import { User_addressApplication } from "../../application/User_addressesApplication";
import { User_addressController } from "../controller/User_addressesController";

const router = Router();

const user_addressAdapter = new User_addressAdapter();
const user_addressApp = new User_addressApplication(user_addressAdapter);
const user_addressController = new User_addressController(user_addressApp);


router.post("/user_addresses", async (Request, Response) => {
  try {
    await user_addressController.registerUserAddress(Request, Response);
  } catch (error) {
    console.error("Error en dirección de usuario: " + error);
    Response.status(400).json({ message: "Error en la creación de la dirección de usuario" });
  }
});


router.get("/user_addresses", async (Request, Response) => {
  try {
    await user_addressController.allUserAddresses(Request, Response);
  } catch (error) {
    console.error("Error en dirección de usuario: " + error);
    Response.status(400).json({ message: "Error listando direcciones de usuario" });
  }
});


router.get("/user_addresses/:id", async (Request, Response) => {
  try {
    await user_addressController.searchUserAddressById(Request, Response);
  } catch (error) {
    console.error("Error en dirección de usuario: " + error);
    Response.status(400).json({ message: "Error en búsqueda por ID de dirección de usuario" });
  }
});


router.get("/user_addresses/user/:id", async (Request, Response) => {
  try {
    await user_addressController.searchUserAddressByAddressId(Request, Response);
  } catch (error) {
    console.error("Error en búsqueda por user_id: " + error);
    Response.status(400).json({ message: "Error en búsqueda de direcciones por usuario" });
  }
});


router.delete("/user_addresses/:id", async (Request, Response) => {
  try {
    await user_addressController.downUserAddress(Request, Response);
  } catch (error) {
    console.error("Error eliminando dirección: " + error);
    Response.status(400).json({ message: "Error eliminando dirección de usuario" });
  }
});


router.put("/user_addresses/:id", async (Request, Response) => {
  try {
    await user_addressController.updateUserAddress(Request, Response);
  } catch (error) {
    console.error("Error actualizando dirección: " + error);
    Response.status(400).json({ message: "Error actualizando dirección de usuario" });
  }
});

export default router;
