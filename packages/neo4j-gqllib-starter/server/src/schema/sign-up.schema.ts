import * as yup from 'yup';
import { appConstants as c } from "../app/constants";
import { ISignUpSchema } from './interfaces';

const schema = yup.object().shape({
  email: yup.string().required().email(),
  password: yup.string().matches(
    c.regEx.password,
    'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character'
  )
});

export const isValidSignUp = (data: ISignUpSchema) => schema
  .isValid(data).then((valid) => valid);

export const validateSignUp = (data: ISignUpSchema) => schema
  .validate(data).then((valid) => valid);
