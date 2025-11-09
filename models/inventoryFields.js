export const deleteInventoryFields = (ids, client) => {
    return client.inventoryField.deleteMany({
        where: { id: { in: ids } },
    });
}

export const updateInventoryField = (field, client) => {
    return client.inventoryField.update({
        where: { id: field.id },
        data: {
            title: field.title,
            type: field.type,
            description: field.description,
            showInTable: field.showInTable,
            order: field.order,
            isDeleted: field.isDeleted,
        },
    });
}

export const createInventoryField = (inventoryId, field, client) => {
    return client.inventoryField.create({
        data: {
            inventoryId,
            title: field.title,
            type: field.type,
            description: field.description,
            showInTable: field.showInTable,
            order: field.order,
            isDeleted: field.isDeleted,
        },
    });
}