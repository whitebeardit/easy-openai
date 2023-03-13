import dotenv from 'dotenv';
import { name } from './../../package.json';

dotenv.config({ path: './environments/.env' });
process.env.SERVICE_NAME = name;
