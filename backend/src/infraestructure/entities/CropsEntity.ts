import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'crops'})
export class CropsEntity {
    @PrimaryGeneratedColumn()
    crop_id_crop!: number;   
    
    @Column({type: "int"})
    user_id_crop!:number;

    @Column({type: "character varying", length:255})
    crop_type_crop!:string;

    @Column({type: "int"})
    latitude_crop!:number;

    @Column({type: "int"})
    longitude_crop!:number;
        
}