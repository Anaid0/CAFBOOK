import { DataSource } from "typeorm";
import { UserEntity } from "../entities/UsersEntity";
import envs from "../config/enviroments-vars";

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
 entities:[UserEntity]
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
