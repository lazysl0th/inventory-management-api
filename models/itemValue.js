import selectClient from '../services/prisma.js'

const prepareFieldsValue = (values, itemId) => {
    return values.map((value) => Object.fromEntries(Object.entries({ ...value, itemId }).filter(([_, value]) => value !== undefined)));
}

export const createItemValue = (itemId, values, client) => {
    const fieldsValue = prepareFieldsValue(values, itemId);
    return selectClient(client).itemValue.createMany({ data: fieldsValue });
};

export const deleteItemValue = (itemId, client) => {
    return selectClient(client).itemValue.deleteMany({ where: { itemId: itemId } });
}