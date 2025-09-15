import { Addresses } from './Addresses';
export interface AddressesPort{
     createAddress(address: Omit<Addresses,"address_id">): Promise<number>;
     updateAddress(address_id:number, cities:Partial<Addresses>):Promise<boolean>;
     deleteAddress(address_id:number): Promise<boolean>;
     getAllAddresses(): Promise<Addresses[]>;
     getAddressById(address_id:number): Promise<Addresses | null>;
     getAddressByVereda(vereda: string): Promise<Addresses | null>;
}