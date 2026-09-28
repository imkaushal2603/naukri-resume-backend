import { escapeHtml, nl2br } from "../../../../src/helpers/templates/html.helper";
import { loadTemplate, replace } from "../../../../src/helpers/templates/template.helper";
import { SERVER_URL } from "../../../../src/config/environment.config";

const getYear = (dateVal: any): string => {
    if (!dateVal) return "";
    const date = new Date(dateVal);
    return isNaN(date.getTime()) ? "" : String(date.getUTCFullYear());
};

function contactRow(label: string, content: string): string {
    return `<div class="contacts_details"><h4>${label}</h4>${content}</div>`;
}

export const renderCitrine = (resume: any): string => {
    let html = loadTemplate("citrine", "resumes");

    // --- NAME + PHOTO ---
    const fullName = [resume.firstName, resume.lastName].filter(Boolean).join(" ");
    html = replace(html, "name", escapeHtml(fullName));
    const photoUrl = resume.photoUrl ? `${SERVER_URL}${resume.photoUrl}` : "";
    html = replace(html, "photoUrl", photoUrl);

    // --- SUMMARY ---
    const summary = resume.resume_builder?.summary
        ? `<p>${nl2br(escapeHtml(resume.resume_builder.summary))}</p>`
        : "";
    html = replace(html, "summary", summary);

    // --- CONTACT ---
    const contactParts: string[] = [];
    if (resume.phone) contactParts.push(contactRow("Phone", `<a href="tel:${escapeHtml(resume.phone)}">${escapeHtml(resume.phone)}</a>`));
    if (resume.email) contactParts.push(contactRow("Email", `<a href="mailto:${escapeHtml(resume.email)}">${escapeHtml(resume.email)}</a>`));
    const address = [resume.city, resume.state, resume.country].filter(Boolean).join(", ");
    if (address) contactParts.push(contactRow("Location", `<p>${escapeHtml(address)}</p>`));
    if (resume.linkedin) contactParts.push(contactRow("Linkedin", `<a href="${escapeHtml(resume.linkedin)}" target="_blank">${escapeHtml(resume.linkedin)}</a>`));
    if (resume.github) contactParts.push(contactRow("GitHub", `<a href="${escapeHtml(resume.github)}" target="_blank">${escapeHtml(resume.github)}</a>`));
    html = replace(html, "contact", contactParts.join(""));

    // --- SKILLS ---
    const skillsList = resume.candidate_skills || [];
    const skillsHtml = skillsList
        .map((skill: any) => `<div class="skills_details"><p>${escapeHtml(skill.skillName || skill.name || "")}</p></div>`)
        .join("");
    html = replace(html, "skills", skillsHtml);

    // --- EDUCATION (degree | CGPA, years, institute) ---
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

            const location = edu.address || edu.city || "";
            const gradeVal = edu.grade || edu.gpa;

            const degreeLabel = level ? `${degree} (${level})` : degree;
            const titleLine = [degreeLabel, gradeVal ? `CGPA: ${gradeVal}` : ""].filter(Boolean).join(" | ");
            const uniLine = [institute, location].filter(Boolean).join(", ");

            return `
<div class="education_details">
    <div class="education_title">
        <h4>${escapeHtml(titleLine)}</h4>
        ${years ? `<h4>Year : ${escapeHtml(years)}</h4>` : ""}
    </div>
    <div class="education_uni">
        <h4>${escapeHtml(uniLine)}</h4>
    </div>
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
            const location = exp.location || "";
            const isCurrent = exp.isCurrent ?? !exp.endYear;

            const startYear = exp.startYear ?? getYear(exp.startDate);
            const endYear = isCurrent ? "Present" : (exp.endYear ?? getYear(exp.endDate));
            const years = startYear ? `${startYear} – ${endYear}` : endYear;

            const companyLine = [company, location].filter(Boolean).join(", ");

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
    <div class="experience_content">
        <div class="experience_title">
            <h4>${escapeHtml(role)}</h4>
            ${years ? `<h4>${escapeHtml(years)}</h4>` : ""}
        </div>
        <div class="experience_name">
            <h4>${escapeHtml(companyLine)}</h4>
        </div>
    </div>
    ${description}
</div>`;
        })
        .join("");
    html = replace(html, "experience", experienceHtml);

    return html;
};