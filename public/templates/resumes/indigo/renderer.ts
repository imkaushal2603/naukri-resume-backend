import { escapeHtml, nl2br, normalizeUrl } from "../../../../src/helpers/templates/html.helper";
import { loadTemplate, replace } from "../../../../src/helpers/templates/template.helper";
import { SERVER_URL } from "../../../../src/config/environment.config";

const getYear = (dateVal: any): string => {
    if (!dateVal) return "";
    const date = new Date(dateVal);
    return isNaN(date.getTime()) ? "" : String(date.getUTCFullYear());
};

export const renderIndigo = (resume: any): string => {
    let html = loadTemplate("indigo", "resumes");

    // --- NAME + PHOTO ---
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
    if (resume.phone) contactParts.push(`<p><a href="tel:${escapeHtml(resume.phone)}">${escapeHtml(resume.phone)}</a></p>`);
    if (resume.email) contactParts.push(`<p><a href="mailto:${escapeHtml(resume.email)}">${escapeHtml(resume.email)}</a></p>`);
    const address = [resume.city, resume.state, resume.country].filter(Boolean).join(", ");
    if (address) contactParts.push(`<p>${escapeHtml(address)}</p>`);
    if (resume.linkedin) contactParts.push(`<p><a href="${escapeHtml(normalizeUrl(resume.linkedin))}" target="_blank">${escapeHtml(resume.linkedin)}</a></p>`);
    if (resume.github) contactParts.push(`<p><a href="${escapeHtml(normalizeUrl(resume.github))}" target="_blank">${escapeHtml(resume.github)}</a></p>`);
    html = replace(html, "contact", contactParts.join(""));

    // --- EDUCATION (degree, then institute | years | CGPA) ---
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

            const metaParts = [institute, years];
            if (gradeVal) metaParts.push(`CGPA: ${gradeVal}`);
            const metaLine = metaParts.filter(Boolean).join(" | ");

            return `
<div class="details">
    <h6>${escapeHtml(degreeLabel)}</h6>
    ${metaLine ? `<p>${escapeHtml(metaLine)}</p>` : ""}
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
                ? `<p>${nl2br(escapeHtml(exp.description))}</p>`
                : "";

            return `
<div class="details">
    <h5>${escapeHtml(role)}</h5>
    ${metaLine ? `<h6>${escapeHtml(metaLine)}</h6>` : ""}
    ${description}
</div>`;
        })
        .join("");
    html = replace(html, "experience", experienceHtml);

    return html;
};