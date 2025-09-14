import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./UsersEntity";

@Entity({name: 'roles'})
export class RolesEntity {
    @PrimaryGeneratedColumn()
    role_id!: number;   
    
    @Column({type: "character varying", length:255})
    description!:string;

    @OneToMany(()=> UserEntity, (user)=> user.user_id)
    user!: UserEntity[];

}