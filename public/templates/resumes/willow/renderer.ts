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

export const renderWillow = (resume: any): string => {
    let html = loadTemplate("willow", "resumes");

    // --- NAME ---
    const fullName = [resume.firstName, resume.lastName].filter(Boolean).join(" ");
    html = replace(html, "name", escapeHtml(fullName.toUpperCase()));

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
    if (resume.email) {
        contactParts.push(`<p><a href="mailto:${escapeHtml(resume.email)}">${escapeHtml(resume.email)}</a></p>`);
    }
    const address = [resume.city, resume.state, resume.country].filter(Boolean).join(", ");
    if (address) {
        contactParts.push(`<p>${escapeHtml(address)}</p>`);
    }
    if (resume.phone) {
        contactParts.push(`<p><a href="tel:${escapeHtml(resume.phone)}">${escapeHtml(resume.phone)}</a></p>`);
    }
    if (resume.linkedin) {
        contactParts.push(`<p><a href="${escapeHtml(resume.linkedin)}" target="_blank">${escapeHtml(resume.linkedin)}</a></p>`);
    }
    if (resume.github) {
        contactParts.push(`<p><a href="${escapeHtml(resume.github)}" target="_blank">${escapeHtml(resume.github)}</a></p>`);
    }
    html = replace(html, "contact", contactParts.join(""));

    // --- EDUCATION (with CGPA + location) ---
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
                duration = start || end || endYear;
            }

            const location = edu.address || edu.city || "";
            const gradeVal = edu.grade || edu.gpa;

            const parts = [degree, duration, institute];
            if (location) parts.push(location);
            if (gradeVal) parts.push(`CGPA: ${gradeVal}`);
            const line = parts.filter(Boolean).join(" | ");

            return `<p>${escapeHtml(line)}</p>`;
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
            const titleLine = [role, company, location, duration].filter(Boolean).join(" | ");
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

    return html;
};