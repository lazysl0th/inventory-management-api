import { searchUsers } from "../../models/user.js";

const userResolvers = {
    Query: {
        searchUsers: async (_parent, { searchQuery, by }, { prisma }) => await searchUsers(searchQuery, by, prisma),
    },
};

export default userResolvers;