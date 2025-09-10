import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:'crop_types'})
export class Crop_typesEntity{
    @PrimaryGeneratedColumn()
    crop_type_id!: number;

    @Column({type: "character varying", length:150})
    description!: string;
}