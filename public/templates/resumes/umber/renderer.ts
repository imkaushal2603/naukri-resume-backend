import { escapeHtml, nl2br } from "../../../../src/helpers/templates/html.helper";
import { loadTemplate, replace } from "../../../../src/helpers/templates/template.helper";
import { SERVER_URL } from "../../../../src/config/environment.config";

const PHONE_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 20 20" fill="none"><path d="M5.82888 14.1715C3.67828 12.0167 2.02439 9.41816 0.982877 6.55751C0.409877 4.99351 0.934877 3.27551 2.11288 2.09751L2.84188 1.36951C3.03786 1.17313 3.27066 1.01733 3.52693 0.911022C3.78321 0.804718 4.05793 0.75 4.33538 0.75C4.61282 0.75 4.88755 0.804718 5.14382 0.911022C5.4001 1.01733 5.63289 1.17313 5.82888 1.36951L7.53588 3.07651C7.73226 3.2725 7.88806 3.50529 7.99437 3.76157C8.10067 4.01784 8.15539 4.29256 8.15539 4.57001C8.15539 4.84746 8.10067 5.12218 7.99437 5.37846C7.88806 5.63473 7.73226 5.86752 7.53588 6.06351L7.11588 6.48351C6.94776 6.65159 6.8144 6.85114 6.72342 7.07076C6.63243 7.29039 6.5856 7.52579 6.5856 7.76351C6.5856 8.00124 6.63243 8.23663 6.72342 8.45626C6.8144 8.67588 6.94776 8.87543 7.11588 9.04351L10.9559 12.8845C11.124 13.0526 11.3235 13.186 11.5431 13.277C11.7628 13.368 11.9982 13.4148 12.2359 13.4148C12.4736 13.4148 12.709 13.368 12.9286 13.277C13.1482 13.186 13.3478 13.0526 13.5159 12.8845L13.9369 12.4645C14.1329 12.2681 14.3657 12.1123 14.6219 12.006C14.8782 11.8997 15.1529 11.845 15.4304 11.845C15.7078 11.845 15.9825 11.8997 16.2388 12.006C16.4951 12.1123 16.7279 12.2681 16.9239 12.4645L18.6309 14.1715C18.8273 14.3675 18.9831 14.6003 19.0894 14.8566C19.1957 15.1128 19.2504 15.3876 19.2504 15.665C19.2504 15.9425 19.1957 16.2172 19.0894 16.4735C18.9831 16.7297 18.8273 16.9625 18.6309 17.1585L17.9029 17.8865C16.7249 19.0655 15.0069 19.5905 13.4429 19.0175C10.5822 17.976 7.98364 16.3221 5.82888 14.1715Z" stroke="#D0C7C3" stroke-width="1.5" stroke-linejoin="round" /></svg>`;
const LOCATION_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 18 18" fill="none"><path d="M13.5493 0.955118L1.88925 6.50712C0.296253 7.26612 0.395253 9.56612 2.04725 10.1861L4.78725 11.2131C5.05446 11.3134 5.29712 11.4696 5.49892 11.6715C5.70072 11.8733 5.857 12.1159 5.95725 12.3831L6.98325 15.1221C7.60325 16.7751 9.90325 16.8731 10.6623 15.2801L16.2143 3.62112C17.0233 1.92012 15.2493 0.145118 13.5493 0.955118Z" stroke="#D0C7C3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>`;
const EMAIL_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 20 17" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M2.75 0H17.25C17.9789 0.00132174 18.6776 0.291477 19.1931 0.806916C19.7085 1.32236 19.9987 2.02106 20 2.75V9.5H18.5V5.46L10 10.37L1.5 5.46V13.25C1.5 13.94 2.06 14.5 2.75 14.5H12.5V16H2.75C2.02106 15.9987 1.32236 15.7085 0.806916 15.1931C0.291477 14.6776 0.00132174 13.9789 0 13.25V2.75C0.00132174 2.02106 0.291477 1.32236 0.806916 0.806916C1.32236 0.291477 2.02106 0.00132174 2.75 0ZM1.5 3.725L10 8.635V8.63L18.5 3.725V2.75C18.5 2.06 17.94 1.5 17.25 1.5H2.75C2.06 1.5 1.5 2.06 1.5 2.75V3.725ZM20 14C20 14.7956 19.6839 15.5587 19.1213 16.1213C18.5587 16.6839 17.7956 17 17 17C16.2044 17 15.4413 16.6839 14.8787 16.1213C14.3161 15.5587 14 14.7956 14 14C14 13.2044 14.3161 12.4413 14.8787 11.8787C15.4413 11.3161 16.2044 11 17 11C17.7956 11 18.5587 11.3161 19.1213 11.8787C19.6839 12.4413 20 13.2044 20 14Z" fill="#D0C7C3" /></svg>`;
const LINKEDIN_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 20 20" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.429 6.969H11.143V8.819C11.678 7.755 13.05 6.799 15.111 6.799C19.062 6.799 20 8.917 20 12.803V20H16V13.688C16 11.475 15.465 10.227 14.103 10.227C12.214 10.227 11.429 11.572 11.429 13.687V20H7.429V6.969ZM0.57 19.83H4.57V6.799H0.57V19.83ZM5.143 2.55C5.14315 2.88528 5.07666 3.21724 4.94739 3.52659C4.81812 3.83594 4.62865 4.11651 4.39 4.352C4.15064 4.59012 3.86671 4.77874 3.55442 4.90708C3.24214 5.03543 2.90763 5.10098 2.57 5.1C1.8896 5.09847 1.23691 4.83029 0.752 4.353C0.5143 4.11665 0.325532 3.83575 0.196496 3.52637C0.0674603 3.21699 0.000688218 2.88521 0 2.55C0 1.873 0.27 1.225 0.753 0.747001C1.2367 0.267882 1.89018 -0.000624124 2.571 1.0894e-06C3.253 1.0894e-06 3.907 0.269001 4.39 0.747001C4.873 1.225 5.143 1.873 5.143 2.55Z" fill="#D0C7C3" /></svg>`;
const GITHUB_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 19 20" fill="none"><path d="M1 14.0074C2.5 14.5074 2.5 17.5074 6 17.0074L7 16.8074M13 19.0074V16.0074C13 15.1474 12.637 14.3714 12.057 13.8244C12.0554 13.8232 12.0541 13.8215 12.0535 13.8196C12.0528 13.8177 12.0528 13.8156 12.0533 13.8137C12.0538 13.8117 12.055 13.81 12.0565 13.8087C12.0581 13.8074 12.06 13.8066 12.062 13.8064C15.48 13.1244 18 10.7874 18 8.00839C18 6.74639 17.48 5.57539 16.594 4.60939C16.5928 4.60806 16.592 4.60643 16.5916 4.60467C16.5913 4.60291 16.5914 4.60109 16.592 4.59939C17.224 3.06239 16.64 1.07939 16.496 1.00839C16.357 0.938394 14.539 1.29639 13.046 2.45339C13.0448 2.45442 13.0433 2.45514 13.0417 2.45549C13.0402 2.45584 13.0386 2.45581 13.037 2.45539C12.0527 2.15519 11.029 2.00418 10 2.00739C8.924 2.00739 7.897 2.16739 6.96 2.45639C6.95845 2.45681 6.95682 2.45684 6.95526 2.45649C6.95369 2.45614 6.95223 2.45542 6.951 2.45439C5.458 1.29739 3.64 0.938394 3.5 1.00839C3.356 1.08039 2.772 3.06539 3.405 4.60139C3.40559 4.60309 3.40572 4.60491 3.40537 4.60667C3.40502 4.60843 3.4042 4.61006 3.403 4.61139C2.518 5.57739 2 6.74739 2 8.00939C2 10.7884 4.52 13.1254 7.938 13.8074C7.94002 13.8076 7.94193 13.8084 7.94348 13.8097C7.94503 13.811 7.94615 13.8127 7.94669 13.8147C7.94724 13.8166 7.94717 13.8187 7.94651 13.8206C7.94585 13.8225 7.94463 13.8242 7.943 13.8254C7.64546 14.1057 7.40833 14.4438 7.24617 14.819C7.08401 15.1942 7.00024 15.5986 7 16.0074V19.0074" stroke="#D0C7C3" stroke-width="2" stroke-linecap="round" /></svg>`;

function headerDetail(icon: string, content: string): string {
    return `<div class="header_details">${icon}${content}</div>`;
}

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

export const renderUmber = (resume: any): string => {
    let html = loadTemplate("umber", "resumes");

    // --- NAME + PHOTO ---
    const fullName = [resume.firstName, resume.lastName].filter(Boolean).join(" ");
    html = replace(html, "name", escapeHtml(fullName));
    const photoUrl = resume.photoUrl ? `${SERVER_URL}${resume.photoUrl}` : "";
    html = replace(html, "photoUrl", photoUrl);

    // --- TAGLINE ---
    const primaryExperience = (resume.candidate_experience || [])[0];
    const taglineText = primaryExperience?.jobTitle || primaryExperience?.role || "";
    html = replace(html, "tagline", taglineText ? `<h4>${escapeHtml(taglineText)}</h4>` : "");

    // --- HEADER INFO ---
    const headerInfoParts: string[] = [];
    if (resume.phone) {
        headerInfoParts.push(headerDetail(PHONE_ICON, `<a href="tel:${escapeHtml(resume.phone)}">${escapeHtml(resume.phone)}</a>`));
    }
    const address = [resume.city, resume.state, resume.country].filter(Boolean).join(", ");
    if (address) {
        headerInfoParts.push(headerDetail(LOCATION_ICON, `<p>${escapeHtml(address)}</p>`));
    }
    if (resume.email) {
        headerInfoParts.push(headerDetail(EMAIL_ICON, `<a href="mailto:${escapeHtml(resume.email)}">${escapeHtml(resume.email)}</a>`));
    }
    if (resume.linkedin) {
        headerInfoParts.push(headerDetail(LINKEDIN_ICON, `<a href="${escapeHtml(resume.linkedin)}" target="_blank">LinkedIn</a>`));
    }
    if (resume.github) {
        headerInfoParts.push(headerDetail(GITHUB_ICON, `<a href="${escapeHtml(resume.github)}" target="_blank">Github</a>`));
    }
    html = replace(html, "headerInfo", headerInfoParts.join(""));

    // --- SUMMARY ---
    const summary = resume.resume_builder?.summary
        ? `<p>${nl2br(escapeHtml(resume.resume_builder.summary))}</p>`
        : "";
    html = replace(html, "summary", summary);

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

            return `
<div class="education_details">
    <h4>${escapeHtml(degree)}</h4>
    <h4>${escapeHtml(institute)}</h4>
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
    <div class="experience_content">
        <div class="experience_name">
            <h4>${escapeHtml(role)}</h4>
            <h4>${escapeHtml(company)}</h4>
        </div>
        <div class="experience_date">
            ${metaLine ? `<p>${escapeHtml(metaLine)}</p>` : ""}
        </div>
    </div>
    ${description}
</div>`;
        })
        .join("");
    html = replace(html, "experience", experienceHtml);

    return html;
};