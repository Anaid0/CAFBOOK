import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'users'})
export class UserEntity {
    @PrimaryGeneratedColumn()
    id_user!: number;   
    
    @Column({type: "character varying", length:255})
    name_user!:string;

    @Column({type: "character varying", length:255})
    lastname_user!:string;

    @Column({type: "int"})
    doc_type_user!: number;

    @Column({type: "int"})
    doc_number_user!: number;

    @Column({type: "character varying", length:255, unique: true})
    address_user!:string;

    @Column({type: "character varying", length:255, unique: true})
    phone_user!:string;

    @Column({type: "character varying", length:255, unique: true})
    department_user!:string;

    @Column({type: "character varying", length:255, unique: true})
    city_user!:string;

    @Column({type: "character varying", length:255, unique: true})
    email_user!:string;

    @Column({type: "character varying", length:255})
    password_user!:string;

    @Column({type: "int"})
    role_user!: number;
     
}