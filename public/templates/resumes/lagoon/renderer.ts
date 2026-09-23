import { escapeHtml, nl2br } from "../../../../src/helpers/templates/html.helper";
import { loadTemplate, replace } from "../../../../src/helpers/templates/template.helper";
import { SERVER_URL } from "../../../../src/config/environment.config";

const LOCATION_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 26" fill="none"><path d="M2.91667 22.6042H7.29167V15.3125C7.29167 14.8993 7.43167 14.5532 7.71167 14.2742C7.99167 13.9951 8.33778 13.8551 8.75 13.8542H14.5833C14.9965 13.8542 15.3431 13.9942 15.6231 14.2742C15.9031 14.5542 16.0426 14.9003 16.0417 15.3125V22.6042H20.4167V9.47917L11.6667 2.91667L2.91667 9.47917V22.6042ZM0 22.6042V9.47917C0 9.01736 0.103541 8.57986 0.310625 8.16667C0.517708 7.75347 0.803056 7.41319 1.16667 7.14583L9.91667 0.583333C10.4271 0.194445 11.0104 0 11.6667 0C12.3229 0 12.9062 0.194445 13.4167 0.583333L22.1667 7.14583C22.5312 7.41319 22.8171 7.75347 23.0242 8.16667C23.2312 8.57986 23.3343 9.01736 23.3333 9.47917V22.6042C23.3333 23.4063 23.0475 24.0931 22.4758 24.6648C21.9042 25.2365 21.2178 25.5218 20.4167 25.5208H14.5833C14.1701 25.5208 13.824 25.3808 13.545 25.1008C13.266 24.8208 13.126 24.4747 13.125 24.0625V16.7708H10.2083V24.0625C10.2083 24.4757 10.0683 24.8223 9.78833 25.1023C9.50833 25.3823 9.16222 25.5218 8.75 25.5208H2.91667C2.11458 25.5208 1.42819 25.2355 0.8575 24.6648C0.286805 24.0941 0.000972222 23.4072 0 22.6042Z" fill="white" /></svg>`;
const EMAIL_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 30 24" fill="none"><path d="M2.91667 23.3333C2.11458 23.3333 1.42819 23.048 0.8575 22.4773C0.286806 21.9066 0.000972222 21.2197 0 20.4167V2.91667C0 2.11458 0.285833 1.42819 0.8575 0.8575C1.42917 0.286805 2.11556 0.000972222 2.91667 0H26.25C27.0521 0 27.739 0.285833 28.3106 0.8575C28.8823 1.42917 29.1676 2.11556 29.1667 2.91667V20.4167C29.1667 21.2188 28.8813 21.9056 28.3106 22.4773C27.7399 23.049 27.0531 23.3343 26.25 23.3333H2.91667ZM26.25 5.83333L15.349 12.651C15.2274 12.724 15.1001 12.7789 14.9669 12.8158C14.8337 12.8528 14.7058 12.8708 14.5833 12.8698C14.4608 12.8688 14.3335 12.8508 14.2013 12.8158C14.069 12.7808 13.9412 12.7259 13.8177 12.651L2.91667 5.83333V20.4167H26.25V5.83333ZM14.5833 10.2083L26.25 2.91667H2.91667L14.5833 10.2083ZM2.91667 6.19792V4.04688V4.08333V4.06583V6.19792Z" fill="white" /></svg>`;
const PHONE_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 29 29" fill="none"><path d="M8.15669 20.323C5.02041 17.1807 2.60849 13.3911 1.08961 9.21929C0.253987 6.93845 1.01961 4.43304 2.73753 2.71512L3.80065 1.65345C4.08647 1.36706 4.42596 1.13985 4.79969 0.984824C5.17342 0.829797 5.57406 0.75 5.97867 0.75C6.38328 0.75 6.78392 0.829797 7.15766 0.984824C7.53139 1.13985 7.87088 1.36706 8.15669 1.65345L10.6461 4.14283C10.9325 4.42864 11.1597 4.76813 11.3147 5.14187C11.4697 5.5156 11.5495 5.91624 11.5495 6.32085C11.5495 6.72546 11.4697 7.1261 11.3147 7.49983C11.1597 7.87357 10.9325 8.21306 10.6461 8.49887L10.0336 9.11137C9.7884 9.35649 9.59392 9.6475 9.46123 9.96778C9.32855 10.2881 9.26025 10.6314 9.26025 10.978C9.26025 11.3247 9.32855 11.668 9.46123 11.9883C9.59392 12.3086 9.7884 12.5996 10.0336 12.8447L15.6336 18.4462C15.8787 18.6913 16.1697 18.8858 16.49 19.0185C16.8103 19.1512 17.1536 19.2195 17.5002 19.2195C17.8469 19.2195 18.1902 19.1512 18.5105 19.0185C18.8308 18.8858 19.1218 18.6913 19.3669 18.4462L19.9809 17.8337C20.2667 17.5473 20.6062 17.3201 20.9799 17.165C21.3536 17.01 21.7543 16.9302 22.1589 16.9302C22.5635 16.9302 22.9641 17.01 23.3379 17.165C23.7116 17.3201 24.0511 17.5473 24.3369 17.8337L26.8263 20.323C27.1127 20.6089 27.3399 20.9483 27.4949 21.3221C27.6499 21.6958 27.7297 22.0964 27.7297 22.5011C27.7297 22.9057 27.6499 23.3063 27.4949 23.68C27.3399 24.0538 27.1127 24.3933 26.8263 24.6791L25.7646 25.7407C24.0467 27.4601 21.5413 28.2257 19.2604 27.3901C15.0887 25.8712 11.2991 23.4593 8.15669 20.323Z" stroke="white" stroke-width="1.5" stroke-linejoin="round"/></svg>`;
const LINKEDIN_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 6C5.10457 6 6 5.10457 6 4C6 2.89543 5.10457 2 4 2C2.89543 2 2 2.89543 2 4C2 5.10457 2.89543 6 4 6Z" fill="#FFFFFF" /><path d="M4 10V20" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" /><path d="M10 10V20" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" /><path d="M10 15C10 12.24 12.24 10 15 10C17.76 10 20 12.24 20 15V20" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" /></svg>`;
const GITHUB_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M10 0C8.68678 0 7.38642 0.258658 6.17317 0.761205C4.95991 1.26375 3.85752 2.00035 2.92893 2.92893C1.05357 4.8043 0 7.34784 0 10C0 14.42 2.87 18.17 6.84 19.5C7.34 19.58 7.5 19.27 7.5 19V17.31C4.73 17.91 4.14 15.97 4.14 15.97C3.68 14.81 3.03 14.5 3.03 14.5C2.12 13.88 3.1 13.9 3.1 13.9C4.1 13.97 4.63 14.93 4.63 14.93C5.5 16.45 6.97 16 7.54 15.76C7.63 15.11 7.89 14.67 8.17 14.42C5.95 14.17 3.62 13.31 3.62 9.5C3.62 8.39 4 7.5 4.65 6.79C4.55 6.54 4.2 5.5 4.75 4.15C4.75 4.15 5.59 3.88 7.5 5.17C8.29 4.95 9.15 4.84 10 4.84C10.85 4.84 11.71 4.95 12.5 5.17C14.41 3.88 15.25 4.15 15.25 4.15C15.8 5.5 15.45 6.54 15.35 6.79C16 7.5 16.38 8.39 16.38 9.5C16.38 13.32 14.04 14.16 11.81 14.41C12.17 14.72 12.5 15.33 12.5 16.26V19C12.5 19.27 12.66 19.59 13.17 19.5C17.14 18.16 20 14.42 20 10C20 8.68678 19.7413 7.38642 19.2388 6.17317C18.7362 4.95991 17.9997 3.85752 17.0711 2.92893C16.1425 2.00035 15.0401 1.26375 13.8268 0.761205C12.6136 0.258658 11.3132 0 10 0Z" fill="#FFFFFF" /></svg>`;

function headerDetail(icon: string, content: string): string {
    return `<div class="header_details">${icon}${content}</div>`;
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

export const renderLagoon = (resume: any): string => {
    let html = loadTemplate("lagoon", "resumes");

    // --- NAME + PHOTO ---
    const fullName = [resume.firstName, resume.lastName].filter(Boolean).join(" ");
    html = replace(html, "name", escapeHtml(fullName));
    const photoUrl = resume.photoUrl ? `${SERVER_URL}${resume.photoUrl}` : "";
    html = replace(html, "photoUrl", photoUrl);

    // --- TAGLINE ---
    const primaryExperience = (resume.candidate_experience || [])[0];
    const taglineText = primaryExperience?.jobTitle || primaryExperience?.role || "";
    html = replace(html, "tagline", taglineText ? `<h4>${escapeHtml(taglineText)}</h4>` : "");

    // --- SUMMARY ---
    const summary = resume.resume_builder?.summary
        ? `<p>${nl2br(escapeHtml(resume.resume_builder.summary))}</p>`
        : "";
    html = replace(html, "summary", summary);

    // --- HEADER INFO ---
    const headerInfoParts: string[] = [];
    const address = [resume.city, resume.state, resume.country].filter(Boolean).join(", ");
    if (address) headerInfoParts.push(headerDetail(LOCATION_ICON, `<p>${escapeHtml(address)}</p>`));
    if (resume.email) headerInfoParts.push(headerDetail(EMAIL_ICON, `<a href="mailto:${escapeHtml(resume.email)}">${escapeHtml(resume.email)}</a>`));
    if (resume.phone) headerInfoParts.push(headerDetail(PHONE_ICON, `<a href="tel:${escapeHtml(resume.phone)}">${escapeHtml(resume.phone)}</a>`));
    if (resume.linkedin) headerInfoParts.push(headerDetail(LINKEDIN_ICON, `<a href="${escapeHtml(resume.linkedin)}" target="_blank">${escapeHtml(resume.linkedin)}</a>`));
    if (resume.github) headerInfoParts.push(headerDetail(GITHUB_ICON, `<a href="${escapeHtml(resume.github)}" target="_blank">${escapeHtml(resume.github)}</a>`));
    html = replace(html, "headerInfo", headerInfoParts.join(""));

    // --- EDUCATION ---
    const educations = resume.candidate_education || [];
    const educationHtml = educations
        .map((edu: any) => {
            const institute = edu.instituteName || edu.school || "";
            const degree = edu.courseDegree || edu.degree || "";
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

            const gradeVal = edu.grade || edu.gpa;
            const metaParts = [duration];
            if (gradeVal) metaParts.push(`CGPA: ${gradeVal}`);
            const metaLine = metaParts.filter(Boolean).join(" | ");
            const titleLine = [degree, institute].filter(Boolean).join(" | ");

            return `
<div class="education_details">
    <h4>${escapeHtml(titleLine)}</h4>
    ${metaLine ? `<p>${escapeHtml(metaLine)}</p>` : ""}
</div>`;
        })
        .join("");
    html = replace(html, "education", educationHtml);

    // --- EXPERIENCE ---
    const experiences = resume.candidate_experience || [];
    const experienceHtml = experiences
        .map((exp: any) => {
            const company = exp.companyName || exp.company || "";
            const role = exp.jobTitle || exp.role || "";
            const isCurrent = exp.isCurrent ?? !exp.endYear;

            const startMonth = exp.startMonth ?? getMonth(exp.startDate);
            const startYear = exp.startYear ?? getYear(exp.startDate);
            const endMonth = exp.endMonth ?? getMonth(exp.endDate);
            const endYear = exp.endYear ?? getYear(exp.endDate);

            const start = [startMonth, startYear].filter(Boolean).join("/");
            const end = isCurrent ? "Present" : [endMonth, endYear].filter(Boolean).join("/");
            const duration = start ? `${start} – ${end}` : end;

            const location = exp.location || "";
            const metaLine = [duration, location].filter(Boolean).join(" | ");
            const titleLine = [company, location].filter(Boolean).join(" — ");
            const headingLine = role ? `${escapeHtml(role)}${company ? ` — ${escapeHtml(company)}` : ""}${location ? `, ${escapeHtml(location)}` : ""}` : escapeHtml(titleLine);

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
    <h4>${headingLine}</h4>
    ${duration ? `<p>${escapeHtml(duration)}</p>` : ""}
    ${description}
</div>`;
        })
        .join("");
    html = replace(html, "experience", experienceHtml);

    // --- SKILLS ---
    const skillsList = resume.candidate_skills || [];
    const skillsHtml = skillsList
        .map((skill: any) => `<div class="skills_details"><p>${escapeHtml(skill.skillName || skill.name || "")}</p></div>`)
        .join("");
    html = replace(html, "skills", skillsHtml);

    return html;
};