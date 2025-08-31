import { Document_types } from './Document_types';
export interface Document_typesPort{
     createDocument_types(role: Omit<Document_types,"id">): Promise<number>;
     updateDocument_types(id:number, role:Partial<Document_types>):Promise<boolean>;
     deleteDocument_types(id:number): Promise<boolean>;
     getDocument_typesById(id:number): Promise<Document_types | null>;
     getDocument_typesByDescription(description: string): Promise<Document_types | null>;

}