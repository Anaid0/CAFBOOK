import { Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";

@Entity({name: 'document_types'})
export class Document_typesEntity{
    @PrimaryGeneratedColumn()
    doc_type_id!: number;

    @Column({type: "character varying", length:255})
    description!: string;

}