import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { RolesEntity } from "./RolesEntity";
import { Document_typesEntity } from "./Document_typesEntity";
import { Timestamp } from "typeorm/browser";

@Entity({name: 'users'})
export class UserEntity{
    @PrimaryGeneratedColumn()
    user_id!: number;

    @Column({type: "character varying", length:50})
    firts_name!: string;

    @Column({type: "character varying", length:50})
    last_name!: string;

    @Column({type: "character varying", length: 12})
    document_number!: string;

    @Column({type: "character varying", length: 150})
    email!: string;

    @Column({type: "character varying", length: 25})
    password!: string;

    @Column({type: "int"})
    status!: number;

    @Column({type: "timestamp" , default: () => "CURRENT_TIMESTAMP"})
    created_at!: Timestamp;

    @ManyToOne(()=> RolesEntity, {eager: false})
    @JoinColumn({name: "role_id"})
    role_id!: RolesEntity;

    @ManyToOne(()=> Document_typesEntity, {eager: false})
    @JoinColumn({name: "doc_type_id"})
    doc_type_id!: Document_typesEntity;
}