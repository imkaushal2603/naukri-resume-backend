import { OAuth2Client, TokenPayload } from "google-auth-library";
import { GOOGLE_CLIENT_ID } from "../config/environment.config";

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

export const verifyGoogleToken = async (
    idToken: string
): Promise<TokenPayload> => {
    const ticket = await client.verifyIdToken({
        idToken,
        audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
        throw new Error("Invalid Google token");
    }

    return payload;
};