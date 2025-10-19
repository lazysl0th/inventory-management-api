import selectClient from '../services/prisma.js';

const deleteTags = (tagsName, exitingsTagsId, client) => {
    return selectClient(client).tag.deleteMany({
        where: {
            name: { in: tagsName },
            id: { notIn: exitingsTagsId },
        },
    })
}

export const upsertTag = (name, client) => {
    return selectClient(client).tag.upsert({
        where: { name },
        update: {},
        create: { name },
    })
}

export const updateTags = async (tagsName, existingTagsId, client) => {
    const deleteTagsResult = await deleteTags(tagsName, existingTagsId, client);
    const upsertTagsPromises = tagsName.map((tagName) => upsertTag(tagName, client));
    const updateTags = await Promise.all(upsertTagsPromises);
    return {
        deleteTagsCount: deleteTagsResult.count,
        addUsersRoles: updateTags.length,
        updateTags
    };
}