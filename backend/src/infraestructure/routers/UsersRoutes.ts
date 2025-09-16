import { Router, Response, Request } from "express";
import { UsersAdapter } from "../adapter/UsersAdapter";
import { UsersApplication } from "../../application/UsersApplication";
import { UsersController } from "../controller/UsersController";
import { authenticateToken } from "../web/authMiddleware";

const router = Router();

const userAdapter = new UsersAdapter();
const userApp = new UsersApplication(userAdapter);
const userController = new UsersController(userApp);

router.post("/login", async(request, response)=>{
    await userController.login(request, response)
});

router.post("/users", async(Request, Response)=>{
    try{
        await userController.registerUser(Request, Response);
    }catch(error){
        console.error("Error en  usuario:"+error);
        Response.status(400).json({message:"Error en la creación del usuario"});
    }
});

router.get("/users", async(Request, Response)=>{
    try{
        await userController.allUsers(Request, Response);
    }catch(error){
        console.error("Error en usuarios:"+error);
        Response.status(400).json({message:"Error en usuarios"});
    }
});

router.get("/users/:id", async(Request, Response)=>{
    try{
        await userController.searchUserById(Request, Response);
    }catch(error){
        console.error("Error en usuarios:"+error);
        Response.status(400).json({message:"Error en usuarios"});
    }
});

router.get("/users/email/:email", async (Request, Response)=>{
    try{
        await userController.searchUserByEmail(Request, Response);

    }catch (error){
        console.error("Error en correo:",error);
        Response.status(400).json({message: "Error en la obtención de correo"});
    }
});

router.put("/users/:id", async(Request, Response)=>{
    try{
        await userController.updateUser(Request, Response);
    }catch(error){
        console.error("Error en usuarios:"+error);
        Response.status(400).json({message:"Error en usuarios"});
    }
});

router.put("/users/down/:id", async(Request, Response)=>{
    try{
        await userController.downdUser(Request, Response);
    }catch(error){
        console.error("Error en usuarios:"+error);
        Response.status(400).json({message:"Error en usuarios"});
    }
});

export default router;