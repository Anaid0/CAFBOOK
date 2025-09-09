import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Timestamp } from "typeorm/browser";

@Entity({name: 'comments'})
export class CropsEntity {
    @PrimaryGeneratedColumn()
    comment_id!: number;   
    
    @Column({type: "int"})
    user_id!:number;

    @Column({type: "character varying", length:255})
    company_id!:string;

    @Column({type: "int"})
    resource_type!:number;

    @Column({type: "int"})
    resource_id!:number;
        
    @Column({type:"character varying", length:255})
    content!:string;

    @Column({type:"time"})
    created_at!: Timestamp;
}