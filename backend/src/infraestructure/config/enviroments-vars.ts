import * as joi from 'joi';
 import "dotenv/config";

 type ReturnEnviromentVars = {
    PORT: number;
    DB_HOST: string;
    DB_PORT: number;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_NAME: string;
    DB_SCHEMA: string;

 } 
 /**
 * ValidationEnvironmentVars: Estructura que almacena el resultado de la validación de las variables de entorno.
 */
 type ValidationEnviromentVars={
    error: joi.ValidationError | undefined;
    value: ReturnEnviromentVars;
 }
 function validateEnvars(vars:NodeJS.ProcessEnv):ValidationEnviromentVars{
    const envSchem = joi.object({
        PORT: joi.number().required(),
        DB_HOST: joi.string().required(),
        DB_PORT: joi.number().default(3306),
        DB_USER: joi.string().required(),
        DB_PASSWORD: joi.string().allow("").optional(),
        DB_NAME: joi.string().required()   ,
        DB_SCHEMA: joi.string().required()     
        }).unknown(true);
        const {error, value} = envSchem.validate(vars);
        return {error, value}
 }

 const loadEnvVars = () : ReturnEnviromentVars=>{
    const result = validateEnvars(process.env);
    if(result.error){
        throw new Error(`Error validating environment variables: ${result.error.message}`);
    }
    const value = result.value;
    return {
        PORT: value.PORT,
        DB_HOST: value.DB_HOST,
        DB_PORT: value.DB_PORT,
        DB_USER: value.DB_USER,
        DB_PASSWORD: value.DB_PASSWORD,
        DB_NAME: value.DB_NAME,
        DB_SCHEMA: value.DB_SCHEMA
    }
 }
 const envs = loadEnvVars();
 export default envs;