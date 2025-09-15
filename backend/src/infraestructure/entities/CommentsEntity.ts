import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { UsersEntity } from "./UsersEntity";

@Entity({ name: "comments" })
export class CommentsEntity {
  @PrimaryGeneratedColumn()
  comment_id!: number;

  @ManyToOne(() => UsersEntity)
  @JoinColumn({ name: "user_id" })
  user_id!: UsersEntity;

  @Column({ type: "character varying", length: 150 })
  content!: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;
}
