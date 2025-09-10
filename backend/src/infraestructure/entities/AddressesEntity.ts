import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";



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

    @Column({type: "int"})
    city_id!:number;
        
}