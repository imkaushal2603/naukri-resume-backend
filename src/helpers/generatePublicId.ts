import { customAlphabet } from "nanoid";

export const generatePublicId = customAlphabet("0123456789", 12);