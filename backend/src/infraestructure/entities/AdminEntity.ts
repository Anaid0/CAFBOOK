import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'admin'})
export class AdminEntity{
    @PrimaryGeneratedColumn()
    admin_id!: number;

    @Column({type: "character varying", length: 150})
    email!: string;

    @Column({type: "character varying", length:25})
    password!: string;
}