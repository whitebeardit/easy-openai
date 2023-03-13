import os from 'os';
export const NODE_ENV = String(process.env.NODE_ENV);

export const HOSTNAME_POD = os.hostname();
export const LOG_LEVEL = String(process.env.LOG_LEVEL);

export const OPENAI_API_KEY = String(process.env.OPENAI_API_KEY);
export const OPENAI_ORGANIZATION = String(process.env.OPENAI_ORGANIZATION);
