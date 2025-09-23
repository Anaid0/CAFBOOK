import { User_addresses } from '../domain/domain/User_addresses';
import { User_addressPort } from '../domain/ports/User_addressesPort';

export class User_addressApplication {
    private port: User_addressPort;

    constructor(port: User_addressPort) {
        this.port = port;
    }

    async createUseraddress(useraddress: Omit<User_addresses, "user_address_id" | "user_name" | "address_street">): Promise<number> {
        const existingAddress = await this.port.getUserAddressByAddressId(useraddress.address_id);
        if (existingAddress.length === 0) {
            return await this.port.createUserAddress(useraddress);
        }
        throw new Error("La dirección del usuario ya existe");
    }

    async updateUserAddress(user_address_id: number, useraddress: Partial<User_addresses>): Promise<boolean> {
        const existingAddress = await this.port.getUserAddressById(user_address_id);
        if (!existingAddress) {
            throw new Error("La dirección del usuario no existe");
        }

        if (useraddress.address_id) {
            const useraddressTaken = await this.port.getUserAddressByAddressId(useraddress.address_id);
            const isTaken = useraddressTaken.some(addr => addr.user_address_id !== user_address_id);
            if (isTaken) {
                throw new Error("Error en actualizar la dirección de la compañia");
            }
        }
        return await this.port.updateUserAddress(user_address_id, useraddress);
    }

    async deleteUserAddress(user_address_id: number): Promise<boolean> {
        const existingUseraddress = await this.port.getUserAddressById(user_address_id);
        if (!existingUseraddress) {
            throw new Error("No se encontró la dirección del usuario");
        }
        return await this.port.deleteUserAddress(user_address_id);
    }

    async getUseraddressById(user_address_id: number): Promise<User_addresses | null> {
        return await this.port.getUserAddressById(user_address_id);
    }

    async getUserAddressByAddressid(address_id: number): Promise<User_addresses[]> {
        return await this.port.getUserAddressByAddressId(address_id);
    }

    async getUseraddressByUserEmail(email: string): Promise<User_addresses[]> {
        return await this.port.getUserAddressByUserEmail(email);
    }

    async getUseraddressByDepartmentName(department_name: string): Promise<User_addresses[]> {
        return await this.port.getUserAddressByDepartmentName(department_name);
    }

    async getAllUserAddresses(): Promise<User_addresses[]> {
        return await this.port.getAllUserAddresses();
    }
}
