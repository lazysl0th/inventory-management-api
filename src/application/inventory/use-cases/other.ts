/*export const getItemsCount = (parent, client) => {
    if (parent._count?.items !== undefined) return parent._count.items;
    return itemsCount(parent.id, client);
}

const groupFieldsByType = (fields) => fields.reduce((acc, field) => {
    (acc[field.type] ??= []).push(field);
    return acc;
}, {});

export const getStats = async (parent, client) => {
    try {
        const items = await selectAllItems(parent.id, client);
        const fieldsByType = groupFieldsByType(parent.fields);
        return calculateFieldStats(fieldsByType, items);
    } catch (e) {
        console.log(e)
    }
}*/

/*export const getInventoryInfo = async (apiToken) => {
    const inventory = await selectInventoryByApiToken(apiToken, prisma);
    if (!inventory) throw new NotFound(NOT_FOUND.text);
    const stats = await getStats(inventory, prisma);
    return {inventory: { title: inventory.title, fields: inventory.fields, itemsCount: inventory._count.items}, stats: stats};
}*/
