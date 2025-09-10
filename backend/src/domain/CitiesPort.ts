import { Cities } from './Cities';
export interface CitiesPort{
     createCity(city: Omit<Cities,"city_id">): Promise<number>;
     updateCity(city_id:number, cities:Partial<Cities>):Promise<boolean>;
     deleteCity(city_id:number): Promise<boolean>;
     getAllCities(): Promise<Cities[]>;
     getCityById(city_id:number): Promise<Cities | null>;
     getCityByName(name:string): Promise <Cities | null>;

}