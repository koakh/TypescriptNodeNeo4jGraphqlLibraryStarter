import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as config from '../app/config';
import { UserRole } from '../types/enums/user-role.enum';

const saltRounds = 10;

export function comparePassword(plainText: string, hash: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    bcrypt.compare(plainText, hash, (err, result) => {
      if (err) {
        return reject(err);
      }

      return resolve(result);
    });
  });
}

export function createJWT(data: { sub: string, roles: [UserRole] }): Promise<string> {
  return new Promise((resolve, reject) => {
    jwt.sign(data, config.NEO4J_GRAPHQL_JWT_SECRET, (err, token) => {
      if (err) {
        return reject(err);
      }

      return resolve(token as string);
    });
  });
}

export function decodeJWT(token: string): Promise<{ sub: string }> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.NEO4J_GRAPHQL_JWT_SECRET, (err, decoded) => {
      if (err) {
        reject(err);
      }

      const { sub } = decoded as { sub: string };

      resolve({ sub });
    });
  });
}

export function hashPassword(plainText: string): Promise<string> {
  return new Promise((resolve, reject) => {
    bcrypt.hash(plainText, saltRounds, (err, hash) => {
      if (err) {
        reject(err);
      }

      resolve(hash);
    });
  });
}
