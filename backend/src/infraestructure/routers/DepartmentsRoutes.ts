import { Router, Request } from 'express';
import { DepartmentsAdapter } from "../adapter/DepartmentsAdapter";
import { DepartmentsApplication } from "../../application/DepartmentsApplication";
import { DepartmentsController } from "../controller/DepartmentsController";


const router = Router();

const departmentAdapter = new DepartmentsAdapter();
const departmentApp = new DepartmentsApplication(departmentAdapter);
const departmentController = new DepartmentsController(departmentApp);


router.post("/departments", async (Request, Response)=>{
    try {
      await  departmentController.registerDepartment(Request, Response);
    } catch (error) {
        console.error("Error en departamento:"+ error);
        Response.status(400).json({message: "Error en la creación del departamento" });
    }
});

router.get("/departments", async(Request, Response)=>{
    try {
        await  departmentController.allDepartments(Request, Response);
      } catch (error) {
          console.error("Error en departamentos:"+ error);
          Response.status(400).json({message: "Error en departamentos" });
      }
});

router.get("/department/:id", async(Request, Response)=>{
    try {
        await  departmentController.searchDepartmentById(Request, Response);
      } catch (error) {
          console.error("Error en departamento:"+ error);
          Response.status(400).json({message: "Error en departamento" });
      }
})

router.get("/department/name/:name",  async(Request, Response)=>{
    try {
        await  departmentController.searchDepartmentByName(Request, Response);
      } catch (error) {
          console.error("Error en nombre:"+ error);
          Response.status(400).json({message: "Error en nombre" });
      }
})

router.delete("/departments/:id", async (Request, Response) => {
    try {
      await departmentController.downDepartment(Request, Response);
    } catch (error) {
      console.error("Error eliminando departamento: " + error);
      Response.status(400).json({ message: "Error eliminando departamento" });
    }
  });
  
  router.put("/departments/:id", async (Request, Response) => {
    try {
      await departmentController.updateDepartment(Request, Response);
    } catch (error) {
      console.error("Error actualizando departamento: " + error);
      Response.status(400).json({ message: "Error actualizando departamento" });
    }
  });
  
export default router;