import { Column, Entity, PrimaryGeneratedColumn, Timestamp } from "typeorm";
// import { Timestamp } from "typeorm/browser";

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

    @Column({type: "timestamp"})
    uploaded_at!:Date;

}