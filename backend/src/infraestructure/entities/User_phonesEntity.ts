import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity({name: 'user_phones'})
export class User_phonesEntity {
    @PrimaryGeneratedColumn()
    user_phone!: number;   
    
    @Column({type: "int"})
    phone_id!:number;

    @Column({type: "int"})
    user_id!:number;

}