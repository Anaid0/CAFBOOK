import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'roles'})
export class RolesEntity {
    @PrimaryGeneratedColumn()
    role_id!: number;   
    
    @Column({type: "character varying", length:255})
    description!:string;

}