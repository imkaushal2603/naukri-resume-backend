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

export const renderProfessional = (resume: any): string => {
    let html = loadTemplate("professional", "resumes");

    // --- 1. NAME ---
    const fullName = [resume.firstName, resume.lastName].filter(Boolean).join(" ");
    html = replace(html, "name", escapeHtml(fullName));

    // --- 2. TAGLINE ---
    const primaryExperience = (resume.candidate_experience || [])[0];
    const taglineText = primaryExperience?.jobTitle || primaryExperience?.role || "";
    const tagline = taglineText ? `<h4>${escapeHtml(taglineText)}</h4>` : "";
    html = replace(html, "tagline", tagline);

    // --- 3. SUMMARY ---
    const summary = resume.resume_builder?.summary
        ? `<p>${nl2br(escapeHtml(resume.resume_builder.summary))}</p>`
        : "";
    html = replace(html, "summary", summary);

    // --- 4. HEADER INFO (Separated with <span>|</span>) ---
    const headerInfoParts: string[] = [];

    const address = [resume.city, resume.state, resume.country].filter(Boolean).join(", ");
    if (address) {
        headerInfoParts.push(`<div class="header_details"><p>${escapeHtml(address)}</p></div>`);
    }
    if (resume.email) {
        headerInfoParts.push(`<div class="header_details"><a href="mailto:${escapeHtml(resume.email)}">${escapeHtml(resume.email)}</a></div>`);
    }
    if (resume.phone) {
        headerInfoParts.push(`<div class="header_details"><a href="tel:${escapeHtml(resume.phone)}">${escapeHtml(resume.phone)}</a></div>`);
    }
    if (resume.linkedin) {
        headerInfoParts.push(`<div class="header_details"><a href="${escapeHtml(resume.linkedin)}" target="_blank">LinkedIn</a></div>`);
    }
    if (resume.github) {
        headerInfoParts.push(`<div class="header_details"><a href="${escapeHtml(resume.github)}" target="_blank">GitHub</a></div>`);
    }

    const headerInfoHtml = headerInfoParts.join(" <span>|</span> ");
    html = replace(html, "headerInfo", headerInfoHtml);

    // --- 5. EDUCATION ---
    const educations = resume.candidate_education || [];
    let educationSection = "";
    if (educations.length) {
        const educationItems = educations
            .map((edu: any) => {
                const institute = edu.instituteName || edu.school || "";
                const degree = edu.courseDegree || edu.degree || "";
                const isCurrent = edu.currentlyStudying ?? edu.isCurrent ?? false;

                const startMonth = edu.startMonth ?? getMonth(edu.startDate);
                const startYear = edu.startYear ?? getYear(edu.startDate);
                const endMonth = edu.endMonth ?? getMonth(edu.endDate);
                const endYear = isCurrent ? "Present" : (edu.passingYear ?? edu.endYear ?? getYear(edu.endDate));

                const start = [startMonth, startYear].filter(Boolean).join("/");
                const end = [endMonth, endYear].filter(Boolean).join("/");
                const duration = start ? `${start} – ${end}` : endYear || startYear;

                const location = edu.address || edu.city || "";
                const metaParts = [duration, location].filter(Boolean).join(" | ");

                return `
        <div class="education_details">
          <div class="education_content">
            <div class="education_name">
              <h4>${escapeHtml(degree)}</h4>
            </div>
            <div class="education_date">
              <p>${escapeHtml(metaParts)}</p>
            </div>
          </div>
          <h4>${escapeHtml(institute)}</h4>
        </div>`;
            })
            .join("");

        educationSection = `
    <div class="education">
      <h2>EDUCATION</h2>
      <div class="education_info">
        ${educationItems}
      </div>
    </div>`;
    }
    html = replace(html, "educationSection", educationSection);

    // --- 6. EXPERIENCE ---
    const experiences = resume.candidate_experience || [];
    let experienceSection = "";
    if (experiences.length) {
        const experienceItems = experiences
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
                const metaParts = [duration, location].filter(Boolean).join(" | ");

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
            <div class="experience_name">
              <h4>${escapeHtml(role)}</h4>
            </div>
            <div class="experience_date">
              <p>${escapeHtml(metaParts)}</p>
            </div>
          </div>
          <h4>${escapeHtml(company)}</h4>
          ${description}
        </div>`;
            })
            .join("");

        experienceSection = `
    <div class="experience">
      <h2>EXPERIENCE</h2>
      <div class="experience_info">
        ${experienceItems}
      </div>
    </div>`;
    }
    html = replace(html, "experienceSection", experienceSection);

    // --- 7. SKILLS ---
    const skillsList = resume.candidate_skills || [];
    let skillsSection = "";
    if (skillsList.length) {
        const skillItems = skillsList
            .map((skill: any) => {
                const name = skill.skillName || skill.name || "";
                return `<div class="skills_details"><p>${escapeHtml(name)}</p></div>`;
            })
            .join("");

        skillsSection = `
    <div class="skills">
      <h2>SKILLS</h2>
      <div class="skills_info">
        ${skillItems}
      </div>
    </div>`;
    }
    html = replace(html, "skillsSection", skillsSection);

    return html;
};