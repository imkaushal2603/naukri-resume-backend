import { loadTemplate, replace } from "../../../../src/helpers/templates/template.helper";
import { escapeHtml } from "../../../../src/helpers/templates/html.helper";

const LOCATION_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M11 9.86V16L12 18L13 16V9.86C14.72 9.41 16 7.86 16 6C16 3.79 14.21 2 12 2C9.79 2 8 3.79 8 6C8 7.86 9.28 9.41 11 9.86ZM12 4C13.1 4 14 4.9 14 6C14 7.1 13.1 8 12 8C10.9 8 10 7.1 10 6C10 4.9 10.9 4 12 4Z" fill="black" /><path d="M15 14.17V16.18C18.29 16.59 20 17.59 20 18C20 18.51 17.25 20 12 20C6.75 20 4 18.51 4 18C4 17.6 5.71 16.59 9 16.18V14.17C5.25 14.59 2 15.83 2 18C2 20.75 7.18 22 12 22C16.82 22 22 20.75 22 18C22 15.82 18.75 14.59 15 14.17Z" fill="black" /></svg>`;
const PHONE_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M16.57 22C16.8356 22.0016 17.0989 21.9502 17.3444 21.8489C17.5899 21.7476 17.8128 21.5984 18 21.41L20.71 18.7C20.8963 18.5127 21.0008 18.2592 21.0008 17.995C21.0008 17.7308 20.8963 17.4774 20.71 17.29L16.71 13.29C16.5227 13.1038 16.2692 12.9992 16.005 12.9992C15.7408 12.9992 15.4874 13.1038 15.3 13.29L13.7 14.88C12.5923 14.5847 11.5663 14.0409 10.7 13.29C9.95058 12.4227 9.40702 11.3971 9.11003 10.29L10.7 8.69002C10.8863 8.50266 10.9908 8.24921 10.9908 7.98502C10.9908 7.72083 10.8863 7.46738 10.7 7.28002L6.70003 3.28002C6.51267 3.09377 6.25922 2.98923 5.99503 2.98923C5.73085 2.98923 5.4774 3.09377 5.29003 3.28002L2.59003 6.00002C2.40167 6.18726 2.25248 6.41015 2.15118 6.65567C2.04988 6.90119 1.9985 7.16443 2.00003 7.43002C2.09076 11.2723 3.62611 14.9393 6.30003 17.7C9.06075 20.3739 12.7277 21.9093 16.57 22ZM6.00003 5.41002L8.59003 8.00002L7.30003 9.29002C7.17785 9.40447 7.08636 9.54776 7.03395 9.70675C6.98153 9.86574 6.96987 10.0353 7.00003 10.2C7.37297 11.8707 8.16442 13.4192 9.30003 14.7C10.5809 15.8356 12.1294 16.6271 13.8 17C13.9622 17.0339 14.1303 17.027 14.2891 16.9799C14.4479 16.9327 14.5926 16.8469 14.71 16.73L16 15.41L18.59 18L16.59 20C13.2738 19.9146 10.1095 18.5912 7.72003 16.29C5.41295 13.8995 4.08564 10.7311 4.00003 7.41002L6.00003 5.41002ZM20 11H22C22.026 9.81102 21.8109 8.62908 21.3678 7.52543C20.9247 6.42177 20.2627 5.41926 19.4217 4.57831C18.5808 3.73736 17.5783 3.07538 16.4746 2.63227C15.371 2.18916 14.189 1.97409 13 2.00002V4.00002C13.9279 3.96792 14.8525 4.12703 15.7163 4.46745C16.5801 4.80788 17.3647 5.32234 18.0212 5.97886C18.6777 6.63538 19.1922 7.41992 19.5326 8.28372C19.873 9.14752 20.0321 10.0721 20 11Z" fill="black" /><path d="M13 8C15.1 8 16 8.9 16 11H18C18 7.78 16.22 6 13 6V8Z" fill="black" /></svg>`;
const EMAIL_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="16" viewBox="0 0 20 16" fill="none"><path d="M16.7348 0.498963L15.4548 1.49896L10.0048 5.54896L4.55483 1.45896L3.27483 0.458963C2.97329 0.209508 2.60518 0.0540028 2.21612 0.0117128C1.82706 -0.0305771 1.43414 0.0422066 1.08604 0.221047C0.737943 0.399887 0.449961 0.676924 0.257775 1.01784C0.0655881 1.35875 -0.0223571 1.74856 0.00483439 2.13896V13.729C0.00483439 14.0897 0.14812 14.4356 0.403169 14.6906C0.658219 14.9457 1.00414 15.089 1.36483 15.089H4.55483V7.36896L10.0048 11.459L15.4548 7.36896V15.089H18.6448C19.0055 15.089 19.3515 14.9457 19.6065 14.6906C19.8615 14.4356 20.0048 14.0897 20.0048 13.729V2.13896C20.0236 1.75192 19.9296 1.36777 19.7341 1.03319C19.5386 0.698604 19.2502 0.428009 18.9038 0.254293C18.5574 0.0805774 18.168 0.0112221 17.783 0.0546577C17.3979 0.0980934 17.0338 0.252449 16.7348 0.498963Z" fill="black" /></svg>`;

const detail = (icon: string, content: string): string =>
    `<div class="header_details">${icon}${content}</div>`;

const toParagraphs = (text?: string): string =>
    (text || "")
        .split(/\r?\n+/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => `<p>${escapeHtml(line)}</p>`)
        .join("");

export const renderCoverLetterQuill = (data: any): string => {
    let template = loadTemplate("quill", "cover-letter");

    template = replace(template, "fullName", escapeHtml(data.fullName || ""));
    template = replace(
        template,
        "tagline",
        data.jobTitle ? `<h4>${escapeHtml(data.jobTitle)}</h4>` : ""
    );

    const contactParts: string[] = [];
    if (data.address) contactParts.push(detail(LOCATION_ICON, `<p>${escapeHtml(data.address)}</p>`));
    if (data.phone) contactParts.push(detail(PHONE_ICON, `<a href="tel:${escapeHtml(data.phone)}">${escapeHtml(data.phone)}</a>`));
    if (data.email) contactParts.push(detail(EMAIL_ICON, `<a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a>`));
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