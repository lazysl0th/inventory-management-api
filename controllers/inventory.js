import { getInventoryToken, getInventoryInfo } from '../services/inventory.js';
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