import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
// import { Timestamp } from "typeorm/browser";

@Entity({name: 'crops'})
export class CropsEntity {
    @PrimaryGeneratedColumn()
    crop_id!: number;   
    
    @Column({type: "int"})
    user_id!:number;

    @Column({type: "int"})
    crop_type_id!:number;

    @Column({type: "int"})
    latitude!:number;

    @Column({type: "int"})
    longitude!:number;

    @Column({type:"timestamp"})
    created_at!: Date;
        
}