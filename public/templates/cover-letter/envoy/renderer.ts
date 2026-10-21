import { loadTemplate, replace } from "../../../../src/helpers/templates/template.helper";
import { escapeHtml } from "../../../../src/helpers/templates/html.helper";
import { SERVER_URL } from "../../../../src/config/environment.config";

const EMAIL_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="16" viewBox="0 0 20 16" fill="none"><path d="M16.7348 0.498963L15.4548 1.49896L10.0048 5.54896L4.55483 1.45896L3.27483 0.458963C2.97329 0.209508 2.60518 0.0540028 2.21612 0.0117128C1.82706 -0.0305771 1.43414 0.0422066 1.08604 0.221047C0.737943 0.399887 0.449961 0.676924 0.257775 1.01784C0.0655881 1.35875 -0.0223571 1.74856 0.00483439 2.13896V13.729C0.00483439 14.0897 0.14812 14.4356 0.403169 14.6906C0.658219 14.9457 1.00414 15.089 1.36483 15.089H4.55483V7.36896L10.0048 11.459L15.4548 7.36896V15.089H18.6448C19.0055 15.089 19.3515 14.9457 19.6065 14.6906C19.8615 14.4356 20.0048 14.0897 20.0048 13.729V2.13896C20.0236 1.75192 19.9296 1.36777 19.7341 1.03319C19.5386 0.698604 19.2502 0.428009 18.9038 0.254293C18.5574 0.0805774 18.168 0.0112221 17.783 0.0546577C17.3979 0.0980934 17.0338 0.252449 16.7348 0.498963Z" fill="black" /></svg>`;
const PHONE_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M19 2H5C4.45 2 4 2.45 4 3V7H2V9H4V11H2V13H4V15H2V17H4V21C4 21.55 4.45 22 5 22H19C20.1 22 21 21.1 21 20V4C21 2.9 20.1 2 19 2ZM19 20H6V4H19V20Z" fill="black" /><path d="M12.5 7C11.837 7 11.2011 7.26339 10.7322 7.73223C10.2634 8.20107 10 8.83696 10 9.5C10 10.163 10.2634 10.7989 10.7322 11.2678C11.2011 11.7366 11.837 12 12.5 12C13.163 12 13.7989 11.7366 14.2678 11.2678C14.7366 10.7989 15 10.163 15 9.5C15 8.83696 14.7366 8.20107 14.2678 7.73223C13.7989 7.26339 13.163 7 12.5 7ZM17 16C17 14.34 15.66 13 14 13H11C9.34 13 8 14.34 8 16V17H17V16Z" fill="black" /></svg>`;
const LOCATION_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M11 9.86V16L12 18L13 16V9.86C14.72 9.41 16 7.86 16 6C16 3.79 14.21 2 12 2C9.79 2 8 3.79 8 6C8 7.86 9.28 9.41 11 9.86Z" fill="black" /><path d="M15 14.17V16.18C18.29 16.59 20 17.59 20 18C20 18.51 17.25 20 12 20C6.75 20 4 18.51 4 18C4 17.6 5.71 16.59 9 16.18V14.17C5.25 14.59 2 15.83 2 18C2 20.75 7.18 22 12 22C16.82 22 22 20.75 22 18C22 15.82 18.75 14.59 15 14.17Z" fill="black" /></svg>`;

const detail = (icon: string, content: string): string =>
    `<div class="header_details">${icon}${content}</div>`;

const toParagraphs = (text?: string): string =>
    (text || "")
        .split(/\r?\n+/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => `<p>${escapeHtml(line)}</p>`)
        .join("");

export const renderCoverLetterEnvoy = (data: any): string => {
    let template = loadTemplate("envoy", "cover-letter");

    const photoHtml = data.photoUrl
        ? `<div class="header_left"><img src="${escapeHtml(`${SERVER_URL}${data.photoUrl}`)}" alt="" /></div>`
        : "";
    template = replace(template, "photo", photoHtml);

    template = replace(template, "fullName", escapeHtml((data.fullName || "").toUpperCase()));
    template = replace(
        template,
        "tagline",
        data.jobTitle ? `<h4>${escapeHtml(data.jobTitle)}</h4>` : ""
    );

    const contactParts: string[] = [];
    if (data.email) contactParts.push(detail(EMAIL_ICON, `<a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a>`));
    if (data.phone) contactParts.push(detail(PHONE_ICON, `<a href="tel:${escapeHtml(data.phone)}">${escapeHtml(data.phone)}</a>`));
    if (data.address) contactParts.push(detail(LOCATION_ICON, `<p>${escapeHtml(data.address)}</p>`));
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