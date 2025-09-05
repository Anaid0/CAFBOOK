import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'companies'})
export class CompaniesEntity {
    @PrimaryGeneratedColumn()
    company_id_company!: number;   
    
    @Column({type: "character varying", length:255})
    business_name_company!:string;

    @Column({type: "int"})
    doc_type_id_company!: number;

    @Column({type: "int"})
    document_number_company!: number;

    @Column({type: "character varying", length:255, unique: true})
    phone_company!:string;
    
    @Column({type: "character varying", length:255, unique: true})
    profession_company!:string;

    @Column({type: "int", length:255, unique: true})
    years_experience_company!:number;

    @Column({type: "character varying", length:255, unique: true})
    email_company!:string;

    @Column({type: "character varying", length:255})
    password_company!:string;

    @Column({type: "int"})
    role_id_company!: number;
     
}