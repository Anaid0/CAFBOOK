import { Router, Request, Response } from 'express';
import { CitiesAdapter } from "../adapter/CitiesAdapter";
import { CitiesApplication } from "../../application/CitiesApplication";
import { CitiesController } from "../controller/CitiesController";

const router = Router();


const citiesAdapter = new CitiesAdapter();
const citiesApp = new CitiesApplication(citiesAdapter);
const citiesController = new CitiesController(citiesApp);


router.post("/address", async (req: Request, res: Response) => {
    try {
        await citiesController.registerCity(req, res);
    } catch (error) {
        console.error("Error en ciudad: " + error);
        res.status(400).json({ message: "Error en la creación de la ciudad" });
    }
});


router.get("/addresses", async (req: Request, res: Response) => {
    try {
        await citiesController.allCities(req, res);
    } catch (error) {
        console.error("Error en ciudades: " + error);
        res.status(400).json({ message: "Error en ciudades" });
    }
});


router.get("/address/:id", async (req: Request, res: Response) => {
    try {
        await citiesController.searchCityById(req, res);
    } catch (error) {
        console.error("Error en ciudad: " + error);
        res.status(400).json({ message: "Error en ciudad" });
    }
});


router.get("/address/name/:name", async (req: Request, res: Response) => {
    try {
        await citiesController.searchCityByName(req, res);
    } catch (error) {
        console.error("Error en nombre: " + error);
        res.status(400).json({ message: "Error en nombre" });
    }
});


router.delete("/address/:id", async (req: Request, res: Response) => {
    try {
        await citiesController.downCity(req, res);
    } catch (error) {
        console.error("Error eliminando ciudad: " + error);
        res.status(400).json({ message: "Error eliminando ciudad" });
    }
});


router.put("/address/:id", async (req: Request, res: Response) => {
    try {
        await citiesController.updateCity(req, res);
    } catch (error) {
        console.error("Error actualizando ciudad: " + error);
        res.status(400).json({ message: "Error actualizando ciudad" });
    }
});

export default router;
