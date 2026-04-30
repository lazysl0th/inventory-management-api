import type { Handler } from "express";
import Validator from "../base/Validator.js";
import { Joi, Segments } from "celebrate";
import type { IUserValidator } from "../types/validators/User.js";
import type { TSafeUser } from "../types/models/User.js";
import { $Enums } from "@prisma/client";

export default class UserValidator extends Validator implements IUserValidator {
    getUser(): Handler {
        return this.validate({
            [Segments.PARAMS]: Joi.object().keys({
                userId: this.idSchema,
            })},
            { convert: true }
        )
    }

    updateUser(): Handler {
        return this.validate({
            [Segments.PARAMS]: Joi.object().keys({
                userId: this.idSchema,
            }),
            [Segments.BODY]: Joi.object().keys({
                name: Joi.string().required(),
                email: this.emailSchema,
            })},
            { convert: true }
        )
    }

    deleteUsers(): Handler {
        return this.validate({
            [Segments.BODY]: Joi.object().keys({
                userIds: this.numberArrayRequiredSchema,
            })},
            { convert: true }
        )
    }

    updateUsers(): Handler {
        return this.validate({
            [Segments.BODY]: Joi.object().keys({
                ids: this.numberArrayRequiredSchema,
                data: Joi.object<TSafeUser>().keys({
                    status: Joi.string().valid(...Object.values($Enums.Status))
                })
            })},
            { convert: true }
        )
    }
}