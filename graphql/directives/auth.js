import { defaultFieldResolver } from 'graphql';
import { mapSchema, getDirective, MapperKind } from '@graphql-tools/utils';
import Forbidden from '../../errors/forbidden.js';
import { response, modelName } from '../../constants.js';
import { selectInventoriesById } from '../../models/inventory.js'
import { selectItemsById } from '../../models/item.js';
import NotFound from '../../errors/notFound.js';
import BadRequest from '../../errors/badRequest.js';

const { FORBIDDEN, BLOCKED, INSUFFICIENT_PERMISSION, NOT_FOUND_RECORDS, BAD_REQUEST } = response;
const { INVENTORY, ITEM } = modelName

const checkAuth = (user) => {
    if (!user) throw new Forbidden(FORBIDDEN.text);
    if (user.status == 'Blocked') throw new Forbidden(BLOCKED.text);
}

const checkOwner = (objects, user) => objects.every(object => object.ownerId == user.id);

const adminRole = (requiredRoles, user) => user.roles.some((userRole) => requiredRoles.includes(userRole.role.name));

const checkAccess = (objects, user) => {
    return objects.every((object) => object.isPublic || (object.allowedUsers?.some((allowedUser) => user.id == allowedUser.id)));
}

const checkModelInventory = async (args, user, requiredRoles) => {
    const inventories = await selectInventoriesById(args.ids ? args.ids : [args.id]);
    if (inventories.length == 0) throw new NotFound(NOT_FOUND_RECORDS.text(INVENTORY));
    if (!checkOwner(inventories, user) && !adminRole(requiredRoles, user)) throw new Forbidden(INSUFFICIENT_PERMISSION.text)
}

const checkModelItem = async (args, user, requiredRoles) => {
    const items = await selectItemsById(args.ids ? args.ids : [args.id]);
    if (items.length == 0) throw new NotFound(NOT_FOUND_RECORDS.text(ITEM));
    const uniqueInventories = Array.from(
        items.reduce((inventoriesMap, item) => inventoriesMap.set(item.inventory.id, item.inventory), new Map()).values()
    );
    if (!checkOwner(uniqueInventories, user) && 
        !adminRole(requiredRoles, user) && 
        !checkAccess(uniqueInventories, user)
    ) throw new Forbidden(INSUFFICIENT_PERMISSION.text)
}

const checkModel = async (modelName, args, requiredRoles, user) => {
    switch (modelName) {
        case INVENTORY:
            await checkModelInventory(args, user, requiredRoles);
            break;
        case ITEM:
            await checkModelItem(args, user, requiredRoles)
            break;
    }
}

const resolverWithCheckUser = (resolve, modelName, requiredRoles) => {
    return async (parent, args, context, info) => {
        checkAuth(context.user);
        await checkModel(modelName, args, requiredRoles, context.user);
        return resolve(parent, args, context, info);
    };
}

const handleDirective = (schema, directiveName) => {
    return (fieldConfig) => {
        const directive = getDirective(schema, fieldConfig, directiveName)?.[0];
        if (!directive) return fieldConfig;
        const { modelName, roles: requiredRoles } = directive;
        const originalResolve = fieldConfig.resolve || defaultFieldResolver;
        fieldConfig.resolve = resolverWithCheckUser(originalResolve, modelName, requiredRoles,);
        return fieldConfig;
    };
}

export default (schema, directiveName) => {
  return mapSchema(schema, { [MapperKind.OBJECT_FIELD]: handleDirective(schema, directiveName) });
}