
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, JoinColumn} from "typeorm";
import { Number_typesEntity } from "./Number_typesEntity";

@Entity({name: 'phones'})
export class PhonesEntity {
    @PrimaryGeneratedColumn()
    phone_id!: number;   

    @Column({type: "character varying", length:12})
    number!:string;
    
    @ManyToOne(()=> Number_typesEntity, {eager: true})
    @JoinColumn({ name: "number_type_id" })
    number_type_id!:Number_typesEntity;

}