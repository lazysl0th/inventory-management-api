import type { Handler } from "express"
import Validator from "../base/Validator.js"
import type { IItemValidator } from "../types/validators/Item.js"
import { Joi, Segments } from "celebrate"

export default class ItemValidator extends Validator implements IItemValidator {
    getItems(): Handler {
        return this.validate({
            [Segments.PARAMS]: Joi.object().keys({
                inventoryId: this.idSchema,
            })},
            { convert: true }
        )
    }

    getItem(): Handler {
        return this.validate({
            [Segments.PARAMS]: Joi.object().keys({
                inventoryId: this.idSchema,
                itemId: this.idSchema,
            })},
            { convert: true }
        )
    }

    createItem(): Handler {
        return this.validate({
            [Segments.PARAMS]: Joi.object().keys({
                inventoryId: this.idSchema,
            })},
            { convert: true }
        )
    }

    updateItem(): Handler {
        return this.validate({
            [Segments.PARAMS]: Joi.object().keys({
                inventoryId: this.idSchema,
                itemId: this.idSchema,
            })},
            { convert: true }
        )
    }

    deleteItems(): Handler {
        return this.validate({
            [Segments.BODY]: Joi.object().keys({
                itemIds: this.numberArrayRequiredSchema,
            })},
            { convert: true }
        )
    }
}