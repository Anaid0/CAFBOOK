import { Repository } from "typeorm";
import { Document_types } from "../../domain/domain/Document_types";
import { Document_typesPort } from "../../domain/ports/Document_typesPort";
import { AppDataSource } from "../config/con_data_bases";
import { Document_typesEntity } from '../entities/Document_typesEntity';

export class Document_typesAdapter implements Document_typesPort{
    private document_typesRepository: Repository<Document_typesEntity>;

    constructor(){
        this.document_typesRepository = AppDataSource.getRepository(Document_typesEntity);
    }

    private toDomain(document_type:Document_typesEntity):Document_types{
        return{
            doc_type_id: document_type.doc_type_id,
            description: document_type.description
        }
    }

    private toEntity(document_type: Omit<Document_types, "doc_type_id">):Document_typesEntity{
        const document_typeEntity = new Document_typesEntity();
        document_typeEntity.description = document_type.description;
        return document_typeEntity;
    }

    async createDocument_types(document_type: Omit<Document_types, "doc_type_id">): Promise<number> {
        try{
        const newDocument_type = this.toEntity(document_type);
        const savedDocument_type = await this.document_typesRepository.save(newDocument_type);
        return savedDocument_type.doc_type_id;
        }catch(error){
            console.error("Error creating document type", error);
            throw new Error("Error creating document type")
        }
    }

    async updateDocument_types(doc_type_id: number, document_type: Partial<Document_types>): Promise<boolean> {
        try{
            const existingDocument_type = await this.document_typesRepository.findOne({where:{doc_type_id:doc_type_id}});
            if(!existingDocument_type){
                throw new Error("Document type not found");
            }

            Object.assign( existingDocument_type, {description: document_type ?? existingDocument_type.description});
            return true;
        }catch(error){
            console.error("Error updating document type", error);
            throw new Error("Erro updating");
        }
    }

    async deleteDocument_types(doc_type_id: number): Promise<boolean> {
        try{
            const existingDocument_type = await this.document_typesRepository.findOne({where:{doc_type_id:doc_type_id}});
            if(!existingDocument_type){
                throw new Error("Document type not found");
            }

            await this.document_typesRepository.delete(existingDocument_type);
            return true;
        }catch(error){
            console.error("Error updating document type", error);
            throw new Error("Erro updating");
        }
    }

    async getDocument_typesById(doc_type_id: number): Promise<Document_types | null> {
         try{
            const document_type = await this.document_typesRepository.findOne({where:{doc_type_id:doc_type_id}});
            return document_type ? this.toDomain(document_type): null
        }catch(error){
            console.error("Error featching document type by id", error);
            throw new Error("Erro featchin document type by id");
        }
    }

    async getDocument_typesByDescription(description: string): Promise<Document_types | null> {
        try{
            const document_type = await this.document_typesRepository.findOne({where:{description:description}});
            return document_type ? this.toDomain(document_type): null
        }catch(error){
            console.error("Error featching document type by description", error);
            throw new Error("Erro featchin document type by description");
        }
    }

    async getAllDocument_types(): Promise<Document_types[]> {
        try{
            const document_type = await this.document_typesRepository.find();
            return document_type.map(this.toDomain);
        }catch(error){
            console.error("Error featching all document types", error);
            throw new Error("Erro featchin all document types");
        }
    }
}