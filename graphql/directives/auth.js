import { defaultFieldResolver } from 'graphql';
import { mapSchema, getDirective, MapperKind } from '@graphql-tools/utils';
import modelCheckers from './modelCheckers/modelCheckers.js';
import { response, userStatus } from '../../constants.js';
import Forbidden from '../../errors/forbidden.js';

const { FORBIDDEN, BLOCKED } = response;

const checkAuth = (user) => {
    if (!user) throw new Forbidden(FORBIDDEN.text);
    if (user.status == userStatus.BLOCKED) throw new Forbidden(BLOCKED.text);
}

const checkModel = async (modelName, args, requiredRoles, user) => {
  const checker = modelCheckers[modelName];
  if (!checker) return;
  await checker(args, user, requiredRoles);
};

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