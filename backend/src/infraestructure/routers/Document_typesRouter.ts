import { Router, Request, Response } from 'express';
import { Document_typesAdapter } from "../adapter/Document_typesAdapter";
import { Document_typesApplication } from "../../application/Document_typesApplication";
import { Document_typesController } from "../controller/Document_typesController";

const router = Router();
const document_typesAdapter = new Document_typesAdapter();
const document_typesApp = new Document_typesApplication(document_typesAdapter);
const document_typesController = new Document_typesController(document_typesApp);

router.post("/document_types", async (Request, Response)=>{
    try {
      await  document_typesController.registerDocument_types(Request, Response);
    } catch (error) {
        console.error("Error en tipo de documento:"+ error);
        Response.status(400).json({message: "Error en la creación del tipo del documento" });
        Response.status(400).json({message: "Error en la creación del tipo de documento" });
    }
});

router.get("/document_types/:id", async(Request, Response)=>{
    try {
        await  document_typesController.searchDocument_typesById(Request, Response);
      } catch (error) {
          console.error("Error en tipo documento:"+ error);
          Response.status(400).json({message: "Error en tipo documento" });
      }
})

router.get("/document_types/description/:description", async(Request, Response)=>{
    try {
        await  document_typesController.searchDocument_typesByDescription(Request, Response);
      } catch (error) {
          console.error("Error en tipo de documento:"+ error);
          Response.status(400).json({message: "Error en tipo de documento" });
      }
})

router.delete("/document_types/:id", async (Request, Response) => {
    try {
      await document_typesController.downDocument_types(Request, Response);
    } catch (error) {
      console.error("Error eliminando tipo de documento: " + error);
      Response.status(400).json({ message: "Error eliminando tipo de documento" });
    }
  });
  
  router.put("/document_types/:id", async (Request, Response) => {
    try {
      await document_typesController.updateDocument_types(Request, Response);
    } catch (error) {
      console.error("Error actualizando tipo de documento: " + error);
      Response.status(400).json({ message: "Error actualizando tipo de documento" });
    }
  });

  router.get("/document_types", async (Request, Response)=>{
    try {
      await document_typesController.allDocument_types(Request, Response);
    } catch (error) {
      console.error("Error en documento: " + error);
      Response.status(400).json({ message: "Error en documento" });
    }
  });
  
export default router;