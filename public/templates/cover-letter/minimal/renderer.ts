import { loadTemplate, replace } from "../../../../src/helpers/templates/template.helper";
import { escapeHtml, nl2br } from "../../../../src/helpers/templates/html.helper";

export const renderCoverLetterMinimal = (data: any): string => {
    let template = loadTemplate("minimal", "cover-letter");

    const today = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const contactLine = [
        escapeHtml(data.email),
        escapeHtml(data.phone),
        data.address ? escapeHtml(data.address) : null,
    ]
        .filter(Boolean)
        .join(" / ");

    const recipientBlock = data.hiringManager
        ? `${escapeHtml(data.hiringManager)}<br/>${escapeHtml(data.companyName)}`
        : escapeHtml(data.companyName);

    const greeting = data.hiringManager
        ? `Dear ${escapeHtml(data.hiringManager)},`
        : "Dear Hiring Manager,";

    const closingBody = `I would welcome the opportunity to discuss how my background and skills align with the ${escapeHtml(
        data.jobTitle
    )} role at ${escapeHtml(data.companyName)}. Thank you for your time and consideration.`;

    template = replace(template, "fullName", escapeHtml(data.fullName));
    template = replace(template, "contactLine", contactLine);
    template = replace(template, "today", today);
    template = replace(template, "recipientBlock", recipientBlock);
    template = replace(template, "greeting", greeting);
    template = replace(template, "summary", nl2br(data.summary));
    template = replace(template, "closingBody", closingBody);

    return template;
};