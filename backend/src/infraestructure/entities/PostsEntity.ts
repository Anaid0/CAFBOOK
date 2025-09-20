import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Post_categoriesEntity } from "./Post_categoriesEntity";
import { UserEntity } from "./UsersEntity";

@Entity({name: 'posts'})
export class PostsEntity {
    @PrimaryGeneratedColumn()
    post_id!: number;   
 
    @Column({type: "character varying", length:150})
    tittle!:string;

    @Column({type: "character varying", length:150})
    description!:string;

    @ManyToOne(()=> Post_categoriesEntity, {eager: true})
    @JoinColumn({name:"post_category_id"})
    post_category_id!:Post_categoriesEntity;

    @ManyToOne(()=> UserEntity, {eager: true})
    @JoinColumn({name: "user_id"})
    user_id!:UserEntity;

    @Column({type: "date"})
    created_at!:Date;

}