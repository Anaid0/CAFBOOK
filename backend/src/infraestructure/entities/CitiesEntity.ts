import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { DepartmentsEntity } from "./DepartmentsEntity";

@Entity({name: 'cities'})
export class CitiesEntity {
    @PrimaryGeneratedColumn()
    city_id!: number;   
    
    @Column({type: "character varying", length:255})
    city_name!:string;

    @ManyToOne(()=> DepartmentsEntity, {eager: true})
    @JoinColumn({ name: "department_id"})
    department_id!:DepartmentsEntity;

}