import type { Handler } from "express";
import Validator from "../base/Validator.js";
import { Joi, Segments } from "celebrate";
import type { IUserRoleValidator } from "../types/validators/UserRole.js";

export default class UserRoleValidator extends Validator implements IUserRoleValidator {
    changeRoles(): Handler {
        return this.validate({
            [Segments.BODY]: Joi.object().keys({
                userIds: this.numberArrayRequiredSchema,
                roleIds: this.numberArrayRequiredSchema,
            })},
            { convert: true }
        )
    }
}