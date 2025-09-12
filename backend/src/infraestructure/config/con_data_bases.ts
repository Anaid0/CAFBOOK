import { DataSource } from "typeorm";
//import { UserEntity } from "../entities/UsersEntity";
import envs from "../config/enviroments-vars";
import { RolesEntity } from "../entities/RolesEntity";
import { Document_typesEntity } from "../entities/Document_typesEntity";
import { Media_typesEntity } from "../entities/Media_typesEntity";
import {Number_typesEntity } from "../entities/Number_typesEntity";
import { Post_categoriesEntity } from "../entities/Post_categoriesEntity";
import { CitiesEntity } from "../entities/CitiesEntity";
import { AddressesEntity } from "../entities/AddressesEntity";
import { Crop_typesEntity } from "../entities/Crop_typesEntity";
import { PhonesEntity } from "../entities/PhonesEntity";
import { Company_phonesEntity } from "../entities/Company_phonesEntity";
import { User_phonesEntity } from "../entities/User_phonesEntity";
import { DepartmentsEntity } from "../entities/DepartmentsEntity";

export const AppDataSource = new DataSource({
 type: "postgres",
 host: envs.DB_HOST,
 port: Number(envs.DB_PORT),
 username: envs.DB_USER,
 password: envs.DB_PASSWORD,
 database: envs.DB_NAME,
 schema: envs.DB_SCHEMA,
 synchronize: true,
 logging: true,
 entities:[RolesEntity, Document_typesEntity, Media_typesEntity, Number_typesEntity, Post_categoriesEntity, CitiesEntity, AddressesEntity, Crop_typesEntity, PhonesEntity, Company_phonesEntity, User_phonesEntity, DepartmentsEntity]
});

//Conectar a la Base de Datos
export const connectDB = async ()=>{
    try{
        await AppDataSource.initialize();
        console.log("Database connected")

    } catch (error) {
        console.error("Error connecting to the DB:", error)
        process.exit(1);
    }
}
