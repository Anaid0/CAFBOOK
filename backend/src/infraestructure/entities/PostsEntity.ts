import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'posts'})
export class PostsEntity {
    @PrimaryGeneratedColumn()
    post_id!: number;   
 
    @Column({type: "character varying", length:150})
    tittle!:string;

    @Column({type: "character varying", length:150})
    description!:string;

    @Column({type: "int"})
    post_category_id!:number;

    @Column({type: "int"})
    user_id!:number;

    @Column({type: "date"})
    creates_at!:Date;

}