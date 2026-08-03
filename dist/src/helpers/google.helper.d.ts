import { TokenPayload } from "google-auth-library";
export declare const verifyGoogleToken: (idToken: string) => Promise<TokenPayload>;
