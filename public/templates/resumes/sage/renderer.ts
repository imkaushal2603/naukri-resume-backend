import { escapeHtml, nl2br, normalizeUrl } from "../../../../src/helpers/templates/html.helper";
import { loadTemplate, replace } from "../../../../src/helpers/templates/template.helper";
import { SERVER_URL } from "../../../../src/config/environment.config";

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

export const renderSage = (resume: any): string => {
    let html = loadTemplate("sage", "resumes");

    // --- NAME + PHOTO ---
    const fullName = [resume.firstName, resume.lastName].filter(Boolean).join(" ");
    html = replace(html, "name", escapeHtml(fullName.toUpperCase()));
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
    if (resume.phone) contactParts.push(`<p><a href="tel:${escapeHtml(resume.phone)}">P: ${escapeHtml(resume.phone)}</a></p>`);
    if (resume.email) contactParts.push(`<p><a href="mailto:${escapeHtml(resume.email)}">E: ${escapeHtml(resume.email)}</a></p>`);
    const address = [resume.city, resume.state, resume.country].filter(Boolean).join(", ");
    if (address) contactParts.push(`<p>${escapeHtml(address)}</p>`);
    if (resume.linkedin) contactParts.push(`<p><a href="${escapeHtml(normalizeUrl(resume.linkedin))}" target="_blank">LinkedIn</a></p>`);
    if (resume.github) contactParts.push(`<p><a href="${escapeHtml(normalizeUrl(resume.github))}" target="_blank">GitHub</a></p>`);
    html = replace(html, "contact", contactParts.join(""));

    // --- EDUCATION ---
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

            const restParts = [institute, location, duration];
            if (gradeVal) restParts.push(`CGPA: ${gradeVal}`);
            const restLine = restParts.filter(Boolean).join(" | ");

            const degreeLabel = level ? `${degree} (${level})` : degree;

            return `<p><strong>${escapeHtml(degreeLabel)}${restLine ? " |" : ""}</strong> ${escapeHtml(restLine)}</p>`;
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
            const location = exp.location || "";
            const isCurrent = exp.isCurrent ?? !exp.endYear;

            const startMonth = exp.startMonth ?? getMonth(exp.startDate);
            const startYear = exp.startYear ?? getYear(exp.startDate);
            const endMonth = exp.endMonth ?? getMonth(exp.endDate);
            const endYear = exp.endYear ?? getYear(exp.endDate);

            const start = [startMonth, startYear].filter(Boolean).join("/");
            const end = isCurrent ? "Present" : [endMonth, endYear].filter(Boolean).join("/");
            const duration = start ? `${start} – ${end}` : end;

            const titleLine = [company, role, location, duration].filter(Boolean).join(" | ");

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