export const escapeHtml = (str: string): string => {
    if (!str) return "";
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
};

export const nl2br = (str: string): string => {
    if (!str) return "";
    return escapeHtml(str).replace(/\n/g, "<br/>");
};