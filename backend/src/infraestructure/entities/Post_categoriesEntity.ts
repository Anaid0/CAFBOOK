import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { PostsEntity } from "./PostsEntity";

@Entity({ name: "post_categories" })
export class Post_categoriesEntity {
  @PrimaryGeneratedColumn()
  post_category_id!: number;   

  @Column({ type: "character varying", length: 255 })
  description!: string;

  @OneToMany(() => PostsEntity, (post) => post.post_category)
  posts!: PostsEntity[];
}
