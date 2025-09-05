import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'crops'})
export class CropsEntity {
    @PrimaryGeneratedColumn()
    crop_id!: number;   
    
    @Column({type: "int"})
    user_id!:number;

    @Column({type: "character varying", length:255})
    crop_type!:string;

    @Column({type: "int"})
    latitude!:number;

    @Column({type: "int"})
    longitude!:number;

    @Column({type:"time"})
    created_at!:string;
        
}