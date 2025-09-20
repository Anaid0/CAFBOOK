import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./UsersEntity";
import { Crop_typesEntity } from "./Crop_typesEntity";

@Entity({name: 'crops'})
export class CropsEntity {
    @PrimaryGeneratedColumn()
    crop_id!: number;   
    
    @ManyToOne(()=> UserEntity, {eager:true})
    @JoinColumn({name: "user_id"})
    user_id!:UserEntity;

    @ManyToOne(()=> Crop_typesEntity, {eager: true})
    @JoinColumn({name: "crop_type_id"})
    crop_type_id!:Crop_typesEntity;

    @Column({type: "decimal", precision: 11, scale: 8 })
    latitude!:number;

    @Column({type: "decimal", precision: 11, scale: 8 })
    longitude!:number;

    @Column({type:"date"})
    created_at!:Date;
        
}