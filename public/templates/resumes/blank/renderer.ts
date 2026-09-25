import { escapeHtml, nl2br } from "../../../../src/helpers/templates/html.helper";
import { loadTemplate, replace } from "../../../../src/helpers/templates/template.helper";

const LINKEDIN_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 19 19" fill="none"><path d="M2.188 0C1.90067 -4.28158e-09 1.61615 0.0565943 1.35069 0.166552C1.08523 0.276509 0.844025 0.437676 0.64085 0.64085C0.437676 0.844025 0.276509 1.08523 0.166552 1.35069C0.0565943 1.61615 0 1.90067 0 2.188C0 2.47533 0.0565943 2.75985 0.166552 3.02531C0.276509 3.29077 0.437676 3.53197 0.64085 3.73515C0.844025 3.93832 1.08523 4.09949 1.35069 4.20945C1.61615 4.31941 1.90067 4.376 2.188 4.376C2.47533 4.376 2.75985 4.31941 3.02531 4.20945C3.29077 4.09949 3.53197 3.93832 3.73515 3.73515C3.93832 3.53197 4.09949 3.29077 4.20945 3.02531C4.31941 2.75985 4.376 2.47533 4.376 2.188C4.376 1.90067 4.31941 1.61615 4.20945 1.35069C4.09949 1.08523 3.93832 0.844025 3.73515 0.64085C3.53197 0.437676 3.29077 0.276509 3.02531 0.166552C2.75985 0.0565943 2.47533 -4.28158e-09 2.188 0ZM6.442 6.034V18.173H10.211V12.17C10.211 10.586 10.509 9.052 12.473 9.052C14.41 9.052 14.434 10.863 14.434 12.27V18.174H18.205V11.517C18.205 8.247 17.501 5.734 13.679 5.734C11.844 5.734 10.614 6.741 10.111 7.694H10.06V6.034H6.442ZM0.3 6.034H4.075V18.173H0.3V6.034Z" fill="black" /></svg>`;
const GITHUB_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 23 23" fill="none"><path d="M11.3648 9.50783e-07C5.08574 -0.00253811 0 5.08067 0 11.3547C0 16.316 3.18145 20.5334 7.61211 22.0822C8.20879 22.232 8.11738 21.808 8.11738 21.5186V19.5508C4.67188 19.9545 4.53223 17.6744 4.30117 17.2936C3.83398 16.4963 2.72949 16.2932 3.05957 15.9123C3.84414 15.5086 4.64395 16.0139 5.5707 17.3824C6.24102 18.3752 7.54863 18.2076 8.21133 18.0426C8.35605 17.4459 8.66582 16.9127 9.09238 16.4988C5.52246 15.859 4.03457 13.6805 4.03457 11.0906C4.03457 9.83379 4.44844 8.67852 5.26094 7.74668C4.74297 6.21055 5.30918 4.89531 5.38535 4.69981C6.86055 4.56777 8.39414 5.75606 8.51348 5.85C9.35137 5.62402 10.3086 5.50469 11.3801 5.50469C12.4566 5.50469 13.4164 5.6291 14.2619 5.85762C14.5488 5.63926 15.9707 4.61856 17.3418 4.74297C17.4154 4.93848 17.9689 6.22324 17.4814 7.73906C18.3041 8.67344 18.723 9.83887 18.723 11.0982C18.723 13.6932 17.225 15.8742 13.6449 16.5039C13.9516 16.8055 14.195 17.1651 14.3611 17.5618C14.5272 17.9585 14.6126 18.3844 14.6123 18.8145V21.6709C14.6326 21.8994 14.6123 22.1254 14.9932 22.1254C19.4898 20.6096 22.7271 16.3617 22.7271 11.3572C22.7271 5.08066 17.6389 9.50783e-07 11.3648 9.50783e-07Z" fill="black" /></svg>`;

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

export const renderBlank = (resume: any): string => {
    let html = loadTemplate("blank", "resumes");

    // --- NAME ---
    const fullName = [resume.firstName, resume.lastName].filter(Boolean).join(" ");
    html = replace(html, "name", escapeHtml(fullName));

    // --- TAGLINE ---
    const primaryExperience = (resume.candidate_experience || [])[0];
    const taglineText = primaryExperience?.jobTitle || primaryExperience?.role || "";
    html = replace(html, "tagline", taglineText ? `<h4>${escapeHtml(taglineText)}</h4>` : "");

    // --- SUMMARY ---
    const summary = resume.resume_builder?.summary
        ? `<p>${nl2br(escapeHtml(resume.resume_builder.summary))}</p>`
        : "";
    html = replace(html, "summary", summary);

    // --- SOCIAL LINKS ---
    const socialParts: string[] = [];
    if (resume.linkedin) {
        socialParts.push(`<div class="header_details"><a href="${escapeHtml(resume.linkedin)}" target="_blank">${LINKEDIN_ICON}</a></div>`);
    }
    if (resume.github) {
        socialParts.push(`<div class="header_details"><a href="${escapeHtml(resume.github)}" target="_blank">${GITHUB_ICON}</a></div>`);
    }
    html = replace(html, "socialLinks", socialParts.join(""));

    // --- CONTACT ---
    const contactParts: string[] = [];
    if (resume.phone) {
        contactParts.push(`<div class="resume_details"><p>P: <a href="tel:${escapeHtml(resume.phone)}">${escapeHtml(resume.phone)}</a></p></div>`);
    }
    if (resume.email) {
        contactParts.push(`<div class="resume_details"><p>E: <a href="mailto:${escapeHtml(resume.email)}">${escapeHtml(resume.email)}</a></p></div>`);
    }
    const address = [resume.city, resume.state, resume.country].filter(Boolean).join(", ");
    if (address) {
        contactParts.push(`<div class="resume_details"><p>${escapeHtml(address)}</p></div>`);
    }
    html = replace(html, "contact", contactParts.join(""));

    // --- EXPERIENCE ---
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

            const startLabel = [monthNumToName(startMonth), startYear].filter(Boolean).join(" ");
            const endLabel = isCurrent ? "Present" : [monthNumToName(endMonth), endYear].filter(Boolean).join(" ");
            const duration = startLabel ? `${startLabel} – ${endLabel}` : endLabel;

            const titleLine = [role || company, location].filter(Boolean).join(" — ");
            const subLine = role && company ? `${escapeHtml(role)} | ${escapeHtml(company)}${location ? ` — ${escapeHtml(location)}` : ""}` : escapeHtml(titleLine);

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
    <div class="experience_left">
        ${duration ? `<h4>${escapeHtml(duration)}</h4>` : ""}
    </div>
    <div class="experience_right">
        <h4>${subLine}</h4>
        ${description}
    </div>
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
            const isCurrent = edu.currentlyStudying ?? edu.isCurrent ?? false;

            const startMonth = edu.startMonth || getMonth(edu.startDate);
            const startYear = edu.startYear || getYear(edu.startDate);
            const endMonth = edu.endMonth || getMonth(edu.endDate);
            const endYear = edu.endYear || edu.passingYear || getYear(edu.endDate);

            const startLabel = [monthNumToName(startMonth), startYear].filter(Boolean).join(" ");
            const endLabel = isCurrent ? "Present" : [monthNumToName(endMonth), endYear].filter(Boolean).join(" ");
            const duration = startLabel ? `${startLabel} – ${endLabel}` : endLabel;

            const gradeVal = edu.grade || edu.gpa;
            const metaParts = [duration];
            if (gradeVal) metaParts.push(`CGPA: ${gradeVal}`);
            const metaLine = metaParts.filter(Boolean).join(" | ");

            return `
<div class="education_details">
    <h4>${escapeHtml(degree)}: ${escapeHtml(institute)}</h4>
    ${metaLine ? `<p>${escapeHtml(metaLine)}</p>` : ""}
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