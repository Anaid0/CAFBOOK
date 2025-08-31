import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'roles'})
export class RoleEntity {
    @PrimaryGeneratedColumn()
    role_id!: number;   
    
    @Column({type: "character varying", length:255})
    role_description!:string;

     
}