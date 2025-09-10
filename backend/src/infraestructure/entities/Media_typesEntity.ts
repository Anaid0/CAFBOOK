import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity({name: 'media_types'})
export class Media_typesEntity {
    @PrimaryGeneratedColumn()
    media_type_id!: number;   
    
    @Column({type: "character varying", length:255})
    description!:string;

}