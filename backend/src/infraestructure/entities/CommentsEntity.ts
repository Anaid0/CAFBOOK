import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'comments'})
export class CommentsEntity {
    @PrimaryGeneratedColumn()
    comment_id!: number;   
 
    @Column({type: "int"})
    user_id!:number;

    @Column({type: "character varying", length:150})
    content!:string;

    @Column({type: "date"})
    created_at!:Date;

}