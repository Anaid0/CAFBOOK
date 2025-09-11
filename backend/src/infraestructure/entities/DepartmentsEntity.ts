import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'departaments'})
export class DepartmentsEntity {
    @PrimaryGeneratedColumn()
    departament_id!: number;
    
    @Column({type: "character varying", length:255})
    departaments_name!:string;

}