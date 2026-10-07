import { escapeHtml, nl2br, normalizeUrl } from "../../../../src/helpers/templates/html.helper";
import { loadTemplate, replace } from "../../../../src/helpers/templates/template.helper";
import { SERVER_URL } from "../../../../src/config/environment.config";

const PHONE_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 27 27" fill="none"><path d="M16.666 4.99967C17.108 4.99967 17.532 5.17527 17.8445 5.48783C18.1571 5.80039 18.3327 6.22431 18.3327 6.66634V19.9997C18.3327 20.4417 18.1571 20.8656 17.8445 21.1782C17.532 21.4907 17.108 21.6663 16.666 21.6663H9.99935C9.55732 21.6663 9.1334 21.4907 8.82084 21.1782C8.50828 20.8656 8.33268 20.4417 8.33268 19.9997V6.66634C8.33268 6.22431 8.50828 5.80039 8.82084 5.48783C9.1334 5.17527 9.55732 4.99967 9.99935 4.99967H16.666ZM9.99935 3.33301C9.11529 3.33301 8.26745 3.6842 7.64233 4.30932C7.0172 4.93444 6.66602 5.78229 6.66602 6.66634V19.9997C6.66602 20.8837 7.0172 21.7316 7.64233 22.3567C8.26745 22.9818 9.11529 23.333 9.99935 23.333H16.666C17.5501 23.333 18.3979 22.9818 19.023 22.3567C19.6482 21.7316 19.9993 20.8837 19.9993 19.9997V6.66634C19.9993 5.78229 19.6482 4.93444 19.023 4.30932C18.3979 3.6842 17.5501 3.33301 16.666 3.33301H9.99935Z" fill="#b0d434" /><path d="M13.3333 19.9996C13.7754 19.9996 14.1993 19.824 14.5118 19.5115C14.8244 19.1989 15 18.775 15 18.333C15 17.8909 14.8244 17.467 14.5118 17.1544C14.1993 16.8419 13.7754 16.6663 13.3333 16.6663C12.8913 16.6663 12.4674 16.8419 12.1548 17.1544C11.8423 17.467 11.6667 17.8909 11.6667 18.333C11.6667 18.775 11.8423 19.1989 12.1548 19.5115C12.4674 19.824 12.8913 19.9996 13.3333 19.9996ZM2.665 6.76295C2.76176 6.81415 2.84748 6.88391 2.91728 6.96824C2.98707 7.05258 3.03956 7.14984 3.07175 7.25446C3.10395 7.35909 3.11521 7.46904 3.1049 7.57802C3.09459 7.687 3.06291 7.79288 3.01167 7.88962C2.1275 9.56775 1.66584 11.4362 1.66667 13.333C1.66667 15.2996 2.15333 17.153 3.01167 18.7763C3.1151 18.9717 3.13669 19.2001 3.07168 19.4114C3.00666 19.6227 2.86038 19.7995 2.665 19.903C2.46963 20.0064 2.24116 20.028 2.02987 19.963C1.81858 19.898 1.64177 19.7517 1.53833 19.5563C0.527072 17.6378 -0.000967376 15.5016 1.33044e-06 13.333C1.33044e-06 11.088 0.556668 8.96795 1.53833 7.10962C1.58953 7.01286 1.65929 6.92714 1.74362 6.85734C1.82796 6.78755 1.92522 6.73506 2.02985 6.70287C2.13447 6.67067 2.24442 6.65941 2.3534 6.66972C2.46238 6.68003 2.56827 6.71171 2.665 6.76295ZM24.0017 6.76295C24.0984 6.71171 24.2043 6.68003 24.3133 6.66972C24.4222 6.65941 24.5322 6.67067 24.6368 6.70287C24.7415 6.73506 24.8387 6.78755 24.923 6.85734C25.0074 6.92714 25.0771 7.01286 25.1283 7.10962C26.1396 9.02809 26.6676 11.1643 26.6667 13.333C26.6676 15.5016 26.1396 17.6378 25.1283 19.5563C25.0249 19.7517 24.8481 19.898 24.6368 19.963C24.4255 20.028 24.197 20.0064 24.0017 19.903C23.8063 19.7995 23.66 19.6227 23.595 19.4114C23.53 19.2001 23.5516 18.9717 23.655 18.7763C24.5392 17.0982 25.0008 15.2298 25 13.333C25 11.3663 24.5133 9.51295 23.655 7.88962C23.6038 7.79288 23.5721 7.687 23.5618 7.57802C23.5515 7.46904 23.5627 7.35909 23.5949 7.25446C23.6271 7.14984 23.6796 7.05258 23.7494 6.96824C23.8192 6.88391 23.9049 6.81415 24.0017 6.76295ZM5.095 9.22295C5.19703 9.26274 5.29022 9.32224 5.36924 9.39806C5.44826 9.47389 5.51156 9.56454 5.55552 9.66484C5.59948 9.76515 5.62324 9.87313 5.62544 9.98262C5.62764 10.0921 5.60823 10.201 5.56833 10.303C5.19209 11.2688 4.99935 12.2964 5 13.333C5 14.403 5.2 15.4246 5.56667 16.363C5.61318 16.466 5.63825 16.5773 5.64036 16.6903C5.64246 16.8033 5.62157 16.9156 5.57893 17.0202C5.5363 17.1249 5.47282 17.2198 5.39236 17.2992C5.3119 17.3785 5.21614 17.4407 5.1109 17.4819C5.00565 17.5231 4.89313 17.5424 4.78018 17.5388C4.66722 17.5351 4.55619 17.5085 4.45384 17.4606C4.35148 17.4127 4.25994 17.3445 4.18479 17.26C4.10963 17.1756 4.05244 17.0768 4.01667 16.9696C3.56464 15.8105 3.3329 14.5771 3.33333 13.333C3.33333 12.0513 3.575 10.8246 4.01667 9.69629C4.09703 9.49063 4.25572 9.32527 4.45791 9.23652C4.66009 9.14777 4.88922 9.14289 5.095 9.22295ZM21.5717 9.22295C21.6737 9.18305 21.7825 9.16365 21.892 9.16585C22.0015 9.16805 22.1095 9.19181 22.2098 9.23577C22.3101 9.27973 22.4007 9.34303 22.4766 9.42205C22.5524 9.50107 22.6119 9.59425 22.6517 9.69629C23.0917 10.8246 23.3333 12.0513 23.3333 13.333C23.3333 14.6146 23.0917 15.8413 22.65 16.9696C22.5621 17.1643 22.4027 17.3179 22.2049 17.3985C22.007 17.4791 21.7857 17.4806 21.5868 17.4027C21.3878 17.3248 21.2264 17.1735 21.1358 16.98C21.0452 16.7865 21.0324 16.5656 21.1 16.363C21.4667 15.4246 21.6667 14.403 21.6667 13.333C21.6667 12.263 21.4667 11.2413 21.1 10.303C21.0193 10.0972 21.0237 9.86781 21.1122 9.66527C21.2006 9.46273 21.3659 9.30362 21.5717 9.22295Z" fill="#b0d434" /></svg>`;
const LOCATION_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M12.375 20.6252H13.75V19.2502C13.75 19.0679 13.8225 18.893 13.9514 18.7641C14.0803 18.6351 14.2552 18.5627 14.4375 18.5627H18.5625C18.7449 18.5627 18.9197 18.6351 19.0487 18.7641C19.1776 18.893 19.25 19.0679 19.25 19.2502V20.6252H20.625V19.2502C20.6245 18.7034 20.407 18.1791 20.0203 17.7924C19.6337 17.4057 19.1094 17.1883 18.5625 17.1877H14.4375C13.8907 17.1883 13.3664 17.4057 12.9797 17.7924C12.5931 18.1791 12.3756 18.7034 12.375 19.2502V20.6252ZM16.5 16.5002C15.9561 16.5002 15.4245 16.3389 14.9722 16.0368C14.52 15.7346 14.1675 15.3051 13.9594 14.8026C13.7512 14.3001 13.6968 13.7472 13.8029 13.2137C13.909 12.6803 14.1709 12.1903 14.5555 11.8057C14.9401 11.4211 15.4301 11.1592 15.9635 11.0531C16.497 10.9469 17.0499 11.0014 17.5524 11.2095C18.0549 11.4177 18.4844 11.7702 18.7866 12.2224C19.0888 12.6746 19.25 13.2063 19.25 13.7502C19.2493 14.4793 18.9593 15.1784 18.4438 15.694C17.9282 16.2095 17.2292 16.4995 16.5 16.5002ZM16.5 12.3752C16.2281 12.3752 15.9622 12.4559 15.7361 12.6069C15.51 12.758 15.3338 12.9728 15.2297 13.224C15.1256 13.4753 15.0984 13.7517 15.1515 14.0185C15.2045 14.2852 15.3355 14.5302 15.5278 14.7225C15.7201 14.9148 15.9651 15.0457 16.2318 15.0988C16.4985 15.1519 16.775 15.1246 17.0262 15.0206C17.2775 14.9165 17.4922 14.7402 17.6433 14.5141C17.7944 14.288 17.875 14.0222 17.875 13.7502C17.875 13.3855 17.7302 13.0358 17.4723 12.7779C17.2144 12.5201 16.8647 12.3752 16.5 12.3752ZM17.4227 6.91647L2.29766 1.41647C2.17473 1.37172 2.04157 1.36298 1.91384 1.39127C1.78611 1.41955 1.6691 1.4837 1.57655 1.57617C1.48401 1.66865 1.41977 1.78561 1.39138 1.91332C1.36299 2.04103 1.37163 2.17419 1.41629 2.29716L6.91629 17.4222C6.96378 17.5532 7.04997 17.6666 7.16341 17.7475C7.27686 17.8284 7.41221 17.873 7.55154 17.8752H7.56254C7.70003 17.8753 7.83438 17.8341 7.94824 17.757C8.06209 17.6799 8.15021 17.5705 8.20122 17.4428L10.8419 10.8414L17.4433 8.20141C17.573 8.14987 17.6839 8.0601 17.7613 7.944C17.8388 7.82791 17.8791 7.691 17.8768 7.55147C17.8746 7.41194 17.8299 7.2764 17.7488 7.16285C17.6677 7.0493 17.5539 6.96313 17.4227 6.91578V6.91647ZM10.0568 9.67334L9.78316 9.78334L9.67385 10.057L7.59279 15.26L3.21204 3.21222L15.2598 7.59297L10.0568 9.67334Z" fill="#b0d434" /></svg>`;
const EMAIL_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="16" viewBox="0 0 20 16" fill="none"><path d="M16.7348 0.498963L15.4548 1.49896L10.0048 5.54896L4.55483 1.45896L3.27483 0.458963C2.97329 0.209508 2.60518 0.0540028 2.21612 0.0117128C1.82706 -0.0305771 1.43414 0.0422066 1.08604 0.221047C0.737943 0.399887 0.449961 0.676924 0.257775 1.01784C0.0655881 1.35875 -0.0223571 1.74856 0.00483439 2.13896V13.729C0.00483439 14.0897 0.14812 14.4356 0.403169 14.6906C0.658219 14.9457 1.00414 15.089 1.36483 15.089H4.55483V7.36896L10.0048 11.459L15.4548 7.36896V15.089H18.6448C19.0055 15.089 19.3515 14.9457 19.6065 14.6906C19.8615 14.4356 20.0048 14.0897 20.0048 13.729V2.13896C20.0236 1.75192 19.9296 1.36777 19.7341 1.03319C19.5386 0.698604 19.2502 0.428009 18.9038 0.254293C18.5574 0.0805774 18.168 0.0112221 17.783 0.0546577C17.3979 0.0980934 17.0338 0.252449 16.7348 0.498963Z" fill="#b0d434" /></svg>`;
const LINKEDIN_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 6C5.10457 6 6 5.10457 6 4C6 2.89543 5.10457 2 4 2C2.89543 2 2 2.89543 2 4C2 5.10457 2.89543 6 4 6Z" fill="#b0d434" /><path d="M4 10V20" stroke="#b0d434" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" /><path d="M10 10V20" stroke="#b0d434" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" /><path d="M10 15C10 12.24 12.24 10 15 10C17.76 10 20 12.24 20 15V20" stroke="#b0d434" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" /></svg>`;
const GITHUB_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2C10.6868 2 9.38642 2.25866 8.17317 2.7612C6.95991 3.26375 5.85752 4.00035 4.92893 4.92893C3.05357 6.8043 2 9.34784 2 12C2 16.42 4.87 20.17 8.84 21.5C9.34 21.58 9.5 21.27 9.5 21V19.31C6.73 19.91 6.14 17.97 6.14 17.97C5.68 16.81 5.03 16.5 5.03 16.5C4.12 15.88 5.1 15.9 5.1 15.9C6.1 15.97 6.63 16.93 6.63 16.93C7.5 18.45 8.97 18 9.54 17.76C9.63 17.11 9.89 16.67 10.17 16.42C7.95 16.17 5.62 15.31 5.62 11.5C5.62 10.39 6 9.5 6.65 8.79C6.55 8.54 6.2 7.5 6.75 6.15C6.75 6.15 7.59 5.88 9.5 7.17C10.29 6.95 11.15 6.84 12 6.84C12.85 6.84 13.71 6.95 14.5 7.17C16.41 5.88 17.25 6.15 17.25 6.15C17.8 7.5 17.45 8.54 17.35 8.79C18 9.5 18.38 10.39 18.38 11.5C18.38 15.32 16.04 16.16 13.81 16.41C14.17 16.72 14.5 17.33 14.5 18.26V21C14.5 21.27 14.66 21.59 15.17 21.5C19.14 20.16 22 16.42 22 12C22 10.6868 21.7413 9.38642 21.2388 8.17317C20.7362 6.95991 19.9997 5.85752 19.0711 4.92893C18.1425 4.00035 17.0401 3.26375 15.8268 2.7612C14.6136 2.25866 13.3132 2 12 2Z" fill="#b0d434" /></svg>`;

function iconTxt(icon: string, content: string): string {
    return `<div class="icon-txt"><div class="icon">${icon}</div><div class="txt"><p>${content}</p></div></div>`;
}

const getYear = (dateVal: any): string => {
    if (!dateVal) return "";
    const date = new Date(dateVal);
    return isNaN(date.getTime()) ? "" : String(date.getUTCFullYear());
};

export const renderSunset = (resume: any): string => {
    let html = loadTemplate("sunset", "resumes");

    // --- NAME (last name in span) + PHOTO ---
    const fullName = [resume.firstName, resume.lastName].filter(Boolean).join(" ");
    html = replace(html, "name", escapeHtml(fullName));
    const photoUrl = resume.photoUrl ? `${SERVER_URL}${resume.photoUrl}` : "";
    html = replace(html, "photoUrl", photoUrl);

    // --- TAGLINE ---
    const primaryExperience = (resume.candidate_experience || [])[0];
    const taglineText = primaryExperience?.jobTitle || primaryExperience?.role || "";
    html = replace(html, "tagline", taglineText ? `<h6>${escapeHtml(taglineText)}</h6>` : "");

    // --- SUMMARY ---
    const summary = resume.resume_builder?.summary
        ? `<p>${nl2br(escapeHtml(resume.resume_builder.summary))}</p>`
        : "";
    html = replace(html, "summary", summary);

    // --- CONTACT ---
    const contactParts: string[] = [];
    if (resume.phone) contactParts.push(iconTxt(PHONE_ICON, `<a href="tel:${escapeHtml(resume.phone)}">${escapeHtml(resume.phone)}</a>`));
    const address = [resume.city, resume.state, resume.country].filter(Boolean).join(", ");
    if (address) contactParts.push(iconTxt(LOCATION_ICON, escapeHtml(address)));
    if (resume.email) contactParts.push(iconTxt(EMAIL_ICON, `<a href="mailto:${escapeHtml(resume.email)}">${escapeHtml(resume.email)}</a>`));
    if (resume.linkedin) contactParts.push(iconTxt(LINKEDIN_ICON, `<a href="${escapeHtml(normalizeUrl(resume.linkedin))}" target="_blank">LinkedIn</a>`));
    if (resume.github) contactParts.push(iconTxt(GITHUB_ICON, `<a href="${escapeHtml(normalizeUrl(resume.github))}" target="_blank">Github</a>`));
    html = replace(html, "contact", contactParts.join(""));

    // --- EXPERIENCE ---
    const experiences = resume.candidate_experience || [];
    const experienceHtml = experiences
        .map((exp: any) => {
            const company = exp.companyName || exp.company || "";
            const role = exp.jobTitle || exp.role || "";
            const location = exp.location || "";
            const isCurrent = exp.isCurrent ?? !exp.endYear;

            const startYear = exp.startYear ?? getYear(exp.startDate);
            const endYear = isCurrent ? "Present" : (exp.endYear ?? getYear(exp.endDate));
            const years = startYear ? `${startYear} – ${endYear}` : endYear;

            const metaLine = [company, years, location].filter(Boolean).join(" | ");

            const description = exp.description
                ? `<ul>${exp.description
                    .split(/\r?\n/)
                    .map((line: string) => line.trim().replace(/^[•\-*]\s*/, ""))
                    .filter(Boolean)
                    .map((line: string) => `<li>${escapeHtml(line)}</li>`)
                    .join("")}</ul>`
                : "";

            return `
<div class="details">
    <div class="title">
        <h5>${escapeHtml(role)}</h5>
    </div>
    ${metaLine ? `<h6>${escapeHtml(metaLine)}</h6>` : ""}
    ${description}
</div>`;
        })
        .join("");
    html = replace(html, "experience", experienceHtml);

    // --- EDUCATION ---
    const educations = resume.candidate_education || [];
    const educationHtml = educations
        .map((edu: any) => {
            const institute = edu.instituteName || edu.school || "";
            const degree = edu.courseDegree || edu.degree || "";
            const level = edu.educationLevel || "";
            const isCurrent = edu.currentlyStudying ?? edu.isCurrent ?? false;

            const startYear = edu.startYear || getYear(edu.startDate);
            const endYear = isCurrent ? "Present" : (edu.endYear || edu.passingYear || getYear(edu.endDate));
            const years = startYear && endYear
                ? (startYear === endYear ? startYear : `${startYear} – ${endYear}`)
                : (startYear || endYear);

            const gradeVal = edu.grade || edu.gpa;
            const degreeLabel = level ? `${degree} (${level})` : degree;

            const metaParts = [institute, years];
            if (gradeVal) metaParts.push(`CGPA: ${gradeVal}`);
            const metaLine = metaParts.filter(Boolean).join(" | ");

            return `
<div class="details">
    <div class="title">
        <h5>${escapeHtml(degreeLabel)}</h5>
    </div>
    ${metaLine ? `<h6>${escapeHtml(metaLine)}</h6>` : ""}
</div>`;
        })
        .join("");
    html = replace(html, "education", educationHtml);

    // --- SKILLS ---
    const skillsList = resume.candidate_skills || [];
    const skillsHtml = skillsList
        .map((skill: any) => `<h6>${escapeHtml(skill.skillName || skill.name || "")}</h6>`)
        .join("");
    html = replace(html, "skills", skillsHtml);

    return html;
};