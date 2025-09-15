import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { AddressesEntity } from "./AddressesEntity";
import { CompaniesEntity } from "./CompaniesEntity";

@Entity({ name: "company_addresses" })
export class Company_addressesEntity {
  @PrimaryGeneratedColumn()
  company_address_id!: number;   

  @ManyToOne(() => AddressesEntity)
  @JoinColumn({ name: "address_id" })
  address_id!: AddressesEntity;

  @ManyToOne(() => CompaniesEntity)
  @JoinColumn({ name: "company_id" })
  company_id!: CompaniesEntity;
}
