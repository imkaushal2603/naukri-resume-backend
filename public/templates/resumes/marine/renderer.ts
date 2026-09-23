import { escapeHtml, nl2br } from "../../../../src/helpers/templates/html.helper";
import { loadTemplate, replace } from "../../../../src/helpers/templates/template.helper";
import { SERVER_URL } from "../../../../src/config/environment.config";

const LINKEDIN_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 20 18" fill="none"><path d="M4 2.001C3.99974 2.53143 3.78877 3.04004 3.41351 3.41492C3.03825 3.78981 2.52943 4.00027 1.999 4C1.46857 3.99974 0.959965 3.78877 0.585079 3.41351C0.210194 3.03825 -0.000264966 2.52943 2.50361e-07 1.999C0.000265467 1.46857 0.211233 0.959965 0.586494 0.585079C0.961754 0.210194 1.47057 -0.000264966 2.001 2.50361e-07C2.53143 0.000265467 3.04004 0.211233 3.41492 0.586494C3.78981 0.961754 4.00027 1.47057 4 2.001ZM4.06 5.481H0.0600002V18.001H4.06V5.481ZM10.38 5.481H6.4V18.001H10.34V11.431C10.34 7.771 15.11 7.431 15.11 11.431V18.001H19.06V10.071C19.06 3.901 12 4.131 10.34 7.161L10.38 5.481Z" fill="#000024" /></svg>`;
const GITHUB_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 19 20" fill="none"><path d="M1 14.0074C2.5 14.5074 2.5 17.5074 6 17.0074L7 16.8074M13 19.0074V16.0074C13 15.1474 12.637 14.3714 12.057 13.8244C12.0554 13.8232 12.0541 13.8215 12.0535 13.8196C12.0528 13.8177 12.0528 13.8156 12.0533 13.8137C12.0538 13.8117 12.055 13.81 12.0565 13.8087C12.0581 13.8074 12.06 13.8066 12.062 13.8064C15.48 13.1244 18 10.7874 18 8.00839C18 6.74639 17.48 5.57539 16.594 4.60939C16.5928 4.60806 16.592 4.60643 16.5916 4.60467C16.5913 4.60291 16.5914 4.60109 16.592 4.59939C17.224 3.06239 16.64 1.07939 16.496 1.00839C16.357 0.938394 14.539 1.29639 13.046 2.45339C13.0448 2.45442 13.0433 2.45514 13.0417 2.45549C13.0402 2.45584 13.0386 2.45581 13.037 2.45539C12.0527 2.15519 11.029 2.00418 10 2.00739C8.924 2.00739 7.897 2.16739 6.96 2.45639C6.95845 2.45681 6.95682 2.45684 6.95526 2.45649C6.95369 2.45614 6.95223 2.45542 6.951 2.45439C5.458 1.29739 3.64 0.938394 3.5 1.00839C3.356 1.08039 2.772 3.06539 3.405 4.60139C3.40559 4.60309 3.40572 4.60491 3.40537 4.60667C3.40502 4.60843 3.4042 4.61006 3.403 4.61139C2.518 5.57739 2 6.74739 2 8.00939C2 10.7884 4.52 13.1254 7.938 13.8074C7.94002 13.8076 7.94193 13.8084 7.94348 13.8097C7.94503 13.811 7.94615 13.8127 7.94669 13.8147C7.94724 13.8166 7.94717 13.8187 7.94651 13.8206C7.94585 13.8225 7.94463 13.8242 7.943 13.8254C7.64546 14.1057 7.40833 14.4438 7.24617 14.819C7.08401 15.1942 7.00024 15.5986 7 16.0074V19.0074" stroke="#000024" stroke-width="2" stroke-linecap="round" /></svg>`;

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

export const renderMarine = (resume: any): string => {
    let html = loadTemplate("marine", "resumes");

    // --- NAME + PHOTO ---
    const fullName = [resume.firstName, resume.lastName].filter(Boolean).join(" ");
    html = replace(html, "name", escapeHtml(fullName.toUpperCase()));
    const photoUrl = resume.photoUrl ? `${SERVER_URL}${resume.photoUrl}` : "";
    html = replace(html, "photoUrl", photoUrl);

    // --- TAGLINE (occupation) ---
    const primaryExperience = (resume.candidate_experience || [])[0];
    const taglineText = primaryExperience?.jobTitle || primaryExperience?.role || "";
    html = replace(html, "tagline", taglineText ? `<h3>${escapeHtml(taglineText.toUpperCase())}</h3>` : "");

    // --- SOCIAL LINKS (linkedin, github icons in top-right) ---
    const socialParts: string[] = [];
    if (resume.linkedin) {
        socialParts.push(`<div class="header_details"><a href="${escapeHtml(resume.linkedin)}" target="_blank">${LINKEDIN_ICON}</a></div>`);
    }
    if (resume.github) {
        socialParts.push(`<div class="header_details"><a href="${escapeHtml(resume.github)}" target="_blank">${GITHUB_ICON}</a></div>`);
    }
    html = replace(html, "socialLinks", socialParts.join(""));

    // --- SUMMARY ---
    const summary = resume.resume_builder?.summary
        ? `<p>${nl2br(escapeHtml(resume.resume_builder.summary))}</p>`
        : "";
    html = replace(html, "summary", summary);

    // --- CONTACT (phone, email, location) ---
    const contactParts: string[] = [];
    if (resume.phone) {
        contactParts.push(`<div class="header_details"><p>P: <a href="tel:${escapeHtml(resume.phone)}">${escapeHtml(resume.phone)}</a></p></div>`);
    }
    if (resume.email) {
        contactParts.push(`<div class="header_details"><p>E: <a href="mailto:${escapeHtml(resume.email)}">${escapeHtml(resume.email)}</a></p></div>`);
    }
    const address = [resume.city, resume.state, resume.country].filter(Boolean).join(", ");
    if (address) {
        contactParts.push(`<div class="header_details"><p>${escapeHtml(address)}</p></div>`);
    }
    html = replace(html, "contact", contactParts.join(""));

    // --- SKILLS ---
    const skillsList = resume.candidate_skills || [];
    const skillsHtml = skillsList
        .map((skill: any) => `<div class="skills_details"><p>${escapeHtml(skill.skillName || skill.name || "")}</p></div>`)
        .join("");
    html = replace(html, "skills", skillsHtml);

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
            const titleLine = [degree, institute].filter(Boolean).join(" | ");

            return `
<div class="degree_details">
    <h4>${escapeHtml(degree)} | <span>${escapeHtml(institute)}</span></h4>
    ${metaLine ? `<p>${escapeHtml(metaLine)}</p>` : ""}
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
            const isCurrent = exp.isCurrent ?? !exp.endYear;

            const startMonth = exp.startMonth ?? getMonth(exp.startDate);
            const startYear = exp.startYear ?? getYear(exp.startDate);
            const endMonth = exp.endMonth ?? getMonth(exp.endDate);
            const endYear = exp.endYear ?? getYear(exp.endDate);

            const start = [startMonth, startYear].filter(Boolean).join("/");
            const end = isCurrent ? "Present" : [endMonth, endYear].filter(Boolean).join("/");
            const duration = start ? `${start} – ${end}` : end;

            const location = exp.location || "";
            const metaLine = [company, location, duration].filter(Boolean).join(" | ");

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
    <h4>${escapeHtml(role)} | <span>${escapeHtml(metaLine)}</span></h4>
    ${description}
</div>`;
        })
        .join("");
    html = replace(html, "experience", experienceHtml);

    return html;
};