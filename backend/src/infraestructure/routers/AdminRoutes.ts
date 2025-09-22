import { AdminApplication } from "../../application/AdminApplication";
import { AdminAdapter } from "../adapter/AdminAdapter";
import { AdminController } from "../controller/AdminController";
import { Router, Response, Request } from "express";
import { authenticateToken } from '../web/authMiddleware';

const router = Router();

const adminAdapter = new AdminAdapter();
const adminApp = new AdminApplication(adminAdapter);
const adminController = new AdminController(adminApp);


router.post("/admin/login", async(request, response)=>{
    await adminController.login(request, response)
});

router.post("/admin", async(Request, Response)=>{
    try{
        await adminController.registerAdmin(Request, Response);
    }catch(error){
        console.error("Error en  usuario:"+error);
        Response.status(400).json({message:"Error en la creación del usuario"});
    }
});

router.get("/admins", authenticateToken, async(Request, Response)=>{
    try{
        await adminController.allAdmins(Request, Response);
    }catch(error){
        console.error("Error en usuarios:"+error);
        Response.status(400).json({message:"Error en usuarios"});
    }
});

router.get("/admin/:id", async(Request, Response)=>{
    try{
        await adminController.searchAdminById(Request, Response);
    }catch(error){
        console.error("Error en usuarios:"+error);
        Response.status(400).json({message:"Error en usuarios"});
    }
});

router.get("/admin/email/:email", async (Request, Response)=>{
    try{
        await adminController.searchAdminByEmail(Request, Response);

    }catch (error){
        console.error("Error en correo:",error);
        Response.status(400).json({message: "Error en la obtención de correo"});
    }
});

router.put("/admin/:id", async(Request, Response)=>{
    try{
        await adminController.updateAdmin(Request, Response);
    }catch(error){
        console.error("Error en usuarios:"+error);
        Response.status(400).json({message:"Error en usuarios"});
    }
});

router.put("/admin/down/:id", async(Request, Response)=>{
    try{
        await adminController.downdUser(Request, Response);
    }catch(error){
        console.error("Error en usuarios:"+error);
        Response.status(400).json({message:"Error en usuarios"});
    }
});

export default router;