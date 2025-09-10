import { Repository } from "typeorm";
import { Cities } from '../../domain/Cities';
import { CitiesPort } from "../../domain/CitiesPort";
import { CitiesEntity } from "../entities/CitiesEntity";
import { AppDataSource } from "../config/con_data_bases";

export class CitiesAdapter implements CitiesPort {
    private cityRepository: Repository<CitiesEntity>;

    constructor() {
        this.cityRepository = AppDataSource.getRepository(CitiesEntity);
    }

    private toDomain(city: CitiesEntity): Cities {
        return {
            city_id: city.city_id,
            city_name: city.city_name,
            department_id: city.department_id,
           
        };
    }

    private toEntity(city: Omit<Cities, "city_id">): CitiesEntity {
        const citiesEntity = new CitiesEntity();
        citiesEntity.city_name = city.city_name;
        citiesEntity.department_id = city.department_id;
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

            // Actualizamos solo los campos enviados
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
            const cities = await this.cityRepository.find();
            return cities.map((city) => this.toDomain(city));
        } catch (error) {
            console.error("Error fetching all cities", error);
            throw new Error("Error fetching all cities");
        }
    }

    async getCityById(city_id: number): Promise<Cities | null> {
        try {
            const city = await this.cityRepository.findOne({ where: { city_id: city_id } });
            return city ? this.toDomain(city) : null;
        } catch (error) {
            console.error("Error fetching city by id", error);
            throw new Error("Error fetching city by id");
        }
    }

    async getCityByName(name: string): Promise<Cities | null> {
        try {
            const city= await this.cityRepository.findOne({ where: { city_name: name } });
            return city ? this.toDomain(city) : null;
        } catch (error) {
            console.error("Error fetching city by name", error);
            throw new Error("Error fetching city by name");
        }
    }
}
