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

const LOCATION_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 19 19" fill="none"><path d="M14.0502 1.45707L2.39023 7.00907C0.797229 7.76807 0.896229 10.0681 2.54823 10.6881L5.28823 11.7151C5.55544 11.8153 5.79809 11.9716 5.9999 12.1734C6.2017 12.3752 6.35798 12.6179 6.45823 12.8851L7.48423 15.6241C8.10423 17.2771 10.4042 17.3751 11.1632 15.7821L16.7152 4.12307C17.5242 2.42207 15.7502 0.647071 14.0502 1.45707Z" stroke="black" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" /></svg>`;
const EMAIL_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 20 16" fill="none"><path d="M17.25 0H2.75C2.02106 0.00132174 1.32236 0.291477 0.806916 0.806916C0.291477 1.32236 0.00132174 2.02106 0 2.75V13.25C0.00132174 13.9789 0.291477 14.6776 0.806916 15.1931C1.32236 15.7085 2.02106 15.9987 2.75 16H17.25C17.9789 15.9987 18.6776 15.7085 19.1931 15.1931C19.7085 14.6776 19.9987 13.9789 20 13.25V2.75C19.9987 2.02106 19.7085 1.32236 19.1931 0.806916C18.6776 0.291477 17.9789 0.00132174 17.25 0ZM2.75 1.5H17.25C17.94 1.5 18.5 2.06 18.5 2.75V3.725L10 8.635L1.5 3.725V2.75C1.5 2.06 2.06 1.5 2.75 1.5ZM17.25 14.5H2.75C2.06 14.5 1.5 13.94 1.5 13.25V5.46L10 10.37L18.5 5.46V13.25C18.5 13.94 17.94 14.5 17.25 14.5Z" fill="black" /></svg>`;
const PHONE_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 20 19" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M2.48268 0.793489C3.70002 -0.416929 5.70439 -0.201471 6.7237 1.16011L7.9847 2.84451C8.8141 3.9524 8.7409 5.50081 7.7564 6.47972L7.5176 6.71714C7.5072 6.74743 7.4819 6.84264 7.51 7.02359C7.5732 7.43109 7.9135 8.29549 9.342 9.71589C10.77 11.1358 11.6405 11.4758 12.0538 11.5392C12.2411 11.5679 12.3391 11.5411 12.3694 11.5305L12.7774 11.1248C13.6526 10.2546 14.9975 10.0919 16.0811 10.681L17.9916 11.7196C19.6275 12.6089 20.0409 14.8326 18.7005 16.1653L17.28 17.5778C16.8324 18.0228 16.2305 18.3939 15.4959 18.4624C13.6869 18.6311 9.4687 18.4159 5.03659 14.0089C0.898677 9.89449 0.104617 6.30649 0.00414728 4.53866C-0.0466527 3.64475 0.375758 2.88845 0.913078 2.35418L2.48268 0.793489ZM5.52291 2.05905C5.01628 1.38231 4.072 1.3285 3.54032 1.85717L1.97072 3.41786C1.6408 3.74591 1.48206 4.10744 1.50173 4.45356C1.58156 5.85815 2.22286 9.09579 6.09423 12.9452C10.1557 16.9836 13.9069 17.1041 15.3567 16.9689C15.6529 16.9413 15.9475 16.7874 16.2224 16.5141L17.6429 15.1016C18.2204 14.5275 18.093 13.482 17.2752 13.0374L15.3647 11.9989C14.8371 11.7121 14.219 11.8067 13.835 12.1885L13.3796 12.6414L12.8508 12.1095C13.3796 12.6414 13.3789 12.6421 13.3782 12.6428L13.3767 12.6442L13.3736 12.6472L13.3671 12.6535L13.3525 12.6671C13.342 12.6767 13.3299 12.6872 13.3164 12.6985C13.2892 12.721 13.2558 12.7464 13.2159 12.7732C13.1358 12.8268 13.0301 12.8852 12.8972 12.9346C12.6264 13.0355 12.2692 13.0897 11.8264 13.0218C10.9596 12.8889 9.8114 12.2979 8.2844 10.7796C6.7579 9.26179 6.16194 8.11883 6.0277 7.25355C5.95906 6.8111 6.01381 6.4538 6.11594 6.18274C6.16599 6.0499 6.22497 5.94427 6.2791 5.86438C6.3061 5.82454 6.33179 5.79123 6.35446 5.76417C6.3658 5.75064 6.3764 5.73866 6.38604 5.72819L6.39977 5.71361L6.40606 5.70715L6.40905 5.70412L6.41051 5.70266C6.41122 5.70195 6.41194 5.70124 6.9408 6.23307L6.41194 5.70124L6.69875 5.41605C7.1274 4.98988 7.1874 4.28243 6.7839 3.74346L5.52291 2.05905Z" fill="black" /></svg>`;
const LINKEDIN_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M4 6C5.10457 6 6 5.10457 6 4C6 2.89543 5.10457 2 4 2C2.89543 2 2 2.89543 2 4C2 5.10457 2.89543 6 4 6Z" fill="black" /><path d="M4 10V20" stroke="black" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" /><path d="M10 10V20" stroke="black" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" /><path d="M10 15C10 12.24 12.24 10 15 10C17.76 10 20 12.24 20 15V20" stroke="black" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" /></svg>`;
const GITHUB_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 20 20" fill="none"><path d="M10 0C8.68678 0 7.38642 0.258658 6.17317 0.761205C4.95991 1.26375 3.85752 2.00035 2.92893 2.92893C1.05357 4.8043 0 7.34784 0 10C0 14.42 2.87 18.17 6.84 19.5C7.34 19.58 7.5 19.27 7.5 19V17.31C4.73 17.91 4.14 15.97 4.14 15.97C3.68 14.81 3.03 14.5 3.03 14.5C2.12 13.88 3.1 13.9 3.1 13.9C4.1 13.97 4.63 14.93 4.63 14.93C5.5 16.45 6.97 16 7.54 15.76C7.63 15.11 7.89 14.67 8.17 14.42C5.95 14.17 3.62 13.31 3.62 9.5C3.62 8.39 4 7.5 4.65 6.79C4.55 6.54 4.2 5.5 4.75 4.15C4.75 4.15 5.59 3.88 7.5 5.17C8.29 4.95 9.15 4.84 10 4.84C10.85 4.84 11.71 4.95 12.5 5.17C14.41 3.88 15.25 4.15 15.25 4.15C15.8 5.5 15.45 6.54 15.35 6.79C16 7.5 16.38 8.39 16.38 9.5C16.38 13.32 14.04 14.16 11.81 14.41C12.17 14.72 12.5 15.33 12.5 16.26V19C12.5 19.27 12.66 19.59 13.17 19.5C17.14 18.16 20 14.42 20 10C20 8.68678 19.7413 7.38642 19.2388 6.17317C18.7362 4.95991 17.9997 3.85752 17.0711 2.92893C16.1425 2.00035 15.0401 1.26375 13.8268 0.761205C12.6136 0.258658 11.3132 0 10 0Z" fill="black" /></svg>`;

function headerDetail(icon: string, content: string): string {
    return `<div class="header_details"><div class="header_icon">${icon}</div><div class="header_text">${content}</div></div>`;
}

export const renderClassic = (resume: any): string => {
    let html = loadTemplate("classic", "resumes");

    // --- 1. NAME ---
    const fullName = [resume.firstName, resume.lastName].filter(Boolean).join(" ");
    html = replace(html, "name", escapeHtml(fullName.toUpperCase()));

    // --- 2. TAGLINE (derived from most recent experience role, if present) ---
    const primaryExperience = (resume.candidate_experience || [])[0];
    const taglineJobName = primaryExperience?.jobTitle || primaryExperience?.role || "";
    const taglineCompanyName = primaryExperience?.companyName || primaryExperience?.company || "";
    let taglineText = "";
    if (taglineJobName && taglineCompanyName) {
        taglineText = `${escapeHtml(taglineJobName)} | ${escapeHtml(taglineCompanyName)}`;
    } else if (taglineJobName || taglineCompanyName) {
        taglineText = escapeHtml(taglineJobName || taglineCompanyName);
    }

    const tagline = taglineText ? `<p>${taglineText}</p>` : "";
    html = replace(html, "tagline", tagline);

    // --- 3. HEADER INFO (location, email, phone, linkedin, github) ---
    const headerInfoParts: string[] = [];

    const address = [resume.city, resume.state, resume.country].filter(Boolean).join(", ");
    if (address) {
        headerInfoParts.push(headerDetail(LOCATION_ICON, `<p>${escapeHtml(address)}</p>`));
    }
    if (resume.email) {
        headerInfoParts.push(headerDetail(EMAIL_ICON, `<a href="mailto:${escapeHtml(resume.email)}">${escapeHtml(resume.email)}</a>`));
    }
    if (resume.phone) {
        headerInfoParts.push(headerDetail(PHONE_ICON, `<a href="tel:${escapeHtml(resume.phone)}">${escapeHtml(resume.phone)}</a>`));
    }
    if (resume.linkedin) {
        headerInfoParts.push(headerDetail(LINKEDIN_ICON, `<a href="${escapeHtml(resume.linkedin)}" target="_blank">LinkedIn</a>`));
    }
    if (resume.github) {
        headerInfoParts.push(headerDetail(GITHUB_ICON, `<a href="${escapeHtml(resume.github)}" target="_blank">GitHub</a>`));
    }

    html = replace(html, "headerInfo", headerInfoParts.join(""));

    // --- 4. SUMMARY ---
    const summary = resume.resume_builder?.summary
        ? `<p>${nl2br(escapeHtml(resume.resume_builder.summary))}</p>`
        : "";
    html = replace(html, "summary", summary);

    // --- 5. EDUCATION ---
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

    // --- 6. EXPERIENCE ---
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