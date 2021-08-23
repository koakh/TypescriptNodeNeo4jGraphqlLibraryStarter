import * as yup from 'yup';
import { appConstants as c } from "../app/constants";
import { ISignInSchema } from './interfaces';

const schema = yup.object().shape({
  email: yup.string().required().email(),
  password: yup.string().matches(
    c.regEx.password,
    'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character'
  )
});

export const isValidSignIn = (data: ISignInSchema) => schema
  .isValid(data).then((valid) => valid);

export const validateSignIn = (data: ISignInSchema) => schema
  .validate(data).then((valid) => valid);
