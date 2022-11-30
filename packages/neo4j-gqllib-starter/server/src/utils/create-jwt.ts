import jwt from 'jsonwebtoken';
import { UserRole } from '../types';
import * as config from '../app/config';

export function createJWT(data: { sub: string, roles: [UserRole] }): Promise<string> {
  return new Promise((resolve, reject) => {
    jwt.sign(data, config.NEO_GRAPHQL_JWT_SECRET, (err, token) => {
      if (err) {
        return reject(err);
      }

      return resolve(token as string);
    });
  });
}

export default createJWT;
