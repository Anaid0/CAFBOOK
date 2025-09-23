import { Number_types } from "./domain/Number_types";
export interface Number_typesPort{
     createNumber_type(number_type: Omit<Number_types,"number_type_id">): Promise<number>;
     updateNumber_type(number_type_id:number, number_type:Partial<Number_types>):Promise<boolean>;
     deleteNumber_type(number_type_id:number): Promise<boolean>;
     getAllNumber_types(): Promise<Number_types[]>;
     getNumber_typeById(number_type_id:number): Promise<Number_types | null>;
     getNumber_typeByDescription(description:string): Promise <Number_types | null>;

}
//