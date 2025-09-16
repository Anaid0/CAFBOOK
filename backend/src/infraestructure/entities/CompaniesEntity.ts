import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { RolesEntity } from "./RolesEntity";
import { Document_typesEntity } from "./Document_typesEntity";

@Entity({name: 'companies'})
export class CompaniesEntity {
    @PrimaryGeneratedColumn()
    company_id!: number;   
    
    @Column({type: "character varying", length:255})
    bussines_name!:string;

    @Column({type: "character varying", length:150})
    profession!:string;

    @Column({type: "int"})
    years_experience!: number;

    @Column({type: "character varying", length: 35})
    document_number!: string;

    @Column({type: "character varying", length: 150})
    email!: string;

    @Column({type: "character varying", length:25})
    password!: string;

    @Column({type: "int"})
    status!: number;

    @Column({type: "date"})
    created_at!: Date;

    @ManyToOne(()=> RolesEntity, {eager: false})
    @JoinColumn({name: "role_id"})
    role_id!: RolesEntity;
    
    @ManyToOne(()=> Document_typesEntity, {eager: false})
    @JoinColumn({name: "doc_type_id"})
    doc_type_id!: Document_typesEntity;
}