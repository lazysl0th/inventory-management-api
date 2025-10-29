import { isOwner, hasAdminRole, hasAccess } from './utils.js'
import { selectInventoriesById } from '../../../models/inventory.js'
import { selectItemsById } from '../../../models/item.js';
import { response, modelName } from '../../../constants.js';
import Forbidden from '../../../errors/forbidden.js';
import NotFound from '../../../errors/notFound.js';

const { INSUFFICIENT_PERMISSION, NOT_FOUND_RECORDS } = response;
const { INVENTORY, ITEM } = modelName;

const checkModelInventory = async (args, user, requiredRoles, client) => {
    const inventories = await selectInventoriesById(args.ids ? args.ids : [args.id], client);
    if (inventories.length == 0) throw new NotFound(NOT_FOUND_RECORDS.text(INVENTORY));
    if (!isOwner(inventories, user) && !hasAdminRole(requiredRoles, user)) throw new Forbidden(INSUFFICIENT_PERMISSION.text)
}

const checkModelItem = async (args, user, requiredRoles, client) => {
    const items = await selectItemsById(args.ids ? args.ids : [args.id], client);
    if (items.length == 0) throw new NotFound(NOT_FOUND_RECORDS.text(ITEM));
    const uniqueInventories = Array.from(
        items.reduce((inventoriesMap, item) => inventoriesMap.set(item.inventory.id, item.inventory), new Map()).values()
    );
    if (!isOwner(uniqueInventories, user) && 
        !hasAdminRole(requiredRoles, user) && 
        !hasAccess(uniqueInventories, user)
    ) throw new Forbidden(INSUFFICIENT_PERMISSION.text)
}

export default {
  [modelName.INVENTORY]: checkModelInventory,
  [modelName.ITEM]: checkModelItem,
};