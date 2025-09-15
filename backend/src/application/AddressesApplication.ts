import { Addresses } from '../domain/models/Addresses';
import { AddressesPort } from '../domain/ports/AddressesPort';

export class AddressesApplication {
    private port: AddressesPort;

    constructor(port: AddressesPort) {
        this.port = port;
    }

    async createAddress(address:Omit<Addresses, "address_id">):Promise<number>{
        const existingAddress = await this.port.getAddressByVereda(address.vereda)
        if(!existingAddress){
            return await this.port.createAddress(address);
        }
        throw new Error("La dirección ya existe");
    }

    async updateAddress(address_id:number, address:Partial<Addresses>):Promise<boolean>{
        const existingAddress= await this.port.getAddressById(address_id);
        if(!existingAddress){
            throw new Error("La dirección no existe")
        }

        if(address.vereda){
            const veredaTaken = await this.port.getAddressByVereda(address.vereda);
            if(veredaTaken && veredaTaken.address_id !== address_id){
                throw new Error("Error en actualizar la dirección NO SE PUEDE!")
            }
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

    async getAddressByVereda(vereda:string): Promise<Addresses | null>{
        return await this.port.getAddressByVereda(vereda);
    }

    async getAllAddresses(): Promise <Addresses[]>{
        return await this.port.getAllAddresses();
    }
    
}