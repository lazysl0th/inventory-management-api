export const createItemValue = (value, client) => {
    return client.itemValue.createMany({ data: value });
};

export const updateItemValue = (value, client) => {
    return client.itemValue.upsert({
        where: { itemId_fieldId: { itemId: value.itemId, fieldId: value.fieldId } },
        update: { value: value.value },
        create: { itemId: value.itemId, fieldId: value.fieldId, value: value.value },
    });
}