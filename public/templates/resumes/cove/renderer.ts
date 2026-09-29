import { escapeHtml, nl2br } from "../../../../src/helpers/templates/html.helper";
import { loadTemplate, replace } from "../../../../src/helpers/templates/template.helper";
import { SERVER_URL } from "../../../../src/config/environment.config";

const PHONE_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44" fill="none"><circle cx="22" cy="22" r="22" fill="#1800AC" /><path d="M29 12H15C14.45 12 14 12.45 14 13V17H12V19H14V21H12V23H14V25H12V27H14V31C14 31.55 14.45 32 15 32H29C30.1 32 31 31.1 31 30V14C31 12.9 30.1 12 29 12ZM29 30H16V14H29V30Z" fill="white" /><path d="M22.5 17C21.837 17 21.2011 17.2634 20.7322 17.7322C20.2634 18.2011 20 18.837 20 19.5C20 20.163 20.2634 20.7989 20.7322 21.2678C21.2011 21.7366 21.837 22 22.5 22C23.163 22 23.7989 21.7366 24.2678 21.2678C24.7366 20.7989 25 20.163 25 19.5C25 18.837 24.7366 18.2011 24.2678 17.7322C23.7989 17.2634 23.163 17 22.5 17ZM27 26C27 24.34 25.66 23 24 23H21C19.34 23 18 24.34 18 26V27H27V26Z" fill="white" /></svg>`;
const EMAIL_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44" fill="none"><circle cx="22" cy="22" r="22" fill="#1800AC" /><g clip-path="url(#clip0_1351_3306)"><path d="M34 17.3734L31.5156 19.239L29.0312 21.1046V14.6078L30.475 13.5296C31.1594 13.0187 32.0219 12.939 32.7859 13.3187C33.55 13.6984 34.0047 14.439 34.0047 15.2921L34 17.3734ZM29.0266 21.8828V30.9203H32.6359C33.3906 30.9203 34 30.3062 34 29.5562V18.1562L31.5156 20.0218L29.0266 21.8828ZM10 29.5656C10 30.3156 10.6141 30.925 11.3641 30.925H14.9734V21.8828L10 18.1562V29.5656ZM10 15.2875V17.3734L14.9734 21.1V14.6078L13.5297 13.525C12.8453 13.0093 11.9828 12.9343 11.2188 13.314C10.4547 13.6984 10 14.4343 10 15.2875ZM22 19.8765L15.5969 15.0765V21.5687L22 26.3734L28.4031 21.5734V15.0765L22 19.8765Z" fill="white" /></g><defs><clipPath id="clip0_1351_3306"><rect width="24" height="24" fill="white" transform="translate(10 10)" /></clipPath></defs></svg>`;
const LOCATION_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44" fill="none"><circle cx="22" cy="22" r="22" fill="#1800AC" /><path d="M21.166 20.216V25.3327L21.9993 26.9993L22.8327 25.3327V20.216C24.266 19.841 25.3327 18.5493 25.3327 16.9993C25.3327 15.1577 23.841 13.666 21.9993 13.666C20.1577 13.666 18.666 15.1577 18.666 16.9993C18.666 18.5493 19.7327 19.841 21.166 20.216ZM21.9993 15.3327C22.916 15.3327 23.666 16.0827 23.666 16.9993C23.666 17.916 22.916 18.666 21.9993 18.666C21.0827 18.666 20.3327 17.916 20.3327 16.9993C20.3327 16.0827 21.0827 15.3327 21.9993 15.3327Z" fill="white" /><path d="M24.4993 23.8086V25.4836C27.241 25.8253 28.666 26.6586 28.666 27.0003C28.666 27.4253 26.3743 28.6669 21.9993 28.6669C17.6243 28.6669 15.3327 27.4253 15.3327 27.0003C15.3327 26.6669 16.7577 25.8253 19.4993 25.4836V23.8086C16.3743 24.1586 13.666 25.1919 13.666 27.0003C13.666 29.2919 17.9827 30.3336 21.9993 30.3336C26.016 30.3336 30.3327 29.2919 30.3327 27.0003C30.3327 25.1836 27.6243 24.1586 24.4993 23.8086Z" fill="white" /></svg>`;
const LINKEDIN_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44" fill="none"><circle cx="22" cy="22" r="22" fill="#1800AC" /><path d="M14 16C15.1046 16 16 15.1046 16 14C16 12.8954 15.1046 12 14 12C12.8954 12 12 12.8954 12 14C12 15.1046 12.8954 16 14 16Z" fill="white" /><path d="M14 20V30" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" /><path d="M20 20V30" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" /><path d="M20 25C20 22.24 22.24 20 25 20C27.76 20 30 22.24 30 25V30" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" /></svg>`;
const GITHUB_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44" fill="none"><circle cx="22" cy="22" r="22" fill="#1800AC" /><path d="M22 12C20.6868 12 19.3864 12.2587 18.1732 12.7612C16.9599 13.2638 15.8575 14.0003 14.9289 14.9289C13.0536 16.8043 12 19.3478 12 22C12 26.42 14.87 30.17 18.84 31.5C19.34 31.58 19.5 31.27 19.5 31V29.31C16.73 29.91 16.14 27.97 16.14 27.97C15.68 26.81 15.03 26.5 15.03 26.5C14.12 25.88 15.1 25.9 15.1 25.9C16.1 25.97 16.63 26.93 16.63 26.93C17.5 28.45 18.97 28 19.54 27.76C19.63 27.11 19.89 26.67 20.17 26.42C17.95 26.17 15.62 25.31 15.62 21.5C15.62 20.39 16 19.5 16.65 18.79C16.55 18.54 16.2 17.5 16.75 16.15C16.75 16.15 17.59 15.88 19.5 17.17C20.29 16.95 21.15 16.84 22 16.84C22.85 16.84 23.71 16.95 24.5 17.17C26.41 15.88 27.25 16.15 27.25 16.15C27.8 17.5 27.45 18.54 27.35 18.79C28 19.5 28.38 20.39 28.38 21.5C28.38 25.32 26.04 26.16 23.81 26.41C24.17 26.72 24.5 27.33 24.5 28.26V31C24.5 31.27 24.66 31.59 25.17 31.5C29.14 30.16 32 26.42 32 22C32 20.6868 31.7413 19.3864 31.2388 18.1732C30.7362 16.9599 29.9997 15.8575 29.0711 14.9289C28.1425 14.0003 27.0401 13.2638 25.8268 12.7612C24.6136 12.2587 23.3132 12 22 12Z" fill="white" /></svg>`;

function contactRow(icon: string, label: string, content: string): string {
    return `<div class="contact_details"><div class="contact_icon">${icon}</div><div class="contact_content"><p>${label}</p>${content}</div></div>`;
}

const getYear = (dateVal: any): string => {
    if (!dateVal) return "";
    const date = new Date(dateVal);
    return isNaN(date.getTime()) ? "" : String(date.getUTCFullYear());
};

export const renderCove = (resume: any): string => {
    let html = loadTemplate("cove", "resumes");

    // --- NAME + PHOTO ---
    const fullName = [resume.firstName, resume.lastName].filter(Boolean).join(" ");
    html = replace(html, "name", escapeHtml(fullName.toUpperCase()));
    const photoUrl = resume.photoUrl ? `${SERVER_URL}${resume.photoUrl}` : "";
    html = replace(html, "photoUrl", photoUrl);

    // --- TAGLINE ---
    const primaryExperience = (resume.candidate_experience || [])[0];
    const taglineText = primaryExperience?.jobTitle || primaryExperience?.role || "";
    html = replace(html, "tagline", taglineText ? `<h4>${escapeHtml(taglineText.toUpperCase())}</h4>` : "");

    // --- SUMMARY ---
    const summary = resume.resume_builder?.summary
        ? `<p>${nl2br(escapeHtml(resume.resume_builder.summary))}</p>`
        : "";
    html = replace(html, "summary", summary);

    // --- CONTACT ---
    const contactParts: string[] = [];
    if (resume.phone) contactParts.push(contactRow(PHONE_ICON, "Phone No", `<a href="tel:${escapeHtml(resume.phone)}">${escapeHtml(resume.phone)}</a>`));
    if (resume.email) contactParts.push(contactRow(EMAIL_ICON, "Email", `<a href="mailto:${escapeHtml(resume.email)}">${escapeHtml(resume.email)}</a>`));
    const address = [resume.city, resume.state, resume.country].filter(Boolean).join(", ");
    if (address) contactParts.push(contactRow(LOCATION_ICON, "Address", `<p>${escapeHtml(address)}</p>`));
    if (resume.linkedin) contactParts.push(contactRow(LINKEDIN_ICON, "Linkedin", `<a href="${escapeHtml(resume.linkedin)}" target="_blank">${escapeHtml(resume.linkedin)}</a>`));
    if (resume.github) contactParts.push(contactRow(GITHUB_ICON, "Github", `<a href="${escapeHtml(resume.github)}" target="_blank">${escapeHtml(resume.github)}</a>`));
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
<div class="experience_details">
    <h4>${escapeHtml(role)}</h4>
    ${metaLine ? `<p>${escapeHtml(metaLine)}</p>` : ""}
    ${description}
</div>`;
        })
        .join("");
    html = replace(html, "experience", experienceHtml);

    // --- EDUCATION (date, then degree | institute | CGPA) ---
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
            const degreeLabel = level ? `${degree} – ${level}` : degree;

            const lineParts = [degreeLabel, institute];
            if (gradeVal) lineParts.push(`CGPA: ${gradeVal}`);
            const line = lineParts.filter(Boolean).join(" | ");

            return `
<div class="education_details">
    ${years ? `<div class="education_date"><p>${escapeHtml(years)}</p></div>` : ""}
    <h4>${escapeHtml(line)}</h4>
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

    return html;
};