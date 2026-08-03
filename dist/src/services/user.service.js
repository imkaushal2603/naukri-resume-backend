"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSessionByRefreshToken = exports.createSession = exports.createUser = exports.findUserByEmail = void 0;
const database_config_1 = require("../config/database.config");
const findUserByEmail = async (email) => {
    return await database_config_1.prisma.user.findUnique({
        where: { email },
    });
};
exports.findUserByEmail = findUserByEmail;
const createUser = async (data) => {
    return await database_config_1.prisma.user.create({
        data,
    });
};
exports.createUser = createUser;
const createSession = async (data) => {
    return await database_config_1.prisma.session.create({
        data,
    });
};
exports.createSession = createSession;
const deleteSessionByRefreshToken = async (refreshToken) => {
    return await database_config_1.prisma.session.deleteMany({
        where: {
            refreshToken,
        },
    });
};
exports.deleteSessionByRefreshToken = deleteSessionByRefreshToken;
//# sourceMappingURL=user.service.js.map