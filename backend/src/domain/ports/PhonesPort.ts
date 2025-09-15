import { Phones } from "../models/Phones";
export interface PhonesPort{
     createPhone(phone: Omit<Phones,"phone_id">): Promise<number>;
     updatePhone(phone_id:number, phones:Partial<Phones>):Promise<boolean>;
     deletePhone(phone_id:number): Promise<boolean>;
     getAllPhones(): Promise<Phones[]>;
     getPhoneById(phone_id:number): Promise<Phones | null>;
     getPhoneByNumber(number:string): Promise<Phones | null>;
     getPhoneByNumber_type_id(number_type_id:number): Promise <Phones | null>;

}