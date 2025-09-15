import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { PhonesEntity } from "./PhonesEntity";
import { CompaniesEntity } from "./CompaniesEntity";

@Entity({ name: "company_phones" })
export class Company_phonesEntity {
  @PrimaryGeneratedColumn()
  company_phone!: number;   

  @ManyToOne(() => PhonesEntity)
  @JoinColumn({ name: "phone_id" })
  phone_id!: PhonesEntity;

  @ManyToOne(() => CompaniesEntity)
  @JoinColumn({ name: "company_id" })
  company_id!: CompaniesEntity;
}
