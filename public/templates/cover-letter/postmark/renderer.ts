import { loadTemplate, replace } from "../../../../src/helpers/templates/template.helper";
import { escapeHtml } from "../../../../src/helpers/templates/html.helper";

const detail = (content: string): string =>
    `<div class="header_details">${content}</div>`;

const toParagraphs = (text?: string): string =>
    (text || "")
        .split(/\r?\n+/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => `<p>${escapeHtml(line)}</p>`)
        .join("");

export const renderCoverLetterPostmark = (data: any): string => {
    let template = loadTemplate("postmark", "cover-letter");

    const fullName = (data.fullName || "").trim();
    const parts = fullName.split(/\s+/).filter(Boolean);
    const first = parts.shift() || "";
    const rest = parts.join(" ");
    const nameHtml = rest
        ? `${escapeHtml(first)}<br>${escapeHtml(rest)}`
        : escapeHtml(first);
    template = replace(template, "fullName", nameHtml);

    template = replace(
        template,
        "tagline",
        data.jobTitle ? `<h4>${escapeHtml(data.jobTitle)}</h4>` : ""
    );

    const contactParts: string[] = [];
    if (data.address) contactParts.push(detail(`<p>${escapeHtml(data.address)}</p>`));
    if (data.phone) contactParts.push(detail(`<a href="tel:${escapeHtml(data.phone)}">${escapeHtml(data.phone)}</a>`));
    if (data.email) contactParts.push(detail(`<a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a>`));
    template = replace(template, "contact", contactParts.join(""));

    const greeting = data.hiringManager
        ? `Dear ${escapeHtml(data.hiringManager)},`
        : "Dear Sir/Madam,";
    template = replace(template, "greeting", greeting);

    template = replace(template, "summary", toParagraphs(data.summary));

    template = replace(
        template,
        "signoff",
        data.fullName ? `<h5>${escapeHtml(data.fullName)}</h5>` : ""
    );

    return template;
};