import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'document_types'})
export class Document_typesEntity {
    @PrimaryGeneratedColumn()
    document_types_id!: number;   
    
    @Column({type: "character varying", length:255})
    document_types_description!:string;

     
}