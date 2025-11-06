const prepareFieldsValue = (values, itemId) => {
    return values.map((value) => Object.fromEntries(Object.entries({ ...value, itemId }).filter(([_, value]) => value !== undefined)));
}

export const createItemValue = (itemId, values, client) => {
    const fieldsValue = prepareFieldsValue(values, itemId);
    return client.itemValue.createMany({ data: fieldsValue });
};

export const updateItemValue = (itemId, value, client) => {
    return client.itemValue.upsert({
        where: { itemId_fieldId: { itemId, fieldId: value.fieldId } },
        update: { value: value.value },
        create: { itemId, fieldId: value.fieldId, value: value.value },
    });
}