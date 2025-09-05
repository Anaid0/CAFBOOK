import { Repository } from "typeorm";
import { Document_types } from '../../domain/Document_types';
import { Document_typesPort } from "../../domain/Document_typesPort";
import { Document_typesEntity } from '../entities/Document_typesEntity';
import { AppDataSource } from "../config/con_data_bases";


export class Document_typesAdapter implements Document_typesPort{
    private document_typesRepository: Repository<Document_typesEntity>;

    constructor(){
        this.document_typesRepository = AppDataSource.getRepository(Document_typesEntity);
    }

    private toDomain(document_types:Document_typesEntity):Document_types{
     return{
        doc_type_id: document_types.doc_type_id,
        description: document_types.description,
        
     }   
    }

    private toEntity(document_types: Omit<Document_types, "id">): Document_typesEntity{
        const document_typesEntity = new Document_typesEntity();
        document_typesEntity.description = document_types.description;
        
        
        return document_typesEntity;
    }

    async createDocument_types(document_types: Omit<Document_types, "id">): Promise<number> {
        try{
            const newDocument_types = this.toEntity(document_types);
            const savedDocument_types = await this.document_typesRepository.save(newDocument_types);
            return savedDocument_types.doc_type_id;
        }catch (error){
            console.error("Error creating document_types ", error);
            throw new Error("Error creating document_types")
        }
    }
    async updateDocument_types(document_types_id: number, document_types: Partial<Document_types>): Promise<boolean> {
        try {
            const existingDocument_types = await this.document_typesRepository.findOne({where:{doc_type_id:document_types_id}});
            if(!existingDocument_types){
                throw new Error("Document_typesnot found");
            }
            //Actualizamos los atributos o priopiedades enviadas
            Object.assign( existingDocument_types,{
             description_document_types: document_types.description ?? existingDocument_types.description
             
            });
            await this.document_typesRepository.save(existingDocument_types);
            return true;
        } catch (error) {
            console.error("Error udating document_types", error);
            throw new Error("Error updating document_types");
            
        }
    }
    async deleteDocument_types(doc_type_id: number): Promise<boolean> {
        try {
            const existingDocument_types = await this.document_typesRepository.findOne({where:{doc_type_id:doc_type_id}});
            if(!existingDocument_types){
                throw new Error("Document_types not found");
            }
            Object.assign(existingDocument_types, {
                status_user:0
            });
            await this.document_typesRepository.save(existingDocument_types);
            return true;
        } catch (error) {
            console.error("Error deleting document types", error);
            throw new Error("Error deleting focument types")
        }
    }
    async getAllDocument_types(): Promise<Document_types[]> {
        try {
            const document_types = await this.document_typesRepository.find();
            return document_types.map(this.toDomain);
        } catch (error) {
            console.error("Error featching all document types ", error);
            throw new Error("Error featching all document types")
        }
    }
    async getDocument_typesById(doc_type_id: number): Promise<Document_types | null> {
        try {
            const document_types = await this.document_typesRepository.findOne({where:{doc_type_id:doc_type_id}});
            return document_types ? this.toDomain(document_types): null
        } catch (error) {
            console.error("Error featching document_types by id ", error);
            throw new Error("Error featching document_types by id");
        }
    }
    async getDocument_typesByDescription(description: string): Promise<Document_types | null> {
        try {
            const document_types = await this.document_typesRepository.findOne({where:{description:description}});
            return document_types ? this.toDomain(document_types): null
        } catch (error) {
            console.error("Error featching user by description ", error);
            throw new Error("Error featching user by description");
        }
    }

    async getAllDocument_type(): Promise<Document_types[]> {
        try {
            const documents = await this.getAllDocument_type();
            return documents.map(this.toDomain);
        } catch (error) {
            console.error("Error fetching all documents", error);
            throw new Error("Error fetching all documents");
        }
    }
}