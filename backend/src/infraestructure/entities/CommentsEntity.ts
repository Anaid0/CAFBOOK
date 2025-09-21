import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./UsersEntity";
import { PostsEntity } from "./PostsEntity";

@Entity({name: 'comments'})
export class CommentsEntity {
    @PrimaryGeneratedColumn()
    comment_id!: number;   
 
    @ManyToOne(()=> UserEntity, {eager: true})
    @JoinColumn({name: "user_id"})
    user_id!:UserEntity;

    @ManyToOne(()=> PostsEntity, {eager: true})
    @JoinColumn({name: "post_id"})
    post_id!: PostsEntity;

    @Column({type: "character varying", length:150})
    content!:string;

    @Column({type: "date"})
    created_at!:Date;

}