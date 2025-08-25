import { Router, Request } from 'express';
import { UserAdapter } from "../adapter/UsersAdapter";
import { UserApplication } from "../../application/UsersApplication";
import { UserController } from "../controller/UsersController";

//Express
const router = Router();
//Inicialización de capas
const userAdapter = new UserAdapter();
const userApp = new UserApplication(userAdapter);
const userController = new UserController(userApp);
//Definición de rutas > endPoints ->especificacion de url
router.post("/users", async (Request, Response)=>{
    try {
      await  userController.registerUser(Request, Response);
    } catch (error) {
        console.error("Error en usuario:"+ error);
        Response.status(400).json({message: "Error en la creación del usuario" });
    }
});

router.get("/users", async(Request, Response)=>{
    try {
        await  userController.allUsers(Request, Response);
      } catch (error) {
          console.error("Error en usuarios:"+ error);
          Response.status(400).json({message: "Error en usuarios" });
      }
});

router.get("/users/:id", async(Request, Response)=>{
    try {
        await  userController.searchUserById(Request, Response);
      } catch (error) {
          console.error("Error en usuario:"+ error);
          Response.status(400).json({message: "Error en usuario" });
      }
})

router.get("/users/email/:email", async(Request, Response)=>{
    try {
        await  userController.searchUserByEmail(Request, Response);
      } catch (error) {
          console.error("Error en email:"+ error);
          Response.status(400).json({message: "Error en email" });
      }
})

router.delete("/users/:id", async (Request, Response) => {
    try {
      await userController.downUser(Request, Response);
    } catch (error) {
      console.error("Error eliminando usuario: " + error);
      Response.status(400).json({ message: "Error eliminando usuario" });
    }
  });
  
  router.put("/users/:id", async (Request, Response) => {
    try {
      await userController.updateUser(Request, Response);
    } catch (error) {
      console.error("Error actualizando usuario: " + error);
      Response.status(400).json({ message: "Error actualizando usuario" });
    }
  });
  
export default router;