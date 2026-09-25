import { escapeHtml, nl2br } from "../../../../src/helpers/templates/html.helper";
import { loadTemplate, replace } from "../../../../src/helpers/templates/template.helper";
import { SERVER_URL } from "../../../../src/config/environment.config";

const PHONE_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 30 30" fill="none"><path d="M23.4309 29.1643H23.9414C24.6268 29.1351 25.2539 28.7851 25.6476 28.231L28.7684 23.7247C29.1039 23.2435 29.2351 22.6455 29.1184 22.0622C29.0018 21.4789 28.6664 20.983 28.1851 20.6476L21.4184 16.1414C21.0608 15.9009 20.639 15.7739 20.208 15.7768C19.6101 15.7768 19.0268 16.0101 18.6039 16.4768L16.4601 18.7955C15.4539 18.1685 14.1122 17.2351 13.0184 16.1414C11.9684 15.0914 11.0205 13.7497 10.3643 12.6997L12.683 10.556C13.4705 9.82679 13.6164 8.63096 13.0184 7.74137L8.51219 0.974708C8.19136 0.493458 7.68094 0.143458 7.09761 0.0413744C6.81356 -0.0154537 6.52091 -0.0137242 6.23756 0.0464567C5.95421 0.106638 5.68612 0.224004 5.44969 0.391374L0.943441 3.51221C0.374691 3.90596 0.0392742 4.53304 0.0101076 5.21846C-0.0336424 6.22471 -0.223226 15.281 6.83511 22.3393C13.1789 28.683 21.1414 29.1789 23.4309 29.1789V29.1643ZM7.11219 11.7372C6.87886 11.956 6.80594 12.306 6.95177 12.5976C7.02469 12.7289 8.62886 15.8643 10.9476 18.1976C13.2809 20.531 16.4164 22.1351 16.5476 22.208C16.8393 22.3539 17.1893 22.2955 17.408 22.0476L20.3101 18.9122L25.9393 22.6601L23.4601 26.2476C21.7684 26.2476 14.5205 25.8976 8.89136 20.2685C3.26219 14.6393 2.91219 7.37679 2.91219 5.69971L6.49969 3.22054L10.2476 8.84971L7.11219 11.7518V11.7372Z" fill="black" /></svg>`;
const EMAIL_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 30 24" fill="none"><path d="M24.7917 0H4.375C3.21468 0 2.10188 0.460936 1.28141 1.28141C0.460936 2.10188 0 3.21468 0 4.375V18.9583C0 20.1187 0.460936 21.2315 1.28141 22.0519C2.10188 22.8724 3.21468 23.3333 4.375 23.3333H24.7917C25.952 23.3333 27.0648 22.8724 27.8853 22.0519C28.7057 21.2315 29.1667 20.1187 29.1667 18.9583V4.375C29.1667 3.21468 28.7057 2.10188 27.8853 1.28141C27.0648 0.460936 25.952 0 24.7917 0ZM23.8146 2.91667L14.5833 9.84375L5.35208 2.91667H23.8146ZM24.7917 20.4167H4.375C3.98823 20.4167 3.61729 20.263 3.3438 19.9895C3.07031 19.716 2.91667 19.3451 2.91667 18.9583V4.73958L13.7083 12.8333C13.9608 13.0227 14.2678 13.125 14.5833 13.125C14.8989 13.125 15.2059 13.0227 15.4583 12.8333L26.25 4.73958V18.9583C26.25 19.3451 26.0964 19.716 25.8229 19.9895C25.5494 20.263 25.1784 20.4167 24.7917 20.4167Z" fill="black" /></svg>`;
const LOCATION_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 26 32" fill="none"><path d="M12.666 17.0417C15.0823 17.0417 17.041 15.083 17.041 12.6667C17.041 10.2505 15.0823 8.29175 12.666 8.29175C10.2498 8.29175 8.29102 10.2505 8.29102 12.6667C8.29102 15.083 10.2498 17.0417 12.666 17.0417Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /><path d="M4.41709 4.41709C6.60501 2.22916 9.57247 1 12.6667 1C15.7609 1 18.7283 2.22916 20.9162 4.41709C23.1042 6.60501 24.3333 9.57247 24.3333 12.6667C24.3333 15.4258 23.7471 17.2313 22.1458 19.2292L12.6667 30.1667L3.1875 19.2292C1.58625 17.2313 1 15.4258 1 12.6667C1 9.57247 2.22916 6.60501 4.41709 4.41709Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>`;
const LINKEDIN_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 35 35" fill="none"><path d="M22.0937 12.2501C20.976 12.2462 19.8685 12.4628 18.8346 12.8875C17.8006 13.3121 16.8606 13.9364 16.0682 14.7248C15.2758 15.5131 14.6466 16.4499 14.2167 17.4817C13.7867 18.5134 13.5644 19.6198 13.5625 20.7376V29.3126C13.5625 29.6606 13.7008 29.9945 13.9469 30.2406C14.1931 30.4868 14.5269 30.6251 14.875 30.6251H17.9375C18.2856 30.6251 18.6194 30.4868 18.8656 30.2406C19.1117 29.9945 19.25 29.6606 19.25 29.3126V20.7376C19.2497 20.34 19.3332 19.9469 19.495 19.5838C19.6569 19.2207 19.8934 18.8957 20.1893 18.6302C20.4851 18.3646 20.8336 18.1644 21.212 18.0425C21.5904 17.9207 21.9902 17.8799 22.3854 17.923C23.0942 18.0122 23.7455 18.3585 24.2159 18.8961C24.6863 19.4337 24.9431 20.1253 24.9375 20.8396V29.3126C24.9375 29.6606 25.0758 29.9945 25.3219 30.2406C25.5681 30.4868 25.9019 30.6251 26.25 30.6251H29.3125C29.6606 30.6251 29.9944 30.4868 30.2406 30.2406C30.4867 29.9945 30.625 29.6606 30.625 29.3126V20.7376C30.6231 19.6198 30.4008 18.5134 29.9708 17.4817C29.5409 16.4499 28.9117 15.5131 28.1193 14.7248C27.3269 13.9364 26.3869 13.3121 25.3529 12.8875C24.319 12.4628 23.2115 12.2462 22.0937 12.2501Z" fill="black" /><path d="M9.625 13.5625H5.6875C4.96263 13.5625 4.375 14.1501 4.375 14.875V29.3125C4.375 30.0374 4.96263 30.625 5.6875 30.625H9.625C10.3499 30.625 10.9375 30.0374 10.9375 29.3125V14.875C10.9375 14.1501 10.3499 13.5625 9.625 13.5625Z" fill="black" /><path d="M7.65625 10.9375C9.46843 10.9375 10.9375 9.46843 10.9375 7.65625C10.9375 5.84407 9.46843 4.375 7.65625 4.375C5.84407 4.375 4.375 5.84407 4.375 7.65625C4.375 9.46843 5.84407 10.9375 7.65625 10.9375Z" fill="black" /></svg>`;
const GITHUB_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 0C8.68678 0 7.38642 0.258658 6.17317 0.761205C4.95991 1.26375 3.85752 2.00035 2.92893 2.92893C1.05357 4.8043 0 7.34784 0 10C0 14.42 2.87 18.17 6.84 19.5C7.34 19.58 7.5 19.27 7.5 19V17.31C4.73 17.91 4.14 15.97 4.14 15.97C3.68 14.81 3.03 14.5 3.03 14.5C2.12 13.88 3.1 13.9 3.1 13.9C4.1 13.97 4.63 14.93 4.63 14.93C5.5 16.45 6.97 16 7.54 15.76C7.63 15.11 7.89 14.67 8.17 14.42C5.95 14.17 3.62 13.31 3.62 9.5C3.62 8.39 4 7.5 4.65 6.79C4.55 6.54 4.2 5.5 4.75 4.15C4.75 4.15 5.59 3.88 7.5 5.17C8.29 4.95 9.15 4.84 10 4.84C10.85 4.84 11.71 4.95 12.5 5.17C14.41 3.88 15.25 4.15 15.25 4.15C15.8 5.5 15.45 6.54 15.35 6.79C16 7.5 16.38 8.39 16.38 9.5C16.38 13.32 14.04 14.16 11.81 14.41C12.17 14.72 12.5 15.33 12.5 16.26V19C12.5 19.27 12.66 19.59 13.17 19.5C17.14 18.16 20 14.42 20 10C20 8.68678 19.7413 7.38642 19.2388 6.17317C18.7362 4.95991 17.9997 3.85752 17.0711 2.92893C16.1425 2.00035 15.0401 1.26375 13.8268 0.761205C12.6136 0.258658 11.3132 0 10 0Z" fill="black" /></svg>`;

function contactRow(icon: string, content: string): string {
    return `<div class="phone">${icon}<p>${content}</p></div>`;
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

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const monthNumToName = (m: string): string => {
    const idx = parseInt(m, 10);
    return idx >= 1 && idx <= 12 ? MONTH_NAMES[idx - 1] : "";
};

export const renderFlare = (resume: any): string => {
    let html = loadTemplate("flare", "resumes");

    // --- NAME + PHOTO ---
    const fullName = [resume.firstName, resume.lastName].filter(Boolean).join(" ");
    html = replace(html, "name", escapeHtml(fullName));
    const photoUrl = resume.photoUrl ? `${SERVER_URL}${resume.photoUrl}` : "";
    html = replace(html, "photoUrl", photoUrl);

    // --- TAGLINE ---
    const primaryExperience = (resume.candidate_experience || [])[0];
    const taglineText = primaryExperience?.jobTitle || primaryExperience?.role || "";
    html = replace(html, "tagline", taglineText ? `<p>${escapeHtml(taglineText.toUpperCase())}</p>` : "");

    // --- SUMMARY ---
    const summary = resume.resume_builder?.summary
        ? `<p>${nl2br(escapeHtml(resume.resume_builder.summary))}</p>`
        : "";
    html = replace(html, "summary", summary);

    // --- EDUCATION (degree/level bold, field, year, institute, location, CGPA) ---
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

            const startLabel = [monthNumToName(startMonth), startYear].filter(Boolean).join(" ");
            const endLabel = isCurrent ? "Present" : [monthNumToName(endMonth), endYear].filter(Boolean).join(" ");
            const duration = startLabel ? `${startLabel} – ${endLabel}` : endLabel;

            const location = edu.address || edu.city || "";
            const gradeVal = edu.grade || edu.gpa;

            const boldLabel = level ? `${level} –` : "";
            const restParts = [duration, institute];
            if (location) restParts.push(location);
            if (gradeVal) restParts.push(`CGPA: ${gradeVal}`);
            const restLine = restParts.filter(Boolean).join(" | ");

            return `<p>${boldLabel ? `<strong>${escapeHtml(boldLabel)}</strong> ` : ""}${escapeHtml(degree)} | ${escapeHtml(restLine)}</p>`;
        })
        .join("");
    html = replace(html, "education", educationHtml);

    // --- SKILLS ---
    const skillsList = resume.candidate_skills || [];
    const skillsHtml = skillsList
        .map((skill: any) => `<p>${escapeHtml(skill.skillName || skill.name || "")}</p>`)
        .join("");
    html = replace(html, "skills", skillsHtml);

    // --- EXPERIENCE ---
    const experiences = resume.candidate_experience || [];
    const experienceHtml = experiences
        .map((exp: any) => {
            const company = exp.companyName || exp.company || "";
            const role = exp.jobTitle || exp.role || "";
            const isCurrent = exp.isCurrent ?? !exp.endYear;

            const startYear = exp.startYear ?? getYear(exp.startDate);
            const endYear = isCurrent ? "Present" : (exp.endYear ?? getYear(exp.endDate));
            const duration = [startYear, endYear].filter(Boolean).join("–");

            const location = exp.location || "";

            const titleLine = [role, company, duration, location].filter(Boolean).join(" | ");
            const description = exp.description
                ? `<p>${nl2br(escapeHtml(exp.description))}</p>`
                : "";

            return `
<div class="details">
    <h6>${escapeHtml(titleLine)}</h6>
    ${description}
</div>`;
        })
        .join("");
    html = replace(html, "experience", experienceHtml);

    // --- CONTACT ---
    const contactParts: string[] = [];
    if (resume.phone) contactParts.push(contactRow(PHONE_ICON, `<a href="tel:${escapeHtml(resume.phone)}">${escapeHtml(resume.phone)}</a>`));
    if (resume.email) contactParts.push(contactRow(EMAIL_ICON, `<a href="mailto:${escapeHtml(resume.email)}">${escapeHtml(resume.email)}</a>`));
    const address = [resume.city, resume.state, resume.country].filter(Boolean).join(", ");
    if (address) contactParts.push(contactRow(LOCATION_ICON, escapeHtml(address)));
    if (resume.linkedin) contactParts.push(contactRow(LINKEDIN_ICON, `<a href="${escapeHtml(resume.linkedin)}" target="_blank">${escapeHtml(resume.linkedin)}</a>`));
    if (resume.github) contactParts.push(contactRow(GITHUB_ICON, `<a href="${escapeHtml(resume.github)}" target="_blank">${escapeHtml(resume.github)}</a>`));
    html = replace(html, "contact", contactParts.join(""));

    return html;
};