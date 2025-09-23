import { Cities } from "../domain/entities/Cities"
import { CitiesPort } from '../domain/port/CitiesPort';

export class CitiesApplication {
    private port: CitiesPort;

    constructor(port: CitiesPort) {
        this.port = port;
    }

    async createCity(city:Omit<Cities, "city_id" | "department_name">):Promise<number>{
        const existingCity = await this.port.getCityByName(city.city_name)
        if(!existingCity){
            return await this.port.createCity(city);
        }
        throw new Error("La ciudad ya existe");
    }

    async updateCity(city_id:number, city:Partial<Cities>):Promise<boolean>{
        const existingCity= await this.port.getCityById(city_id);
        if(!existingCity){
            throw new Error("La ciudad no existe")
        }

        if(city.city_name){
            const city_nameTaken = await this.port.getCityByName(city.city_name);
            if(city_nameTaken && city_nameTaken.city_id !== city_id){
                throw new Error("Error en actualizar el nombre NO SE PUEDE!")
            }
        }
        return await this.port.updateCity(city_id,city);
    }

    async deleteCity(city_id:number): Promise<boolean>{
        const existingCity = await this.port.getCityById(city_id);
        if(!existingCity){
            throw new Error("No se encontró la ciudad");
        }
        return await this.port.deleteCity(city_id);

    }

    async getCityById(city_id:number): Promise<Cities | null>{
        return await this.port.getCityById(city_id);
    }

    async getCityByName(name:string): Promise<Cities | null>{
        return await this.port.getCityByName(name);
    }

    async getCityByDepartmentId(department_id: number): Promise <Cities[]>{
        return await this.port.getCityByDepartmentId(department_id);
    }

    async getCityByDepartmentName(department_name: string): Promise <Cities[]>{
        return await this.port.getCityByDepartmentName(department_name);
    }

    async getAllCities(): Promise <Cities[]>{
        return await this.port.getAllCities();
    }
    
}