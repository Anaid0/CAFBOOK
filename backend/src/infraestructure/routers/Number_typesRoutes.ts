import { Router, Request } from 'express';
import { Number_typesAdapter } from "../adapter/Number_typesAdapter";
import { Number_typesApplication } from "../../application/Number_typesApplication";
import { Number_typesController } from "../controller/Number_typesController";


const router = Router();

const number_typeAdapter = new Number_typesAdapter();
const number__typeApp = new Number_typesApplication(number_typeAdapter);
const number_typeController = new Number_typesController(number__typeApp);


router.post("/number_types", async (Request, Response)=>{
    try {
      await  number_typeController.registerNumber_type(Request, Response);
    } catch (error) {
        console.error("Error en tipo de número:"+ error);
        Response.status(400).json({message: "Error en la creación del tipo de número" });
    }
});

router.get("/number_types", async(Request, Response)=>{
    try {
        await  number_typeController.allNumber_types(Request, Response);
      } catch (error) {
          console.error("Error en tipo de número:"+ error);
          Response.status(400).json({message: "Error en tipo de número" });
      }
});

router.get("/number_type/:id", async(Request, Response)=>{
    try {
        await  number_typeController.searchNumber_typeById(Request, Response);
      } catch (error) {
          console.error("Error en tipo de numero:"+ error);
          Response.status(400).json({message: "Error en tipo de numero" });
      }
})

router.get("/number_type/description/:description",  async(Request, Response)=>{
    try {
        await  number_typeController.searchNumber_typeByDescription(Request, Response);
      } catch (error) {
          console.error("Error en tipo de número:"+ error);
          Response.status(400).json({message: "Error en tipo de número" });
      }
})

router.delete("/number_types/:id", async (Request, Response) => {
    try {
      await number_typeController.downNumber_type(Request, Response);
    } catch (error) {
      console.error("Error eliminando tipo de numero: " + error);
      Response.status(400).json({ message: "Error eliminando tipo de número" });
    }
  });
  
  router.put("/number_types/:id", async (Request, Response) => {
    try {
      await number_typeController.updateNumber_type(Request, Response);
    } catch (error) {
      console.error("Error actualizando tipo de número: " + error);
      Response.status(400).json({ message: "Error actualizando tipo de número" });
    }
  });
  
export default router;