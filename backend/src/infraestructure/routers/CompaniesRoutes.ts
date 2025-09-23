import { Router } from "express";
import { CompaniesApplication } from "../../application/CompaniesApplication";
import { CompaniesAdapter } from "../adapter/CompaniesAdapter";
import { CompaniesController } from "../controller/CompaniesController";
import { authenticateToken } from '../web/authMiddleware';

const router = Router();
import multer from "multer";
const upload = multer({ dest: "uploads/companies/" });

const companyAdapter = new CompaniesAdapter();
const companyApp = new CompaniesApplication(companyAdapter);
const companyController = new CompaniesController(companyApp);


router.post("/companies/login", async(request, response)=>{
    await companyController.login(request, response)
});

router.post("/companies", async(Request, Response)=>{
    try{
        await companyController.registerCompany(Request, Response);
    }catch(error){
        console.error("Error en empresa:"+error);
        Response.status(400).json({message:"Error en la creación del empresa"});
    }
});

router.get("/companies", async(Request, Response)=>{
    try{
        await companyController.allCompanies(Request, Response);
    }catch(error){
        console.error("Error en empresas:"+error);
        Response.status(400).json({message:"Error en empresas"});
    }
});

router.get("/companies/:id", authenticateToken, async(Request, Response)=>{
    try{
        await companyController.searchCompanyById(Request, Response);
    }catch(error){
        console.error("Error en empresa:"+error);
        Response.status(400).json({message:"Error en empresa"});
    }
});

router.get("/companies/email/:email", async (Request, Response)=>{
    try{
        await companyController.searchCompanyByEmail(Request, Response);

    }catch (error){
        console.error("Error en correo:",error);
        Response.status(400).json({message: "Error en la obtención de correo"});
    }
});

router.put("/companies/:id", upload.single("profile_image"), async(Request, Response)=>{
    try{
        await companyController.updateCompany(Request, Response);
    }catch(error){
        console.error("Error en empresa:"+error);
        Response.status(400).json({message:"Error en empresa"});
    }
});

router.put("/companies/down/:id", async(Request, Response)=>{
    try{
        await companyController.downdCompany(Request, Response);
    }catch(error){
        console.error("Error en empresa:"+error);
        Response.status(400).json({message:"Error en empresa"});
    }
});

router.put("/companies/restore/:id", async(Request, Response)=>{
    try{
        await companyController.restoreCompany(Request, Response);
    }catch(error){
        console.error("Error en empresa:"+error);
        Response.status(400).json({message:"Error en empresa"});
    }
});
export default router;