import type { Handler } from "express";
import Validator from "../base/Validator.js";
import type { IInventoryValidator } from "../types/validators/Inventory.js";
import { Joi, Segments } from "celebrate";
import { EnumInventorySortOrder } from "../types/services/Inventory.js";

export default class InventoryValidator extends Validator implements IInventoryValidator {
    getInventory(): Handler {
        return this.validate({
            [Segments.PARAMS]: Joi.object().keys({
                inventoryId: this.idSchema,
            })},
            { convert: true }
        )
    }

    getInventoryByToken(): Handler {
        return this.validate({
            [Segments.PARAMS]: Joi.object().keys({
                token: this.stringRequiredSchema,
            })},
        )
    }

    getInventories(): Handler {
        return this.validate({
            [Segments.QUERY]: Joi.object().keys({
                sort: this.stringOptionalSchema.valid(...Object.values(EnumInventorySortOrder)),
                ownerId: this.numberOptionalSchema,
                allowedUserId: this.numberOptionalSchema,
                isPublic: this.booleanOptionalSchema,
            })},
            { convert: true }
        )
    }

    updateInventory(): Handler {
        return this.validate({
            [Segments.PARAMS]: Joi.object().keys({
                inventoryId: this.idSchema,
            })},
            { convert: true }
        )
    }
    
    deleteInventories(): Handler {
        return this.validate({
            [Segments.BODY]: Joi.object().keys({
                inventoryIds: this.numberArrayRequiredSchema,
            })},
            { convert: true }
        )
    }

    searchInventories(): Handler {
        return this.validate({
            [Segments.QUERY]: Joi.object().keys({
                query: this.stringRequiredSchema
            }),
        })
    }
}