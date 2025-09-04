import { Document_typesApplication } from "../../application/Document_typesApplicattion";
import {Document_types} from "../../domain/Document_types";
import {Request, Response} from "express";

export class Document_typesController{
    private app: Document_typesApplication;
    constructor(app: Document_typesApplication){
        this.app = app;
    }

    async registerDocument_types(request: Request, response: Response): Promise <Response>{
        const { description } = request.body;
             try {
                // Validaciones
                const descriptionRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9.,:;()\-_\s]{10,500}$/;
            if (!descriptionRegex.test(description?.trim())) {
            return response.status(400).json({ message: "Descripción inválida, debe tener entre 10 y 500 caracteres y no contener símbolos no permitidos." });
}
    
                const doc_type: Omit<Document_types, "doc_type_id"> = {description: description.trim()};
                const document_typesId = await this.app.createDocument_types(doc_type);
                return response
                    .status(201)
                    .json({ message: "Tipo de documento registrado correctamente", document_typesId });
            } catch (error) {
                if (error instanceof Error) {
                    return response.status(500).json({ message: "error en servidor" });
                }
            }
            return response.status(400).json({ message: "error en la petición" });
        }
    async searchDocument_typesById(request:Request, response: Response): Promise<Response>{
    try {
        const document_typesId = parseInt(request.params.id);
        if(isNaN(document_typesId))
            return response.status(400).json({message:"error en parámetro"});
        const document_types = await this.app.getDocument_typesById(document_typesId);
        if(!document_types){
            return response.status(404).json({message:"Tipo de documento no existe"});
        }
        return response.status(200).json(document_types);
    } catch (error) {
        if (error instanceof Error){
            return response.status(500).json({message:"error en servidor"});
        }
    }
    return response.status(400).json({message:"error en la petición"});
 }

 async searchDocument_typesByDescription(request: Request, response: Response): Promise<Response> {
    try {
        const { description } = request.params;

        if (!description || description.trim().length === 0) {
            return response.status(400).json({ message: "Parámetro descripción inválido" });
        }

        const document_types = await this.app.getDocument_typesByDescription(description.trim());

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
        const document_typesId = parseInt(request.params.id);
        if(isNaN(document_typesId))
            return response.status(400).json({message:"error en parámetro"})
        const document_types = await this.app.deleteDocument_types(document_typesId);
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
        const document_typesId = parseInt(request.params.id);
        if (isNaN(document_typesId))
            return response.status(400).json({ message: "error en parámetro" });

        let { description } = request.body;

        // Validaciones antes de actualizar
        const descriptionRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9.,:;()\-_\s]{10,500}$/;

        if (description && !descriptionRegex.test(description.trim()))
            return response.status(400).json({ message: "Descripción inválida" });

        const updated = await this.app.updateDocument_types(document_typesId, {
            description
        });

        if (!updated)
            return response.status(404).json({ message: "Tipo de documento no encontrado o sin cambios" });

        return response.status(200).json({ message: "Tipo de documento actualizado con éxito" });
    } catch (error) {
        if (error instanceof Error)
            return response.status(500).json({ message: "error en servidor" });
    }
    return response.status(400).json({ message: "error en la petición" });
}
} 