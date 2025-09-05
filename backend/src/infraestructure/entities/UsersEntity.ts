import { Column, Entity, PrimaryGeneratedColumn, Timestamp } from "typeorm";

@Entity({name: 'users'})
export class UserEntity {
    @PrimaryGeneratedColumn()
    user_id!: number;   
    
    @Column({type: "character varying", length:255})
    firts_name!:string;

    @Column({type: "character varying", length:255})
    last_name!:string;

    @Column({type: "int"})
    doc_type_id!: number;

    @Column({type: "int"})
    document_number!: number;

    @Column({type: "character varying", length:255, unique: true})
    address!:string;

    @Column({type: "character varying", length:255, unique: true})
    phone!:string;

    @Column({type: "character varying", length:255, unique: true})
    state!:string;

    @Column({type: "character varying", length:255, unique: true})
    city!:string;

    @Column({type: "character varying", length:255, unique: true})
    email!:string;

    @Column({type: "character varying", length:255})
    password!:string;

    @Column({type: "int"})
    role_id!: number;

    @Column({type: "time"})
    create_at!: Timestamp;

    @Column({type: "int"})
    status!: number;
     
}