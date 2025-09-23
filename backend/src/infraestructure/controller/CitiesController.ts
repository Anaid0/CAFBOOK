import { CitiesApplication } from "../../application/CitiesApplication";
import { Cities } from "../../domain/domain/Cities";
import { Request, Response } from "express";
import { Validators } from "../config/validations";

export class CitiesController {
    private app: CitiesApplication;

    constructor(app: CitiesApplication) {
        this.app = app;
    }

    async registerCity(request: Request, response: Response): Promise<Response> {
        const { city_name, department_id } = request.body;
        try {
            if (!Validators.name(city_name)) {
                return response.status(400).json({ message: "Nombre de ciudad inválido" });
            }

            if (!department_id || isNaN(Number(department_id))) {
                return response.status(400).json({ message: "ID de departamento inválido" });
            }

            const city: Omit<Cities, "city_id" | "department_name"> = {
                city_name: city_name.trim(),
                department_id: Number(department_id)
            };

            const cityId = await this.app.createCity(city);

            return response.status(201).json({
                message: "Ciudad creada exitosamente",
                cityId,
            });
        } catch (error) {
            return response.status(500).json({ message: "Error en el servidor" });
        }
    }

    async searchCityById(request: Request, response: Response): Promise<Response> {
        try {
            const cityId = parseInt(request.params.id);
            if (isNaN(cityId)) {
                return response.status(400).json({ message: "Error en parámetro" });
            }

            const city = await this.app.getCityById(cityId);
            if (!city) {
                return response.status(404).json({ message: "Ciudad no encontrada" });
            }

            return response.status(200).json({
                city_id: city.city_id,
                city_name: city.city_name,
                department_id: city.department_id,
                department_name: city.department_name,
            });
        } catch (error) {
            return response.status(500).json({ message: "Error en el servidor" });
        }
    }

    async searchCityByName(request: Request, response: Response): Promise<Response> {
        try {
            const { name } = request.params;
            if (!Validators.name(name)) {
                return response.status(400).json({ error: "Nombre de ciudad no válido" });
            }

            const city = await this.app.getCityByName(name);
            if (!city) {
                return response.status(404).json({ message: "Ciudad no encontrada" });
            }

            return response.status(200).json({
                city_id: city.city_id,
                city_name: city.city_name,
                department_id: city.department_id,
                department_name: city.department_name,
            });
        } catch (error) {
            return response.status(500).json({ message: "Error en el servidor" });
        }
    }

    async searchCityByDepartmentId(req: Request, res: Response): Promise<Response> {
    try {
        const id = parseInt(req.params.id);
        const cities = await this.app.getCityByDepartmentId(id);

        if (!cities || cities.length === 0) {
            return res.status(404).json({ message: "No cities found for this department" });
        }

        const result = cities.map(city => ({
            city_id: city.city_id,
            city_name: city.city_name,
            department_id: city.department_id,
            department_name: city.department_name,
        }));

        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
}

    async searchCityByDepartmentName(request: Request, response: Response): Promise<Response> {
        try {
            const { name } = request.params;
            if (!Validators.name(name)) {
                return response.status(400).json({ error: "Nombre de ciudad no válido" });
            }

            const cities = await this.app.getCityByDepartmentName(name);
            if (!cities) {
                return response.status(404).json({ message: "Ciudades no encontrada" });
            }

            const result = cities.map(city => ({
                city_id: city.city_id,
                city_name: city.city_name,
                department_id: city.department_id,
                department_name: city.department_name,
            }));

            return response.status(200).json(result);
        } catch (error) {
            return response.status(500).json({ message: "Error en el servidor" });
        }
}

    async allCities(request: Request, response: Response): Promise<Response> {
        try {
            const cities = await this.app.getAllCities();

            const result = cities.map(city => ({
                city_id: city.city_id,
                city_name: city.city_name,
                department_id: city.department_id,
                department_name: city.department_name,
            }));

            return response.status(200).json(result);
        } catch (error) {
            return response.status(500).json({ message: "Error en el servidor" });
        }
    }

    async downCity(request: Request, response: Response): Promise<Response> {
        try {
            const cityId = parseInt(request.params.id);
            if (isNaN(cityId)) {
                return response.status(400).json({ message: "Error en parámetro" });
            }

            const city = await this.app.deleteCity(cityId);
            if (!city) {
                return response.status(404).json({ message: "Ciudad no encontrada" });
            }

            return response.status(200).json({ message: "Ciudad eliminada exitosamente" });
        } catch (error) {
            return response.status(500).json({ message: "Error en el servidor" });
        }
    }

    async updateCity(request: Request, response: Response): Promise<Response> {
        try {
            const cityId = parseInt(request.params.id);
            if (isNaN(cityId)) {
                return response.status(400).json({ message: "Error en parámetro" });
            }

            const { city_name, department_id } = request.body;

            if (city_name && !Validators.name(city_name)) {
                return response.status(400).json({ message: "El nombre de ciudad solo debe contener letras" });
            }

            if (department_id && isNaN(Number(department_id))) {
                return response.status(400).json({ message: "ID de departamento inválido" });
            }

            const updated = await this.app.updateCity(cityId, {
                city_name,
                department_id,
            });

            if (!updated) {
                return response.status(404).json({ message: "Ciudad no encontrada o sin cambios" });
            }

            return response.status(200).json({ message: "Ciudad actualizada exitosamente" });
        } catch (error) {
            return response.status(500).json({ message: "Error en el servidor" });
        }
    }
}
