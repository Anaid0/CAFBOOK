import { User_addresses } from "./User_addresses";
export interface User_addressPort {
    createUserAddress(useraddress: Omit<User_addresses, "user_address_id" | "user_name" | "address_street">): Promise<number>;
    updateUserAddress(user_address_id: number, useraddress: Partial<User_addresses>): Promise<boolean>;
    deleteUserAddress(company_address_id: number): Promise<boolean>;
    getAllUserAddresses(): Promise<User_addresses[]>;
    getUserAddressById(company_address_id: number): Promise<User_addresses | null>;
    getUserAddressByAddressId(address_id: number): Promise<User_addresses[]>;
    getUserAddressByUserEmail(email:string): Promise <User_addresses[]>;
    getUserAddressByDepartmentName(department_name:string): Promise <User_addresses[]>;
  }
  //