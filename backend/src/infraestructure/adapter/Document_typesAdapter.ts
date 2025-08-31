import { Repository } from "typeorm";
import { Document_types} from '../../domain/Document_types';
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
        id: document_types.document_types_id,
        description: document_types.document_types_description,
        
     }   
    }

    private toEntity(document_types: Omit<Document_types, "id">): Document_typesEntity{
        const document_typesDocument_typesEntity = new Document_typesEntity();
        document_typesEntity.document_types_description = document_types.description;
        
        
        return document_typesEntity;
    }
}