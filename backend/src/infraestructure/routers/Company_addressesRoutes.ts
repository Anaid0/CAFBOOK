import { Router, Request } from 'express';
import { Company_addressAdapter } from "../adapter/Company_addressesAdapter";
import { Company_addressApplication } from "../../application/Company_addressesApplicattion";
import { Company_addressController } from "../controller/Company_addressesController";

const router = Router();

const company_addressAdapter = new Company_addressAdapter();
const company_addressApp = new Company_addressApplication(company_addressAdapter);
const company_addressController = new Company_addressController(company_addressApp);


router.post("/company_addresses", async (Request, Response) => {
  try {
    await company_addressController.registerCompanyAddress(Request, Response);
  } catch (error) {
    console.error("Error en dirección de compañía: " + error);
    Response.status(400).json({ message: "Error en la creación de la dirección de compañía" });
  }
});


router.get("/company_addresses", async (Request, Response) => {
  try {
    await company_addressController.allCompanyAddresses(Request, Response);
  } catch (error) {
    console.error("Error en dirección de compañía: " + error);
    Response.status(400).json({ message: "Error listando direcciones de compañía" });
  }
});


router.get("/company_addresses/:id", async (Request, Response) => {
  try {
    await company_addressController.searchCompanyAddressById(Request, Response);
  } catch (error) {
    console.error("Error en dirección de compañía: " + error);
    Response.status(400).json({ message: "Error en búsqueda por ID de dirección de compañía" });
  }
});

router.get("/company_addresses/company/name/:name", async (Request, Response) => {
  try {
    await company_addressController.getCompanyAddressByBussinesName(Request, Response);
  } catch (error) {
    console.error("Error en búsqueda por company_id: " + error);
    Response.status(400).json({ message: "Error en búsqueda de direcciones por compañía" });
  }
});

router.get("/company_addresses/department/name/:name", async (Request, Response) => {
  try {
    await company_addressController.getCompanyAddressByDepartmentName(Request, Response);
  } catch (error) {
    console.error("Error en búsqueda por nombre de departamento: " + error);
    Response.status(400).json({ message: "Error en búsqueda de direcciones por compañía" });
  }
});

router.get("/company_addresses/company/:id", async (Request, Response) => {
  try {
    await company_addressController.searchCompanyAddressByAddressId(Request, Response);
  } catch (error) {
    console.error("Error en búsqueda por company_id: " + error);
    Response.status(400).json({ message: "Error en búsqueda de direcciones por compañía" });
  }
});

router.delete("/company_addresses/:id", async (Request, Response) => {
  try {
    await company_addressController.downCompanyAddress(Request, Response);
  } catch (error) {
    console.error("Error eliminando dirección: " + error);
    Response.status(400).json({ message: "Error eliminando dirección de compañía" });
  }
});


router.put("/company_addresses/:id", async (Request, Response) => {
  try {
    await company_addressController.updateCompanyAddress(Request, Response);
  } catch (error) {
    console.error("Error actualizando dirección: " + error);
    Response.status(400).json({ message: "Error actualizando dirección de compañía" });
  }
});

export default router;
