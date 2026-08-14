import { escapeHtml, nl2br } from "../../../src/helpers/templates/html.helper";
import { loadTemplate, replace } from "../../../src/helpers/templates/template.helper";

// Helper utilities for raw date objects/strings
const getYear = (dateVal: any): string => {
    if (!dateVal) return "";
    const date = new Date(dateVal);
    return isNaN(date.getTime()) ? "" : String(date.getUTCFullYear());
};

const getMonth = (dateVal: any): string => {
    if (!dateVal) return "";
    const date = new Date(dateVal);
    return isNaN(date.getTime()) ? "" : date.toLocaleString("default", { month: "short", timeZone: "UTC" });
};

export const renderClassic = (resume: any): string => {
    let html = loadTemplate("classic");

    // --- 1. NAME ---
    const fullName = [resume.firstName, resume.lastName].filter(Boolean).join(" ");
    html = replace(html, "name", escapeHtml(fullName));

    // --- 2. CONTACT ---
    const contact: string[] = [];

    if (resume.email) {
        contact.push(`<div><span>${escapeHtml(resume.email)}</span><i class="fa-solid fa-envelope"></i></div>`);
    }
    if (resume.phone) {
        contact.push(`<div><span>${escapeHtml(resume.phone)}</span><i class="fa-solid fa-phone"></i></div>`);
    }
    if (resume.linkedin) {
        contact.push(`<div><span>${escapeHtml(resume.linkedin)}</span><i class="fa-brands fa-linkedin"></i></div>`);
    }
    if (resume.github) {
        contact.push(`<div><span>${escapeHtml(resume.github)}</span><i class="fa-brands fa-github"></i></div>`);
    }

    const address = [resume.city, resume.state, resume.country].filter(Boolean).join(", ");
    if (address) {
        contact.push(`<div><span>${escapeHtml(address)}</span><i class="fa-solid fa-location-dot"></i></div>`);
    }

    html = replace(html, "contact", contact.join(""));

    // --- 3. SUMMARY ---
    const summary = resume.resume_builder?.summary
        ? `<div class="summary">${nl2br(escapeHtml(resume.resume_builder.summary))}</div>`
        : "";

    html = replace(html, "summary", summary);

    // --- 4. EDUCATION ---
    const educations = resume.candidate_education || [];
    const educationHtml = educations.length
        ? educations
            .map((edu: any) => {
                // Support both mapped fields (instituteName) and DB fields (school)
                const institute = edu.instituteName || edu.school || "";
                const degree = edu.courseDegree || edu.degree || "";
                const level = edu.educationLevel || edu.fieldOfStudy || "";
                const isCurrent = edu.currentlyStudying ?? edu.isCurrent ?? false;
                
                const startYear = edu.startYear ?? getYear(edu.startDate);
                const endYear = isCurrent 
                    ? "Present" 
                    : (edu.passingYear ?? getYear(edu.endDate));

                let duration = "";
                if (startYear && endYear) {
                    duration = `${startYear} - ${endYear}`;
                } else if (startYear || endYear) {
                    duration = startYear || endYear;
                }

                const gradeVal = edu.grade || edu.gpa;

                return `
<div class="education_item">
    <div class="left">
        <h3>${escapeHtml(institute)}</h3>
        <h4>
            ${escapeHtml(degree)}
            ${level ? `, ${escapeHtml(level)}` : ""}
            ${gradeVal ? `, CGPA: ${escapeHtml(gradeVal)}` : ""}
        </h4>
        ${duration ? `<div class="date">${escapeHtml(duration)}</div>` : ""}
    </div>
    <div class="right">
        ${edu.address ? `<div class="location">${escapeHtml(edu.address)}</div>` : ""}
    </div>
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
                // Support both mapped fields and raw DB fields
                const company = exp.companyName || exp.company || "";
                const role = exp.jobTitle || exp.role || "";
                const isCurrent = exp.isCurrent ?? !exp.endYear;

                const startMonth = exp.startMonth ?? getMonth(exp.startDate);
                const startYear = exp.startYear ?? getYear(exp.startDate);
                
                const endMonth = exp.endMonth ?? getMonth(exp.endDate);
                const endYear = exp.endYear ?? getYear(exp.endDate);

                const start = [startMonth, startYear].filter(Boolean).join(" ");
                const end = isCurrent ? "Present" : [endMonth, endYear].filter(Boolean).join(" ");

                const duration = start ? `${start} - ${end}` : end;

                // Safely format list items without html escape double-encoding
                const description = exp.description
                    ? `
<ul>
${exp.description
    .split(/\r?\n/)
    .map((line: string) => line.trim())
    .filter(Boolean)
    .map((line: string) => `<li>${escapeHtml(line)}</li>`)
    .join("")}
</ul>`
                    : "";

                return `
<div class="experience_item">
    <div class="left">
        <h3>${escapeHtml(company)}</h3>
        <h4>${escapeHtml(role)}</h4>
        <div class="meta">
            ${escapeHtml(duration)}
            ${exp.employmentType ? ` • ${escapeHtml(exp.employmentType)}` : ""}
        </div>
        ${description}
    </div>
    <div class="right">
        ${exp.location ? `<div class="location">${escapeHtml(exp.location)}</div>` : ""}
    </div>
</div>`;
            })
            .join("")
        : "";

    html = replace(html, "experience", experienceHtml);

    // --- 6. SKILLS ---
    const skillsList = resume.candidate_skills || [];
    const skillsHtml = skillsList.length
        ? skillsList
            .map((skill: any) => {
                const name = skill.skillName || skill.name || "";
                return `<span>${escapeHtml(name)}</span>`;
            })
            .join("")
        : "";

    html = replace(
        html,
        "skills",
        skillsHtml ? `<div class="skills">${skillsHtml}</div>` : ""
    );

    return html;
};