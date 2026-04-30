import type { Handler } from "express";
import Validator from "../base/Validator.js";
import { Joi, Segments } from "celebrate";
import type { IAuthValidator } from "../types/validators/Auth.js";

export default class AuthValidator extends Validator implements IAuthValidator {

    loginUserByEmail(): Handler {
        return this.validate({
            [Segments.BODY]: Joi.object().keys({
                email: this.emailSchema,
                password: this.stringRequiredSchema,
                remember: Joi.bool().truthy('true', '1').falsy('false', '0').valid(true, false).default(false)
            }),
        })
    }
    
    registerUser(): Handler {
        return this.validate({
            [Segments.BODY]: Joi.object().keys({
                name: this.stringRequiredSchema,
                email: this.emailSchema,
                password: this.stringRequiredSchema,
            }),
        })
    }

    resetUserPassword(): Handler {
        return this.validate({
            [Segments.BODY]: Joi.object().keys({
                email: this.emailSchema,
            }),
        })
    }
}