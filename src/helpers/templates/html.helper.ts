export const escapeHtml = (str: unknown): string => {
    if (str === null || str === undefined) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
};

export const nl2br = (str: unknown): string => {
    if (str === null || str === undefined) return "";
    return escapeHtml(str).replace(/\n/g, "<br/>");
};