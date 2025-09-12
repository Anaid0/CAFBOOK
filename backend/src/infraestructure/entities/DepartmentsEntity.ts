import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'departments'})
export class DepartmentsEntity {
    @PrimaryGeneratedColumn()
    department_id!: number;
    
    @Column({type: "character varying", length:150})
    department_name!:string;

}