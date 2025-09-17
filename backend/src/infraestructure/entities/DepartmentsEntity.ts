import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CitiesEntity } from "./CitiesEntity";

@Entity({name: 'departments'})
export class DepartmentsEntity {
    @PrimaryGeneratedColumn()
    department_id!: number;
    
    @Column({type: "character varying", length:150})
    department_name!:string;

    @OneToMany(()=> CitiesEntity, (cities)=> cities.department_id)
    cities!: CitiesEntity; 

}