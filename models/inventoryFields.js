import selectClient from '../services/prisma.js';

const prepareFieldsData = (fields, inventoryId) => {
    return fields.map((field) => {
        const { id, ...rest } = field;
        const data = Object.fromEntries(
            Object.entries({ ...rest, inventoryId }).filter(([_, value]) => value !== undefined)
        )
        return id ? { id, data } :  data 
    });
}

export const createInventoryFields = (inventoryId, fields, client) => {
    const fieldsData = prepareFieldsData(fields, inventoryId);
    return selectClient(client).inventoryField.createMany({ data: fieldsData });
};

export const updateInventoryFields = (fields, client) => {
    const fieldsData = prepareFieldsData(fields);
    return Promise.all(
        fieldsData.map(field =>
            selectClient(client).inventoryField.update({
                where: { id: field.id },
                data: field.data
            })
        )
    );
}

export const deleteInventoryFields = (inventoryId, fieldsTitles, client) => {
    return selectClient(client).inventoryField.updateMany({
        where: {
            inventoryId: inventoryId,
            title: { notIn: fieldsTitles },
            isDeleted: false,
        },
        data: { isDeleted: true },
    });
}