import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Post_categoriesEntity } from "./Post_categoriesEntity";
import { UsersEntity } from "./UsersEntity";

@Entity({ name: "posts" })
export class PostsEntity {
  @PrimaryGeneratedColumn()
  post_id!: number;

  @Column({ type: "character varying", length: 150 })
  tittle!: string;

  @Column({ type: "character varying", length: 150 })
  description!: string;

  @ManyToOne(() => Post_categoriesEntity)
  @JoinColumn({ name: "post_category_id" })
  post_category_id!: Post_categoriesEntity;

  @ManyToOne(() => UsersEntity)
  @JoinColumn({ name: "user_id" })
  user_id!: UsersEntity;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  creates_at!: Date;
}
