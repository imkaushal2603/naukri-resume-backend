import { escapeHtml, nl2br, normalizeUrl } from "../../../../src/helpers/templates/html.helper";
import { loadTemplate, replace } from "../../../../src/helpers/templates/template.helper";
import { SERVER_URL } from "../../../../src/config/environment.config";

const PHONE_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 30 30" fill="none"><path d="M23.4309 29.1643H23.9414C24.6268 29.1351 25.2539 28.7851 25.6476 28.231L28.7684 23.7247C29.1039 23.2435 29.2351 22.6455 29.1184 22.0622C29.0018 21.4789 28.6664 20.983 28.1851 20.6476L21.4184 16.1414C21.0608 15.9009 20.639 15.7739 20.208 15.7768C19.6101 15.7768 19.0268 16.0101 18.6039 16.4768L16.4601 18.7955C15.4539 18.1685 14.1122 17.2351 13.0184 16.1414C11.9684 15.0914 11.0205 13.7497 10.3643 12.6997L12.683 10.556C13.4705 9.82679 13.6164 8.63096 13.0184 7.74137L8.51219 0.974708C8.19136 0.493458 7.68094 0.143458 7.09761 0.0413744C6.81356 -0.0154537 6.52091 -0.0137242 6.23756 0.0464567C5.95421 0.106638 5.68612 0.224004 5.44969 0.391374L0.943441 3.51221C0.374691 3.90596 0.0392742 4.53304 0.0101076 5.21846C-0.0336424 6.22471 -0.223226 15.281 6.83511 22.3393C13.1789 28.683 21.1414 29.1789 23.4309 29.1789V29.1643ZM7.11219 11.7372C6.87886 11.956 6.80594 12.306 6.95177 12.5976C7.02469 12.7289 8.62886 15.8643 10.9476 18.1976C13.2809 20.531 16.4164 22.1351 16.5476 22.208C16.8393 22.3539 17.1893 22.2955 17.408 22.0476L20.3101 18.9122L25.9393 22.6601L23.4601 26.2476C21.7684 26.2476 14.5205 25.8976 8.89136 20.2685C3.26219 14.6393 2.91219 7.37679 2.91219 5.69971L6.49969 3.22054L10.2476 8.84971L7.11219 11.7518V11.7372Z" fill="black" /></svg>`;
const EMAIL_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 30 24" fill="none"><path d="M24.7917 0H4.375C3.21468 0 2.10188 0.460936 1.28141 1.28141C0.460936 2.10188 0 3.21468 0 4.375V18.9583C0 20.1187 0.460936 21.2315 1.28141 22.0519C2.10188 22.8724 3.21468 23.3333 4.375 23.3333H24.7917C25.952 23.3333 27.0648 22.8724 27.8853 22.0519C28.7057 21.2315 29.1667 20.1187 29.1667 18.9583V4.375C29.1667 3.21468 28.7057 2.10188 27.8853 1.28141C27.0648 0.460936 25.952 0 24.7917 0ZM23.8146 2.91667L14.5833 9.84375L5.35208 2.91667H23.8146ZM24.7917 20.4167H4.375C3.98823 20.4167 3.61729 20.263 3.3438 19.9895C3.07031 19.716 2.91667 19.3451 2.91667 18.9583V4.73958L13.7083 12.8333C13.9608 13.0227 14.2678 13.125 14.5833 13.125C14.8989 13.125 15.2059 13.0227 15.4583 12.8333L26.25 4.73958V18.9583C26.25 19.3451 26.0964 19.716 25.8229 19.9895C25.5494 20.263 25.1784 20.4167 24.7917 20.4167Z" fill="black" /></svg>`;
const LOCATION_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 26 32" fill="none"><path d="M12.666 17.0417C15.0823 17.0417 17.041 15.083 17.041 12.6667C17.041 10.2505 15.0823 8.29175 12.666 8.29175C10.2498 8.29175 8.29102 10.2505 8.29102 12.6667C8.29102 15.083 10.2498 17.0417 12.666 17.0417Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /><path d="M4.41709 4.41709C6.60501 2.22916 9.57247 1 12.6667 1C15.7609 1 18.7283 2.22916 20.9162 4.41709C23.1042 6.60501 24.3333 9.57247 24.3333 12.6667C24.3333 15.4258 23.7471 17.2313 22.1458 19.2292L12.6667 30.1667L3.1875 19.2292C1.58625 17.2313 1 15.4258 1 12.6667C1 9.57247 2.22916 6.60501 4.41709 4.41709Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>`;
const LINKEDIN_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 35 35" fill="none"><path d="M22.0937 12.25C20.976 12.2462 19.8685 12.4628 18.8346 12.8874C17.8006 13.312 16.8606 13.9364 16.0682 14.7247C15.2758 15.513 14.6466 16.4499 14.2167 17.4816C13.7867 18.5134 13.5644 19.6198 13.5625 20.7375V29.3125C13.5625 29.6606 13.7008 29.9944 13.9469 30.2406C14.1931 30.4867 14.5269 30.625 14.875 30.625H17.9375C18.2856 30.625 18.6194 30.4867 18.8656 30.2406C19.1117 29.9944 19.25 29.6606 19.25 29.3125V20.7375C19.2497 20.34 19.3332 19.9468 19.495 19.5837C19.6569 19.2206 19.8934 18.8957 20.1893 18.6301C20.4851 18.3646 20.8336 18.1643 21.212 18.0425C21.5904 17.9206 21.9902 17.8799 22.3854 17.9229C23.0942 18.0122 23.7455 18.3585 24.2159 18.8961C24.6863 19.4337 24.9431 20.1252 24.9375 20.8396V29.3125C24.9375 29.6606 25.0758 29.9944 25.3219 30.2406C25.5681 30.4867 25.9019 30.625 26.25 30.625H29.3125C29.6606 30.625 29.9944 30.4867 30.2406 30.2406C30.4867 29.9944 30.625 29.6606 30.625 29.3125V20.7375C30.6231 19.6198 30.4008 18.5134 29.9708 17.4816C29.5409 16.4499 28.9117 15.513 28.1193 14.7247C27.3269 13.9364 26.3869 13.312 25.3529 12.8874C24.319 12.4628 23.2115 12.2462 22.0937 12.25Z" fill="black" /><path d="M9.625 13.5625H5.6875C4.96263 13.5625 4.375 14.1501 4.375 14.875V29.3125C4.375 30.0374 4.96263 30.625 5.6875 30.625H9.625C10.3499 30.625 10.9375 30.0374 10.9375 29.3125V14.875C10.9375 14.1501 10.3499 13.5625 9.625 13.5625Z" fill="black" /><path d="M7.65625 10.9375C9.46843 10.9375 10.9375 9.46843 10.9375 7.65625C10.9375 5.84407 9.46843 4.375 7.65625 4.375C5.84407 4.375 4.375 5.84407 4.375 7.65625C4.375 9.46843 5.84407 10.9375 7.65625 10.9375Z" fill="black" /></svg>`;
const GITHUB_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 19 20" fill="none"><path d="M1 14.0074C2.5 14.5074 2.5 17.5074 6 17.0074L7 16.8074M13 19.0074V16.0074C13 15.1474 12.637 14.3714 12.057 13.8244C12.0554 13.8232 12.0541 13.8215 12.0535 13.8196C12.0528 13.8177 12.0528 13.8156 12.0533 13.8137C12.0538 13.8117 12.055 13.81 12.0565 13.8087C12.0581 13.8074 12.06 13.8066 12.062 13.8064C15.48 13.1244 18 10.7874 18 8.00839C18 6.74639 17.48 5.57539 16.594 4.60939C16.5928 4.60806 16.592 4.60643 16.5916 4.60467C16.5913 4.60291 16.5914 4.60109 16.592 4.59939C17.224 3.06239 16.64 1.07939 16.496 1.00839C16.357 0.938394 14.539 1.29639 13.046 2.45339C13.0448 2.45442 13.0433 2.45514 13.0417 2.45549C13.0402 2.45584 13.0386 2.45581 13.037 2.45539C12.0527 2.15519 11.029 2.00418 10 2.00739C8.924 2.00739 7.897 2.16739 6.96 2.45639C6.95845 2.45681 6.95682 2.45684 6.95526 2.45649C6.95369 2.45614 6.95223 2.45542 6.951 2.45439C5.458 1.29739 3.64 0.938394 3.5 1.00839C3.356 1.08039 2.772 3.06539 3.405 4.60139C3.40559 4.60309 3.40572 4.60491 3.40537 4.60667C3.40502 4.60843 3.4042 4.61006 3.403 4.61139C2.518 5.57739 2 6.74739 2 8.00939C2 10.7884 4.52 13.1254 7.938 13.8074C7.94002 13.8076 7.94193 13.8084 7.94348 13.8097C7.94503 13.811 7.94615 13.8127 7.94669 13.8147C7.94724 13.8166 7.94717 13.8187 7.94651 13.8206C7.94585 13.8225 7.94463 13.8242 7.943 13.8254C7.64546 14.1057 7.40833 14.4438 7.24617 14.819C7.08401 15.1942 7.00024 15.5986 7 16.0074V19.0074" stroke="black" stroke-width="2" stroke-linecap="round" /></svg>`;

function headerDetail(icon: string, content: string): string {
    return `<div class="header_details"><div class="header_svg">${icon}</div><div class="header_content">${content}</div></div>`;
}

const getYear = (dateVal: any): string => {
    if (!dateVal) return "";
    const date = new Date(dateVal);
    return isNaN(date.getTime()) ? "" : String(date.getUTCFullYear());
};

const getMonth = (dateVal: any): string => {
    if (!dateVal) return "";
    const date = new Date(dateVal);
    if (isNaN(date.getTime())) return "";
    return String(date.getUTCMonth() + 1).padStart(2, "0");
};

export const renderFrost = (resume: any): string => {
    let html = loadTemplate("frost", "resumes");

    // --- NAME + PHOTO ---
    const fullName = [resume.firstName, resume.lastName].filter(Boolean).join(" ");
    html = replace(html, "name", escapeHtml(fullName.toUpperCase()));
    const photoUrl = resume.photoUrl ? `${SERVER_URL}${resume.photoUrl}` : "";
    html = replace(html, "photoUrl", photoUrl);

    // --- TAGLINE ---
    const primaryExperience = (resume.candidate_experience || [])[0];
    const taglineText = primaryExperience?.jobTitle || primaryExperience?.role || "";
    html = replace(html, "tagline", taglineText ? `<p>${escapeHtml(taglineText)}</p>` : "");

    // --- CONTACT ---
    const contactParts: string[] = [];
    if (resume.phone) contactParts.push(headerDetail(PHONE_ICON, `<a href="tel:${escapeHtml(resume.phone)}">${escapeHtml(resume.phone)}</a>`));
    if (resume.email) contactParts.push(headerDetail(EMAIL_ICON, `<a href="mailto:${escapeHtml(resume.email)}">${escapeHtml(resume.email)}</a>`));
    const address = [resume.city, resume.state, resume.country].filter(Boolean).join(", ");
    if (address) contactParts.push(headerDetail(LOCATION_ICON, `<p>${escapeHtml(address)}</p>`));
    if (resume.linkedin) contactParts.push(headerDetail(LINKEDIN_ICON, `<a href="${escapeHtml(normalizeUrl(resume.linkedin))}" target="_blank">Linkedin</a>`));
    if (resume.github) contactParts.push(headerDetail(GITHUB_ICON, `<a href="${escapeHtml(normalizeUrl(resume.github))}" target="_blank">Github</a>`));
    html = replace(html, "contact", contactParts.join(""));

    // --- SUMMARY ---
    const summary = resume.resume_builder?.summary
        ? `<p>${nl2br(escapeHtml(resume.resume_builder.summary))}</p>`
        : "";
    html = replace(html, "summary", summary);

    // --- EDUCATION (degree – institute | location | years | CGPA) ---
    const educations = resume.candidate_education || [];
    const educationHtml = educations
        .map((edu: any) => {
            const institute = edu.instituteName || edu.school || "";
            const degree = edu.courseDegree || edu.degree || "";
            const level = edu.educationLevel || "";
            const isCurrent = edu.currentlyStudying ?? edu.isCurrent ?? false;

            const startMonth = edu.startMonth || getMonth(edu.startDate);
            const startYear = edu.startYear || getYear(edu.startDate);
            const endMonth = edu.endMonth || getMonth(edu.endDate);
            const endYear = edu.endYear || edu.passingYear || getYear(edu.endDate);

            const start = [startMonth, startYear].filter(Boolean).join("/");
            const end = isCurrent ? "Present" : [endMonth, endYear].filter(Boolean).join("/");

            let duration = "";
            if (isCurrent) {
                duration = start ? `${start} – Present` : "Present";
            } else if (start && end) {
                duration = start === end ? start : `${start} – ${end}`;
            } else {
                duration = start || end;
            }

            const location = edu.address || edu.city || "";
            const gradeVal = edu.grade || edu.gpa;

            const detailParts = [institute, location, duration];
            if (gradeVal) detailParts.push(`CGPA: ${gradeVal}`);
            const detailLine = detailParts.filter(Boolean).join(" | ");

            const degreeLabel = level ? `${degree} (${level})` : degree;

            return `
<div class="education_details">
    <h4>${escapeHtml(degreeLabel)}${detailLine ? ` – <span>${escapeHtml(detailLine)}</span>` : ""}</h4>
</div>`;
        })
        .join("");
    html = replace(html, "education", educationHtml);

    // --- SKILLS ---
    const skillsList = resume.candidate_skills || [];
    const skillsHtml = skillsList
        .map((skill: any) => `<div class="skills_details"><p>${escapeHtml(skill.skillName || skill.name || "")}</p></div>`)
        .join("");
    html = replace(html, "skills", skillsHtml);

    // --- EXPERIENCE (role / company | location / years / bullets) ---
    const experiences = resume.candidate_experience || [];
    const experienceHtml = experiences
        .map((exp: any) => {
            const company = exp.companyName || exp.company || "";
            const role = exp.jobTitle || exp.role || "";
            const location = exp.location || "";
            const isCurrent = exp.isCurrent ?? !exp.endYear;

            const startMonth = exp.startMonth ?? getMonth(exp.startDate);
            const startYear = exp.startYear ?? getYear(exp.startDate);
            const endMonth = exp.endMonth ?? getMonth(exp.endDate);
            const endYear = exp.endYear ?? getYear(exp.endDate);

            const start = [startMonth, startYear].filter(Boolean).join("/");
            const end = isCurrent ? "Present" : [endMonth, endYear].filter(Boolean).join("/");
            const duration = start ? `${start} – ${end}` : end;

            const companyLine = [company, location].filter(Boolean).join(" | ");

            const description = exp.description
                ? `<ul>${exp.description
                    .split(/\r?\n/)
                    .map((line: string) => line.trim().replace(/^[•\-*]\s*/, ""))
                    .filter(Boolean)
                    .map((line: string) => `<li>${escapeHtml(line)}</li>`)
                    .join("")}</ul>`
                : "";

            return `
<div class="experience_details">
    <h4>${escapeHtml(role)}</h4>
    ${companyLine ? `<h4>${escapeHtml(companyLine)}</h4>` : ""}
    ${duration ? `<p>${escapeHtml(duration)}</p>` : ""}
    ${description}
</div>`;
        })
        .join("");
    html = replace(html, "experience", experienceHtml);

    return html;
};