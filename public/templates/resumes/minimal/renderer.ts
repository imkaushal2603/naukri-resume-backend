import { escapeHtml, nl2br } from "../../../../src/helpers/templates/html.helper";
import { loadTemplate, replace } from "../../../../src/helpers/templates/template.helper";

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

const PHONE_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 21" fill="none"><path d="M14 1V3M5 20V18C5 17.4696 5.21071 16.9609 5.58579 16.5858C5.96086 16.2107 6.46957 16 7 16H13C13.5304 16 14.0391 16.2107 14.4142 16.5858C14.7893 16.9609 15 17.4696 15 18V20M6 1V3" stroke="#000024" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /><path d="M10 12C11.6569 12 13 10.6569 13 9C13 7.34315 11.6569 6 10 6C8.34315 6 7 7.34315 7 9C7 10.6569 8.34315 12 10 12Z" stroke="#000024" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /><path d="M17 2H3C1.89543 2 1 2.89543 1 4V18C1 19.1046 1.89543 20 3 20H17C18.1046 20 19 19.1046 19 18V4C19 2.89543 18.1046 2 17 2Z" stroke="#000024" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>`;
const EMAIL_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 16" fill="none"><path d="M17.25 0H2.75C2.02106 0.00132174 1.32236 0.291477 0.806916 0.806916C0.291477 1.32236 0.00132174 2.02106 0 2.75V13.25C0.00132174 13.9789 0.291477 14.6776 0.806916 15.1931C1.32236 15.7085 2.02106 15.9987 2.75 16H17.25C17.9789 15.9987 18.6776 15.7085 19.1931 15.1931C19.7085 14.6776 19.9987 13.9789 20 13.25V2.75C19.9987 2.02106 19.7085 1.32236 19.1931 0.806916C18.6776 0.291477 17.9789 0.00132174 17.25 0ZM2.75 1.5H17.25C17.94 1.5 18.5 2.06 18.5 2.75V3.725L10 8.635L1.5 3.725V2.75C1.5 2.06 2.06 1.5 2.75 1.5ZM17.25 14.5H2.75C2.06 14.5 1.5 13.94 1.5 13.25V5.46L10 10.37L18.5 5.46V13.25C18.5 13.94 17.94 14.5 17.25 14.5Z" fill="#000024" /></svg>`;
const LOCATION_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 18 18" fill="none"><path d="M13.5502 0.955118L1.89023 6.50712C0.297229 7.26612 0.396229 9.56612 2.04823 10.1861L4.78823 11.2131C5.05544 11.3134 5.29809 11.4696 5.4999 11.6715C5.7017 11.8733 5.85798 12.1159 5.95823 12.3831L6.98423 15.1221C7.60423 16.7751 9.90423 16.8731 10.6632 15.2801L16.2152 3.62112C17.0242 1.92012 15.2502 0.145118 13.5502 0.955118Z" stroke="#000024" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>`;
const LINKEDIN_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 6C5.10457 6 6 5.10457 6 4C6 2.89543 5.10457 2 4 2C2.89543 2 2 2.89543 2 4C2 5.10457 2.89543 6 4 6Z" fill="black" /><path d="M4 10V20" stroke="black" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" /><path d="M10 10V20" stroke="black" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" /><path d="M10 15C10 12.24 12.24 10 15 10C17.76 10 20 12.24 20 15V20" stroke="black" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" /></svg>`;
const GITHUB_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M10 0C8.68678 0 7.38642 0.258658 6.17317 0.761205C4.95991 1.26375 3.85752 2.00035 2.92893 2.92893C1.05357 4.8043 0 7.34784 0 10C0 14.42 2.87 18.17 6.84 19.5C7.34 19.58 7.5 19.27 7.5 19V17.31C4.73 17.91 4.14 15.97 4.14 15.97C3.68 14.81 3.03 14.5 3.03 14.5C2.12 13.88 3.1 13.9 3.1 13.9C4.1 13.97 4.63 14.93 4.63 14.93C5.5 16.45 6.97 16 7.54 15.76C7.63 15.11 7.89 14.67 8.17 14.42C5.95 14.17 3.62 13.31 3.62 9.5C3.62 8.39 4 7.5 4.65 6.79C4.55 6.54 4.2 5.5 4.75 4.15C4.75 4.15 5.59 3.88 7.5 5.17C8.29 4.95 9.15 4.84 10 4.84C10.85 4.84 11.71 4.95 12.5 5.17C14.41 3.88 15.25 4.15 15.25 4.15C15.8 5.5 15.45 6.54 15.35 6.79C16 7.5 16.38 8.39 16.38 9.5C16.38 13.32 14.04 14.16 11.81 14.41C12.17 14.72 12.5 15.33 12.5 16.26V19C12.5 19.27 12.66 19.59 13.17 19.5C17.14 18.16 20 14.42 20 10C20 8.68678 19.7413 7.38642 19.2388 6.17317C18.7362 4.95991 17.9997 3.85752 17.0711 2.92893C16.1425 2.00035 15.0401 1.26375 13.8268 0.761205C12.6136 0.258658 11.3132 0 10 0Z" fill="black" /></svg>`;

function contactDetail(icon: string, content: string): string {
    return `<div class="contact_details"><div class="contact_icon">${icon}</div><div class="contact_content">${content}</div></div>`;
}

export const renderMinimal = (resume: any): string => {
    let html = loadTemplate("minimal", "resumes");

    // --- 1. NAME ---
    const fullName = [resume.firstName, resume.lastName].filter(Boolean).join(" ");
    html = replace(html, "name", escapeHtml(fullName.toUpperCase()));

    // --- 2. TAGLINE ---
    const primaryExperience = (resume.candidate_experience || [])[0];
    const taglineText = primaryExperience?.jobTitle || primaryExperience?.role || "";
    const tagline = taglineText ? `<p>${escapeHtml(taglineText)}</p>` : "";
    html = replace(html, "tagline", tagline);

    // --- 3. SUMMARY ---
    const summary = resume.resume_builder?.summary
        ? `<p>${nl2br(escapeHtml(resume.resume_builder.summary))}</p>`
        : "";
    html = replace(html, "summary", summary);

    // --- 4. EDUCATION ---
    const educations = resume.candidate_education || [];
    const educationHtml = educations.length
        ? educations
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

                return `
<div class="education_details">
    <h4>${escapeHtml(degree)}</h4>
    <h4>${escapeHtml(institute)}</h4>
    ${metaLine ? `<p>${escapeHtml(metaLine)}</p>` : ""}
</div>`;
            })
            .join("")
        : "";
    html = replace(html, "education", educationHtml);

    // --- 5. EXPERIENCE ---
    const experiences = resume.candidate_experience || [];
    const experienceHtml = experiences.length
        ? experiences
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
    <h4>${escapeHtml(company)}</h4>
    ${metaLine ? `<p>${escapeHtml(metaLine)}</p>` : ""}
    ${description}
</div>`;
            })
            .join("")
        : "";
    html = replace(html, "experience", experienceHtml);

    // --- 6. CONTACT ---
    const contactParts: string[] = [];
    if (resume.phone) {
        contactParts.push(contactDetail(PHONE_ICON, `<a href="tel:${escapeHtml(resume.phone)}">${escapeHtml(resume.phone)}</a>`));
    }
    if (resume.email) {
        contactParts.push(contactDetail(EMAIL_ICON, `<a href="mailto:${escapeHtml(resume.email)}">${escapeHtml(resume.email)}</a>`));
    }
    const address = [resume.city, resume.state, resume.country].filter(Boolean).join(", ");
    if (address) {
        contactParts.push(contactDetail(LOCATION_ICON, `<p>${escapeHtml(address)}</p>`));
    }
    if (resume.linkedin) {
        contactParts.push(contactDetail(LINKEDIN_ICON, `<a href="${escapeHtml(resume.linkedin)}" target="_blank">LinkedIn</a>`));
    }
    if (resume.github) {
        contactParts.push(contactDetail(GITHUB_ICON, `<a href="${escapeHtml(resume.github)}" target="_blank">GitHub</a>`));
    }
    html = replace(html, "contact", contactParts.join(""));

    // --- 7. SKILLS ---
    const skillsList = resume.candidate_skills || [];
    const skillsHtml = skillsList.length
        ? skillsList
            .map((skill: any) => {
                const name = skill.skillName || skill.name || "";
                return `<div class="skills_details"><p>${escapeHtml(name)}</p></div>`;
            })
            .join("")
        : "";
    html = replace(html, "skills", skillsHtml);

    return html;
};