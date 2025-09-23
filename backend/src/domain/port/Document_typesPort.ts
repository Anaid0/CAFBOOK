import { Document_types } from '../entities/Document_types';
export interface Document_typesPort{
     createDocument_types(doc_type: Omit<Document_types,"doc_type_id">): Promise<number>;
     updateDocument_types(doc_type_id:number, doc_types:Partial<Document_types>):Promise<boolean>;
     deleteDocument_types(doc_type_id:number): Promise<boolean>;
     getDocument_typesById(doc_type_id:number): Promise<Document_types | null>;
     getDocument_typesByDescription(description: string): Promise<Document_types | null>;
     getAllDocument_types(): Promise <Document_types[]>;

}
//