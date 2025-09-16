import { Router } from "express";
import { CompaniesApplication } from "../../application/CompaniesApplication";
import { CompaniesAdapter } from "../adapter/CompaniesAdapter";
import { CompaniesController } from "../controller/CompaniesController";

const router = Router();

const companyAdapter = new CompaniesAdapter();
const companyApp = new CompaniesApplication(companyAdapter);
const companyController = new CompaniesController(companyApp);


router.post("/login", async(request, response)=>{
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

router.get("/companies/:id", async(Request, Response)=>{
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

router.put("/companies/:id", async(Request, Response)=>{
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

export default router;