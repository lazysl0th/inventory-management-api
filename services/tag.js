import { selectTags } from '../models/tag.js'

export const select = async (client) => {
    const tags = await selectTags(client);
    return tags.map((tag) => ({ id: tag.id, name: tag.name, inventoriesCount: tag._count.inventories, inventories: tag.inventories}))
}