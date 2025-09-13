import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CitiesEntity } from "./CitiesEntity";

@Entity({name: 'addresses'})
export class AddressesEntity {
    @PrimaryGeneratedColumn()
    address_id!: number;   
    
    @Column({type: "character varying", length:255})
    street!:string;

    @Column({type: "character varying", length:255})
    vereda!:string;

    @Column({type: "character varying", length:255})
    postal_code!:string;

    @ManyToOne(()=> CitiesEntity, {eager: false})
    @JoinColumn({ name: "city_id"})
    city_id!:CitiesEntity;
        
}