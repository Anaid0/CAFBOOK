import { User_phones } from "./User_phones";
export interface User_phonesPort {
    createUserPhone(userphone: Omit<User_phones, "user_phone" | "user_name" | "phone_number"| "user_email">): Promise<number>;
    updateUserPhone(user_phone: number, userphone: Partial<User_phones>): Promise<boolean>;
    deleteUserPhone(user_phone: number): Promise<boolean>;
    getAllUserPhones(): Promise<User_phones[]>;
    getUserPhoneById(user_phone: number): Promise<User_phones | null>;
    getUserPhoneByPhoneId(phone_id: number): Promise<User_phones[]>;
    getUserPhonesByUserEmail(email:string): Promise <User_phones[]>;
    getUserPhonesByUserId(user_id:number): Promise <User_phones[]>;
  }