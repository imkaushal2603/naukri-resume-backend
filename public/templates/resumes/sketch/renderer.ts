import { escapeHtml, nl2br, normalizeUrl } from "../../../../src/helpers/templates/html.helper";
import { loadTemplate, replace } from "../../../../src/helpers/templates/template.helper";

const getYear = (dateVal: any): string => {
    if (!dateVal) return "";
    const date = new Date(dateVal);
    return isNaN(date.getTime()) ? "" : String(date.getUTCFullYear());
};

export const renderSketch = (resume: any): string => {
    let html = loadTemplate("sketch", "resumes");

    // --- NAME (last name in span) ---
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

    // --- CONTACT ---
    const contactParts: string[] = [];
    if (resume.phone) contactParts.push(`<div class="contact_details"><a href="tel:${escapeHtml(resume.phone)}">${escapeHtml(resume.phone)}</a></div>`);
    if (resume.email) contactParts.push(`<div class="contact_details"><a href="mailto:${escapeHtml(resume.email)}">${escapeHtml(resume.email)}</a></div>`);
    const address = [resume.city, resume.state, resume.country].filter(Boolean).join(", ");
    if (address) contactParts.push(`<div class="contact_details"><p>${escapeHtml(address)}</p></div>`);
    if (resume.linkedin) contactParts.push(`<div class="contact_details"><a href="${escapeHtml(normalizeUrl(resume.linkedin))}" target="_blank">LinkedIn</a></div>`);
    if (resume.github) contactParts.push(`<div class="contact_details"><a href="${escapeHtml(normalizeUrl(resume.github))}" target="_blank">Github</a></div>`);
    html = replace(html, "contact", contactParts.join(""));

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
<div class="education_details">
    <h4>${escapeHtml(degreeLabel)}</h4>
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

    return html;
};