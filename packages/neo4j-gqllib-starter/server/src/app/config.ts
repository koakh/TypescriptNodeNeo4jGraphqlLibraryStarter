import * as dotenv from 'dotenv';

dotenv.config();

export const HTTP_SERVER_PORT = Number(process.env.HTTP_SERVER_PORT || 5000);
export const HTTPS_SERVER_PORT = Number(process.env.HTTPS_SERVER_PORT || 5001);
export const HTTPS_SERVER = !!process.env.CORS_ORIGIN || false;
export const CORS_ORIGIN = process.env.CORS_ORIGIN as string || 'http://localhost:4000';
export const NODE_ENV = process.env.NODE_ENV as string;
export const NEO_USER: string = process.env.NEO_USER || 'admin';
export const NEO_PASSWORD: string = process.env.NEO_PASSWORD || 'password';
export const NEO_URL: string = process.env.NEO_URL || 'neo4j://localhost:7687/neo4j';
export const NEO_ENCRYPTION: string = process.env.NEO_ENCRYPTION || 'ENCRYPTION_OFF';
export const NEO_GRAPHQL_JWT_SECRET: string = process.env.NEO_GRAPHQL_JWT_SECRET || 'secret';
export const HTTPS_SERVER_CERT: string = process.env.HTTPS_SERVER_CERT || 'server.crt';
export const HTTPS_SERVER_KEY: string = process.env.HTTPS_SERVER_KEY || 'server.key';
