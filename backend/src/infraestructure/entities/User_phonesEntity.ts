import { Column, Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from "typeorm";
import { PhonesEntity } from "./PhonesEntity";
import { UserEntity } from "./UsersEntity";


@Entity({name: 'user_phones'})
export class User_phonesEntity {
    @PrimaryGeneratedColumn()
    user_phone!: number;   
    
    @ManyToOne(()=> PhonesEntity, {eager: true})
    @JoinColumn({name: "phone_id"})
    phone_id!:PhonesEntity;

    @ManyToOne(()=> UserEntity, {eager: true})
    @JoinColumn({name: "user_id"})
    user_id!:UserEntity;

}