import { Repository } from "typeorm";
import { Cities } from '../../domain/Cities';
import { CitiesPort } from "../../domain/CitiesPort";
import { CitiesEntity } from "../entities/CitiesEntity";
import { AppDataSource } from "../config/con_data_bases";
import { DepartmentsEntity } from "../entities/DepartmentsEntity";

export class CitiesAdapter implements CitiesPort {
    private cityRepository: Repository<CitiesEntity>;

    constructor() {
        this.cityRepository = AppDataSource.getRepository(CitiesEntity);
    }

    private toDomain(city: CitiesEntity): Cities {
        return {
            city_id: city.city_id,
            city_name: city.city_name,
            department_id: city.department_id.department_id, 
        };
    }

    private toEntity(city: Omit<Cities, "city_id">): CitiesEntity {
        const citiesEntity = new CitiesEntity();
        const departmentsEntity = new DepartmentsEntity();

        departmentsEntity.department_id = city.department_id;
        citiesEntity.department_id = departmentsEntity;

        citiesEntity.city_name = city.city_name;
        
        return citiesEntity;
    }

    async createCity(city: Omit<Cities, "city_id">): Promise<number> {
        try {
            const newCity = this.toEntity(city);
            const savedCity = await this.cityRepository.save(newCity);
            return savedCity.city_id;
        } catch (error) {
            console.error("Error creating city", error);
            throw new Error("Error creating city");
        }
    }

    async updateCity(city_id: number, city: Partial<Cities>): Promise<boolean> {
        try {
            const existingCity = await this.cityRepository.findOne({ where: { city_id: city_id } });
            if (!existingCity) {
                throw new Error("City not found");
            }

            if(city.department_id){
                const department = new DepartmentsEntity();
                department.department_id = city.department_id;
                existingCity.department_id = department;
            }

            Object.assign(existingCity, {
                city_name: city.city_name ?? existingCity.city_name,
                department_id: city.department_id ?? existingCity.department_id,
                                
            });

            await this.cityRepository.save(existingCity);
            return true;
        } catch (error) {
            console.error("Error updating city", error);
            throw new Error("Error updating city");
        }
    }

    async deleteCity(city_id: number): Promise<boolean> {
        try {
            const existingCity = await this.cityRepository.findOne({ where: { city_id: city_id } });
            if (!existingCity) {
                throw new Error("City not found");
            };

            await this.cityRepository.save(existingCity);
            return true;
        } catch (error) {
            console.error("Error deleting city", error);
            throw new Error("Error deleting city");
        }
    }

    async getAllCities(): Promise<Cities[]> {
        try {
            const cities = await this.cityRepository.find({relations: ["department_id"]});
            return cities.map(this.toDomain);
        } catch (error) {
            console.error("Error fetching all cities", error);
            throw new Error("Error fetching all cities");
        }
    }

    async getCityById(city_id: number): Promise<Cities | null> {
        try {
            const city = await this.cityRepository.findOne({ relations: ["department_id"], where: { city_id: city_id }});
            return city ? this.toDomain(city) : null;
        } catch (error) {
            console.error("Error fetching city by id", error);
            throw new Error("Error fetching city by id");
        }
    }

    async getCityByName(name: string): Promise<Cities | null> {
        try {
            const city= await this.cityRepository.findOne({relations:["departmnet_id"], where: { city_name: name } });
            return city ? this.toDomain(city) : null;
        } catch (error) {
            console.error("Error fetching city by name", error);
            throw new Error("Error fetching city by name");
        }
    }
}
