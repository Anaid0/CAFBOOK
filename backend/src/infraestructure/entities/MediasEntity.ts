import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'medias'})
export class MediasEntity {
    @PrimaryGeneratedColumn()
    media_id!: number;   
 
    @Column({type: "int"})
    post_id!:number;

    @Column({type: "int"})
    media_type_id!:number;

    @Column({type: "character varying", length:150})
    file_url!:string;

    @Column({type: "date"})
    uploaded_at!: Date;

}