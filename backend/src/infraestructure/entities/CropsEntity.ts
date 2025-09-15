import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { UsersEntity } from "./UsersEntity";
import { Crop_typesEntity } from "./Crop_typesEntity";

@Entity({ name: "crops" })
export class CropsEntity {
  @PrimaryGeneratedColumn()
  crop_id!: number;

  @ManyToOne(() => UsersEntity)
  @JoinColumn({ name: "user_id" })
  user_id!: UsersEntity;

  @ManyToOne(() => Crop_typesEntity)
  @JoinColumn({ name: "crop_type_id" })
  crop_type_id!: Crop_typesEntity;

  @Column({ type: "int" })
  latitude!: number;

  @Column({ type: "int" })
  longitude!: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;
}
