import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PostsEntity } from "./PostsEntity";
import { Media_typesEntity } from "./Media_typesEntity";

@Entity({name: 'medias'})
export class MediasEntity {
    @PrimaryGeneratedColumn()
    media_id!: number;   
 
    @ManyToOne(()=> PostsEntity, {eager: true})
    @JoinColumn({name: "post_id"})
    post_id!:PostsEntity;

    @ManyToOne(()=> Media_typesEntity, {eager: true})
    @JoinColumn({name: "media_type_id"})
    media_type_id!:Media_typesEntity;

    @Column({type: "character varying", length:150})
    file_url!:string;

    @Column({type: "date"})
    uploaded_at!: Date;

}