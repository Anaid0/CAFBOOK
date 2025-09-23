import { Document_types } from "../domain/entities/Document_types";
import { Document_typesPort } from "../domain/port/Document_typesPort";

export class Document_typesApplication {
    private port: Document_typesPort;

    constructor(port: Document_typesPort) {
        this.port = port;
    }

    async createDocument_types(document_type: Omit<Document_types, "doc_type_id">): Promise<number> {
        const existingDocument_types = await this.port.getDocument_typesByDescription(document_type.description);
        if (!existingDocument_types) {
            return await this.port.createDocument_types(document_type);
        }
        throw new Error("El tipo de documento ya existe");
    }

    async updateDocument_types(doc_type_id: number, document_types: Partial<Document_types>): Promise<boolean> {
        const existingDocument_types = await this.port.getDocument_typesById(doc_type_id);
        if (!existingDocument_types) {
            throw new Error("El tipo de documento no existe");
        }

        if (document_types.description) {
            const descriptionTaken = await this.port.getDocument_typesByDescription(document_types.description);
            if (descriptionTaken && descriptionTaken.doc_type_id !== doc_type_id) {
                throw new Error("Error en actualizar la descripción NO SE PUEDE!");
            }
        }

        return await this.port.updateDocument_types(doc_type_id, document_types);
    }

    async deleteDocument_types(doc_type_id: number): Promise<boolean> {
        const existingDocument_types = await this.port.getDocument_typesById(doc_type_id);
        if (!existingDocument_types) {
            throw new Error("No se encontró el tipo de documento");
        }
        return await this.port.deleteDocument_types(doc_type_id);
    }

    async getDocument_typesById(doc_type_id: number): Promise<Document_types | null> {
        return await this.port.getDocument_typesById(doc_type_id);
    }

    async getDocument_typesByDescription(description: string): Promise<Document_types | null> {
        return await this.port.getDocument_typesByDescription(description);
    }

    async getAllDocument_type(): Promise <Document_types[]>{
        return await this.port.getAllDocument_types();
    }
}
