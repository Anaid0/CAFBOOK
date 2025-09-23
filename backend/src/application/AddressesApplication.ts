import { Addresses } from '../domain/Addresses';
import { AddressesPort } from '../domain/AddressesPort';

export class AddressesApplication {
    private port: AddressesPort;

    constructor(port: AddressesPort) {
        this.port = port;
    }

    async createAddress(address:Omit<Addresses, "address_id" | "city_name">):Promise<number>{
        return await this.port.createAddress(address);
    }

    async updateAddress(address_id:number, address:Partial<Addresses>):Promise<boolean>{
        const existingAddress= await this.port.getAddressById(address_id);
        if(!existingAddress){
            throw new Error("La dirección no existe")
        }
        return await this.port.updateAddress(address_id,address);
    }

    async deleteAddress(address_id:number): Promise<boolean>{
        const existingAddress = await this.port.getAddressById(address_id);
        if(!existingAddress){
            throw new Error("No se encontró la dirección");
        }
        return await this.port.deleteAddress(address_id);

    }

    async getAddressById(address_id:number): Promise<Addresses | null>{
        return await this.port.getAddressById(address_id);

    }

    async getAddressByVereda(vereda:string): Promise<Addresses[]>{
        return await this.port.getAddressByVereda(vereda);
    }

    async getAddressByCityName(city_name:string): Promise<Addresses[]>{
        return await this.port.getAddressByCityName(city_name);
    }

    async getAddressByCityId(city_id:number): Promise<Addresses[]>{
        return await this.port.getAddressByCityId(city_id);
    }

    async getAllAddresses(): Promise <Addresses[]>{
        return await this.port.getAllAddresses();
    }
    
}