import { Repository } from "typeorm";
import { Document_types } from "../../domain/Document_types";
import { Document_typesPort } from "../../domain/Document_typesPort";
import {Document_typesEntity} from "../../infraestructure/entities/Document_typesEntity"
import { AppDataSource } from "../config/con_data_bases";
import { Document_typesEntity } from '../entities/Document_typesEntity';

export class Document_typesAdapter implements Document_typesPort{
    private document_typesRepository: Repository<Document_typesEntity>;

    constructor(){
        this.document_typesRepository = AppDataSource.getRepository(Document_typesEntity);
    }

    private toDomain(document_type:Document_typesEntity)

    createDocument_types(doc_type: Omit<Document_types, "doc_type_id">): Promise<number> {
        throw new Error("Method not implemented.");
    }
    updateDocument_types(doc_type_id: number, doc_types: Partial<Document_types>): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    deleteDocument_types(doc_type_id: number): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    getDocument_typesById(doc_type_id: number): Promise<Document_types | null> {
        throw new Error("Method not implemented.");
    }
    getDocument_typesByDescription(description: string): Promise<Document_types | null> {
        throw new Error("Method not implemented.");
    }
    getAllDocument_types(): Promise<Document_types[]> {
        throw new Error("Method not implemented.");
    }
}