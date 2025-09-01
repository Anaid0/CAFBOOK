import { Document_types } from "../domain/Document_types";
import { Document_typesPort } from "../domain/Document_typesPort";


export class  Document_typesApplication{
    private port:  Document_typesPort;

    constructor(port:  Document_typesPort){
        this.port = port;
    }
    async createDocument_types(role: Omit<Document_types, "id">): Promise<number> {
        const existingDocument_types = await this.port.getDocument_typesByDescription(role.description); 
        if (!existingDocument_types) {
            return await this.port.createDocument_types(role);
        }
        throw new Error("El tipo de documento ya existe");
    }

    async updateDocument_types(id:number, document_types:Partial< Document_types>):Promise<boolean>{
        const existingDocument_types= await this.port.getDocument_typesById(id);
        if(!existingDocument_types){
            throw new Error("El tipo de documento no existe")
        }

        if( document_types.description){
            const descriptionTaken = await this.port.getDocument_typesByDescription(document_types.description);
            if(descriptionTaken && descriptionTaken.id !== id){
                throw new Error("Error en actualizar la descripción NO SE PUEDE!")
            }
        }
        return await this.port.updateDocument_types(id,document_types);
    }

    async deleteDocument_types(id:number): Promise<boolean>{
        const existingDocument_types = await this.port.getDocument_typesById(id);
        if(!existingDocument_types){
            throw new Error("No se encontró el tipo de documento");
        }
        return await this.port.deleteDocument_types(id);

    }

    //consultas get
    async getDocument_typesById(id:number): Promise<Document_types | null>{
        return await this.port.getDocument_typesById(id);

    }

    async getDocument_typesByDescription(description:string): Promise<Document_types | null>{
        return await this.port.getDocument_typesByDescription(description);

    }
}