import { Repository } from "typeorm";
import { Addresses } from "../../domain/Addresses";
import { AddressesPort } from "../../domain/AddressesPort";
import { AddressesEntity } from "../entities/AddressesEntity";
import { AppDataSource } from "../config/con_data_bases";
import { CitiesEntity } from '../entities/CitiesEntity';

export class AddressesAdapter implements AddressesPort {
    private addressRepository: Repository<AddressesEntity>;

    constructor() {
        this.addressRepository = AppDataSource.getRepository(AddressesEntity);
    }

    private toDomain(address: AddressesEntity): Addresses {
        return {
            address_id: address.address_id,
            street: address.street,
            vereda: address.vereda,
            postal_code: address.postal_code,
            city_id: address.city_id.city_id,
        };
    }

    private toEntity(address: Omit<Addresses, "address_id">): AddressesEntity {
        const addressEntity = new AddressesEntity();
        const citiesEntity = new CitiesEntity();

        citiesEntity.city_id = address.city_id;
        addressEntity.street = address.street;
        addressEntity.vereda = address.vereda;
        addressEntity.postal_code = address.postal_code;
        addressEntity.city_id = citiesEntity;
        return addressEntity;
    }

    async createAddress(address: Omit<Addresses, "address_id">): Promise<number> {
        try {
            const newAddress = this.toEntity(address);
            const savedAddress = await this.addressRepository.save(newAddress);
            return savedAddress.address_id;
        } catch (error) {
            console.error("Error creating address", error);
            throw new Error("Error creating address");
        }
    }

    async updateAddress(address_id: number, address: Partial<Addresses>): Promise<boolean> {
        try {
            const existingAddress = await this.addressRepository.findOne({ where: { address_id } });
            if (!existingAddress) {
                throw new Error("Address not found");
            }

            if(address.city_id){
                const city = new CitiesEntity();
                city.city_id = address.city_id;
                existingAddress.city_id = city;
            }

            Object.assign(existingAddress, {
                street: address.street ?? existingAddress.street,
                vereda: address.vereda ?? existingAddress.vereda,
                postal_code: address.postal_code ?? existingAddress.postal_code,
                city_id: address.city_id ?? existingAddress.city_id,
            });

            await this.addressRepository.save(existingAddress);
            return true;
        } catch (error) {
            console.error("Error updating address", error);
            throw new Error("Error updating address");
        }
    }

    async deleteAddress(address_id: number): Promise<boolean> {
        try {
            const existingAddress = await this.addressRepository.findOne({ where: { address_id } });
            if (!existingAddress) {
                throw new Error("Address not found");
            }
            await this.addressRepository.remove(existingAddress);
            return true;
        } catch (error) {
            console.error("Error deleting address", error);
            throw new Error("Error deleting address");
        }
    }

    async getAllAddresses(): Promise<Addresses[]> {
        try {
            const addresses = await this.addressRepository.find();
            return addresses.map(this.toDomain);
        } catch (error) {
            console.error("Error fetching all addresses", error);
            throw new Error("Error fetching all addresses");
        }
    }

    async getAddressById(address_id: number): Promise<Addresses | null> {
        try {
            const address = await this.addressRepository.findOne({ where: { address_id } });
            return address ? this.toDomain(address) : null;
        } catch (error) {
            console.error("Error fetching address by id", error);
            throw new Error("Error fetching address by id");
        }
    }

    async getAddressByVereda(vereda: string): Promise<Addresses | null> {
        try {
            const address= await this.addressRepository.findOne({ where: { vereda: vereda } });
            return address ? this.toDomain(address) : null;
        } catch (error) {
            console.error("Error fetching address by vereda", error);
            throw new Error("Error fetching address by vereda");
        }
    }
}
