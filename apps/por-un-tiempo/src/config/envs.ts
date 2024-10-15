import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
    PORT: number;
    DB_HOST: string;
    DB_USER: string;
    DB_PASS: string;
    DATABASE: string;
    JWT_SEED: string;
    MS_PORT: number;
    MS_HOST: string;
}

const envsSchema = joi
.object({
    PORT: joi.number().required(),
    DB_HOST: joi.string().required(),
    DB_USER: joi.string().required(),
    //DB_PASS: joi.string().required(),
    DATABASE: joi.string().required(),
    JWT_SEED: joi.string().required(),
    MS_PORT: joi.number().required(),
    MS_HOST: joi.string().required(),
})
.unknown(true)

const { error, value } = envsSchema.validate(process.env);

if (error) throw new Error(`Config validation error: ${error.message}`);

const envVars: EnvVars = value;

export const envs = {
    port: envVars.PORT,
    host: envVars.DB_HOST,
    user: envVars.DB_USER,
    pass: envVars.DB_PASS,
    database: envVars.DATABASE,
    jwt: envVars.JWT_SEED,
    ms_port: envVars.MS_PORT,
    ms_host: envVars.MS_HOST
}