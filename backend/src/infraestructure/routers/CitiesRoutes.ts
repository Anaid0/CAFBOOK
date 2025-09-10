import { Router, Request } from 'express';
import { CitiesAdapter } from "../adapter/CitiesAdapter";
import { CitiesApplication } from "../../application/CitiesApplication";
import { CitiesController } from "../controller/CitiesController";


const router = Router();

const citiesAdapter = new CitiesAdapter();
const citiesApp = new CitiesApplication(citiesAdapter);
const citiesController = new CitiesController(citiesApp);


router.post("/cities", async (Request, Response)=>{
    try {
      await  citiesController.registerCity(Request, Response);
    } catch (error) {
        console.error("Error en ciudad:"+ error);
        Response.status(400).json({message: "Error en la creación del ciudad" });
    }
});

router.get("/cities", async(Request, Response)=>{
    try {
        await  citiesController.allCities(Request, Response);
      } catch (error) {
          console.error("Error en ciudades:"+ error);
          Response.status(400).json({message: "Error en ciudades" });
      }
});

router.get("/cities/:id", async(Request, Response)=>{
    try {
        await  citiesController.searchCityById(Request, Response);
      } catch (error) {
          console.error("Error en ciudad:"+ error);
          Response.status(400).json({message: "Error en ciudad" });
      }
})

router.get("/cities/name/:name",  async(Request, Response)=>{
    try {
        await  citiesController.searchCityByName(Request, Response);
      } catch (error) {
          console.error("Error en nombre:"+ error);
          Response.status(400).json({message: "Error en nombre" });
      }
})

router.delete("/cities/:id", async (Request, Response) => {
    try {
      await citiesController.downCity(Request, Response);
    } catch (error) {
      console.error("Error eliminando ciudad: " + error);
      Response.status(400).json({ message: "Error eliminando ciudad" });
    }
  });
  
  router.put("/cities/:id", async (Request, Response) => {
    try {
      await citiesController.updateCity(Request, Response);
    } catch (error) {
      console.error("Error actualizando ciudad: " + error);
      Response.status(400).json({ message: "Error actualizando ciudad" });
    }
  });
  
export default router;