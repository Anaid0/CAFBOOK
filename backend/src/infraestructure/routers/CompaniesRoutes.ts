import { Router, Request, Response } from "express";
import { CompaniesAdapter } from "../adapter/CompaniesAdapter";
import { CompaniesApplication } from "../../application/CompaniesApplication";
import { CompaniesController } from "../controller/CompaniesController";

// Express
const router = Router();

// Inicialización de capas
const companyAdapter = new CompaniesAdapter();
const companyApp = new CompaniesApplication(companyAdapter);
const companyController = new CompaniesController(companyApp);

// Definición de rutas > EndPoints -> especificación de url
router.post("/companies", async (req: Request, res: Response) => {
    try {
        await companyController.registerCompany(req, res);
    } catch (error) {
        console.error("Error en empresa: " + error);
        res.status(400).json({ message: "Error en la creación de la empresa" });
    }
});

router.get("/companies", async (req: Request, res: Response) => {
    try {
        await companyController.allCompanies(req, res);
    } catch (error) {
        console.error("Error en empresas: " + error);
        res.status(400).json({ message: "Error obteniendo empresas" });
    }
});

router.get("/companies/:id", async (req: Request, res: Response) => {
    try {
        await companyController.searchCompanyById(req, res);
    } catch (error) {
        console.error("Error en empresa: " + error);
        res.status(400).json({ message: "Error en empresa" });
    }
});

router.get("/companies/email/:email", async (req: Request, res: Response) => {
    try {
        await companyController.searchCompanyByEmail(req, res);
    } catch (error) {
        console.error("Error en email de empresa: " + error);
        res.status(400).json({ message: "Error en email de empresa" });
    }
});

router.delete("/companies/:id", async (req: Request, res: Response) => {
    try {
        await companyController.downCompany(req, res);
    } catch (error) {
        console.error("Error eliminando empresa: " + error);
        res.status(400).json({ message: "Error eliminando empresa" });
    }
});

router.put("/companies/:id", async (req: Request, res: Response) => {
    try {
        await companyController.updateCompany(req, res);
    } catch (error) {
        console.error("Error actualizando empresa: " + error);
        res.status(400).json({ message: "Error actualizando empresa" });
    }
});

export default router;
