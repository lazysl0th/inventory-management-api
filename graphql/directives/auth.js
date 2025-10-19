import { defaultFieldResolver } from 'graphql';
import { mapSchema, getDirective, MapperKind } from '@graphql-tools/utils';
import Forbidden from '../../errors/forbidden.js';
import { response } from '../../constants.js';
import { selectInventoriesById } from '../../models/inventory.js'

const { FORBIDDEN, INSUFFICIENT_PERMISSION } = response;

const checkAuth = (user) => {
    if (!user) throw new Forbidden(FORBIDDEN.text);
}

const checkOwnerOrAdminRole = async (args, user, requiredRoles) => {
    const inventories = await selectInventoriesById(args.ids ? args.ids : [args.id]);
    const hasRole = user.roles.some((userRole) => requiredRoles.includes(userRole.role.name));
    if (!hasRole && inventories.some(inventory => inventory.ownerId !== user.id)) throw new Forbidden(INSUFFICIENT_PERMISSION.text);
}

const resolverWithCheckUser = (resolve, requiredRoles, owner) => {
    return async (parent, args, context, info) => {
        checkAuth(context.user);
        if (owner || requiredRoles?.length) await checkOwnerOrAdminRole(args, context.user, requiredRoles);
        return resolve(parent, args, context, info);
    };
}

const handleDirective = (schema, directiveName) => {
    return (fieldConfig) => {
        const directive = getDirective(schema, fieldConfig, directiveName)?.[0];
        if (!directive) return fieldConfig;
        const { roles: requiredRoles, owner } = directive;
        const originalResolve = fieldConfig.resolve || defaultFieldResolver;
        fieldConfig.resolve = resolverWithCheckUser(originalResolve, requiredRoles, owner);
        return fieldConfig;
    };
}

export default (schema, directiveName) => {
  return mapSchema(schema, { [MapperKind.OBJECT_FIELD]: handleDirective(schema, directiveName) });
}