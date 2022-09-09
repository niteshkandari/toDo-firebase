import { EMP_FIELD } from './model.enum';

export class Validator {
  static validate(args: any) {
    let res = { isValid: true };
    for (let key in args) {
      if (key === EMP_FIELD.NAME) {
        // if (/\b([A-ZÀ-ÿ][-,a-z. ']+[ ]*)+/.exec(args[key])) {
        //   Object.assign(res, { isValid: false, message: `${key} field has to be a valid name` });
        // }
        if (args[key].length > 20) {
          Object.assign(res, {
            isValid: false,
            message: `${key} cannot be more than 12 characted`
          });
        }
      } else if (key === EMP_FIELD.SALARY) {
        if (!/^[0-9]/.exec(args[key]))
          Object.assign(res, { isValid: false, message: `please enter valid salary` });
      }
    }
    return res;
  }
}
