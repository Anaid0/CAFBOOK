import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'users'})
export class UserEntity {
    @PrimaryGeneratedColumn()
    id_users!: number;   
    
    @Column({type: "character varying", length:255})
    name_users!:string;

    @Column({type: "character varying", length:255})
    lastname_users!:string;

    @Column({type: "int", int: 10})
    doc_type_users!: number;

    @Column({type: "int", int: 100})
    doc_number_users!: number;

    @Column({type: "character varying", length:255, unique: true})
    address_users!:string;

    @Column({type: "character varying", length:255, unique: true})
    phone_users!:string;

    @Column({type: "character varying", length:255, unique: true})
    department_users!:string;

    @Column({type: "character varying", length:255, unique: true})
    city_users!:string;

    @Column({type: "character varying", length:255, unique: true})
    email_users!:string;

    @Column({type: "character varying", length:255})
    password_users!:string;

    @Column({type: "int", int:10})
    role_users!: number;
     
}