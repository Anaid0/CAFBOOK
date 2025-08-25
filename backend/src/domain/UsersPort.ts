import { Users } from "./Users";
export interface UserPort{
     createUser(user: Omit<Users,"id">): Promise<number>;
     updateUser(id:number, user:Partial<Users>):Promise<boolean>;
     deleteUser(id:number): Promise<boolean>;
     getAllUsers(): Promise<Users[]>;
     getUserById(id:number): Promise<Users | null>;
     getUserByEmail(email:string): Promise <Users | null>;

}