import { Document_typesApplication } from "../../application/Document_typesApplication";
import {Document_types} from "../../domain/models/Document_types";
import {Request, Response} from "express";
import { Validators } from "../config/validations";


export class Document_typesController{
    private app: Document_typesApplication;
    constructor(app: Document_typesApplication){
        this.app = app;
    }

    async registerDocument_types(request: Request, response: Response): Promise <Response>{
        const { description } = request.body;
        try{
            if(!Validators.description(description))
                return response.status(400).json({message: "Descripción inválida"});
                    
                const document_type: Omit<Document_types, "doc_type_id"> = {description};
                const doc_type_id = await this.app.createDocument_types(document_type);
            
                return response.status(201).json({message:"Tipo de documento creado exitosamente:", doc_type_id});
        }catch(error){
            if(error instanceof Error){
                return response.status(500).json({message:"Error en el servidor"});
            }
        }
        return response.status(400).json({message:"Error en la petición"});
    }
        
    async searchDocument_typesById(request:Request, response: Response): Promise<Response>{
    try {
        const doc_type_id = parseInt(request.params.id);
        if(isNaN(doc_type_id))
            return response.status(400).json({message:"error en parámetro"});
        const document_type = await this.app.getDocument_typesById(doc_type_id);
        if(!document_type){
            return response.status(404).json({message:"Tipo de documento no encontrado"});
        }
        return response.status(200).json(document_type);
    } catch (error) {
        if (error instanceof Error){
            return response.status(500).json({message:"error en servidor"});
        }
    }
    return response.status(400).json({message:"error en la petición"});
 }

 async searchDocument_typesByDescription(request: Request, response: Response): Promise<Response> {
    try {
        const {description}= (request.params);
        if(!Validators.description(description))
        return response.status(400).json({ error: "Descripción no válida" });

        const document_types = await this.app.getDocument_typesByDescription(description);

        if (!document_types) {
            return response.status(404).json({ message: "Tipo de documento no existe con esa descripción" });
        }

        return response.status(200).json(document_types);

    } catch (error) {
        if (error instanceof Error) {
            return response.status(500).json({ message: "Error en servidor" });
        }
    }
    return response.status(400).json({ message: "Error en la petición" });
}
 
 async downDocument_types(request:Request, response: Response): Promise<Response>{
    try {
        const doc_type_id = parseInt(request.params.id);
        if(isNaN(doc_type_id)) return response.status(400).json({message:"Error en parámetro"});
        const document_types = await this.app.deleteDocument_types(doc_type_id);
        if(!document_types){
            return response.status(404).json({message:"Tipo documento no existe"})
        }
        return response.status(200).json(document_types);
    } catch (error) {
        if (error instanceof Error){
            return response.status(500).json({message:"error en servidor"});
        }
    }
    return response.status(400).json({message:"error en la petición"});
 }

 async updateDocument_types(request: Request, response: Response): Promise <Response>{
    try {
        const doc_type_id = parseInt(request.params.id);
        if (isNaN(doc_type_id)) return response.status(400).json({ message: "error en parámetro" });

        let { description } = request.body;
        
        if (description && !Validators.description(description)) 
            return response.status(400).json({message:"La descripción solo debe contener letras"
        });

        const updated = await this.app.updateDocument_types(doc_type_id, {description});
        if (!updated) return response.status(404).json({ message: "Tipo de documento no encontrado o sin cambios" });

        return response.status(200).json({ message: "Tipo de documento actualizado con éxito" });
    } catch (error) {
        if (error instanceof Error)
            return response.status(500).json({ message: "error en servidor" });
    }
    return response.status(400).json({ message: "error en la petición" });
}

 async allDocument_types(req:Request, res: Response): Promise<Response>{
    try {   
        const document_types = await this.app.getAllDocument_type();
        return res.status(200).json(document_types);
    } catch (error) {
        if (error instanceof Error){
            return res.status(500).json({message:"error en servidor"});
        }
    }
    return res.status(400).json({message:"error en la petición"});
 }
} 