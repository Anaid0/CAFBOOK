import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity({name: 'post_categories'})
export class Post_categoriesEntity {
    @PrimaryGeneratedColumn()
    post_category_id!: number;   
    
    @Column({type: "character varying", length:255})
    description!:string;

}