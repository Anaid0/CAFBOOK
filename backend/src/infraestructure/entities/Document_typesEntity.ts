import { Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import { UserEntity } from "./UsersEntity";

@Entity({name: 'document_types'})
export class Document_typesEntity{
    @PrimaryGeneratedColumn()
    doc_type_id!: number;

    @Column({type: "character varying", length:255})
    description!: string;

    @OneToMany(()=> UserEntity, (user)=> user.user_id)
    user!: UserEntity[];

}