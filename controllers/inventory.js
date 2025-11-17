import { getInventoryToken, getInventoryInfo } from '../services/inventory.js';
import prisma from '../infrastructure/prisma.js';
import { create } from '../services/item.js';
import { response } from '../constants.js'

const { OK } = response;

export const getToken = async (req, res, next) => {
    try {
        const token = await getInventoryToken(req.body.inventoryId);
        return res.status(OK.statusCode).send(token);
    } catch(e) {
        console.log(e);
        return next(e);
    }
}

export const getInventory = async (req, res, next) => {
    try {
        const inventoryInfo = await getInventoryInfo(req.params.apiToken);
        return res.status(OK.statusCode).send(inventoryInfo);
    } catch(e) {
        console.log(e);
        return next(e);
    }
}

export const createItem = async (req, res, next) => {
    try {
        const item = await create({ values: req.body.values, apiToken: req.params.apiToken }, req.body.owner, prisma)
        return res.status(OK.statusCode).send({ id: item.id });
    } catch(e) {
        console.log(e);
        return next(e);
    }
}