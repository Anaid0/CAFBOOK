import { Router, Request } from 'express';
import { Company_phonesAdapter } from "../adapter/Company_phonesAdapter";
import { Company_phonesApplication } from "../../application/Company_phonesApplication";
import { Company_phonesController } from "../controller/Company_phonesController";
import { Company_phones } from '../../domain/Company_phones';


const router = Router();

const company_phoneAdapter = new Company_phonesAdapter();
const company_phoneApp = new Company_phonesApplication(company_phoneAdapter);
const company_phoneController = new Company_phonesController(company_phoneApp);


router.post("/company_phones", async (Request, Response)=>{
    try {
      await  company_phoneController.registerCompanyPhone(Request, Response);
    } catch (error) {
        console.error("Error en telefono de compañia:"+ error);
        Response.status(400).json({message: "Error en la creación del telefono de compañia" });
    }
});

router.get("/company_phones", async(Request, Response)=>{
    try {
        await  company_phoneController.allCompanyPhones(Request, Response);
      } catch (error) {
          console.error("Error en telfono compañia:"+ error);
          Response.status(400).json({message: "Error en telefono compañia" });
      }
});

router.get("/company_phones/:id", async(Request, Response)=>{
    try {
        await  company_phoneController.searchCompanyPhoneById(Request, Response);
      } catch (error) {
          console.error("Error en telefono compañia:"+ error);
          Response.status(400).json({message: "Error en telefono compañia" });
      }
})

router.get("/company_phones/phones/:id",  async(Request, Response)=>{
    try {
        await  company_phoneController.searchCompanyPhonesByPhoneId(Request, Response);
      } catch (error) {
          console.error("Error en descripción:"+ error);
          Response.status(400).json({message: "Error en descripción" });
      }
})

router.delete("/company_phones/:id", async (Request, Response) => {
    try {
      await company_phoneController.downCompanyPhone(Request, Response);
    } catch (error) {
      console.error("Error eliminando rol: " + error);
      Response.status(400).json({ message: "Error eliminando rol" });
    }
  });
  
  router.put("/company_phones/:id", async (Request, Response) => {
    try {
      await company_phoneController.updateCompanyPhone(Request, Response);
    } catch (error) {
      console.error("Error actualizando rol: " + error);
      Response.status(400).json({ message: "Error actualizando rol" });
    }
  });
  
export default router;