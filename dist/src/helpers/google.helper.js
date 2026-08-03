"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyGoogleToken = void 0;
const google_auth_library_1 = require("google-auth-library");
const environment_config_1 = require("../config/environment.config");
const client = new google_auth_library_1.OAuth2Client(environment_config_1.GOOGLE_CLIENT_ID);
const verifyGoogleToken = async (idToken) => {
    const ticket = await client.verifyIdToken({
        idToken,
        audience: environment_config_1.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload) {
        throw new Error("Invalid Google token");
    }
    return payload;
};
exports.verifyGoogleToken = verifyGoogleToken;
//# sourceMappingURL=google.helper.js.map