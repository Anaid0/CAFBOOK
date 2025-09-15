import { User_addresses } from "../models/User_addresses";
export interface User_addressPort {
    createUserAddress(useraddress: Omit<User_addresses, "user_address_id">): Promise<number>;
    updateUserAddress(user_address_id: number, useraddress: Partial<User_addresses>): Promise<boolean>;
    deleteUserAddress(user_address_id: number): Promise<boolean>;
    getAllUserAddresses(): Promise<User_addresses[]>;
    getUserAddressById(user_address_id: number): Promise<User_addresses | null>;
    getUserAddressByAddressId(address_id: number): Promise<User_addresses[]>;
  }