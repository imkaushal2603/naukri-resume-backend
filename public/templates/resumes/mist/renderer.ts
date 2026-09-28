import { escapeHtml, nl2br, normalizeUrl } from "../../../../src/helpers/templates/html.helper";
import { loadTemplate, replace } from "../../../../src/helpers/templates/template.helper";
import { SERVER_URL } from "../../../../src/config/environment.config";

const CHECK_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M16.3831 8.27344H15.2839C15.0448 8.27344 14.8175 8.38828 14.6769 8.58516L10.9925 13.6945L9.32373 11.3789C9.18311 11.1844 8.95811 11.0672 8.7167 11.0672H7.61748C7.46514 11.0672 7.37608 11.2406 7.46514 11.3648L10.3855 15.4148C10.4544 15.5111 10.5454 15.5896 10.6508 15.6437C10.7561 15.6978 10.8729 15.7261 10.9913 15.7261C11.1098 15.7261 11.2265 15.6978 11.3319 15.6437C11.4372 15.5896 11.5282 15.5111 11.5972 15.4148L16.5331 8.57109C16.6245 8.44688 16.5355 8.27344 16.3831 8.27344Z" fill="#172B3A" /><path d="M12 1.5C6.20156 1.5 1.5 6.20156 1.5 12C1.5 17.7984 6.20156 22.5 12 22.5C17.7984 22.5 22.5 17.7984 22.5 12C22.5 6.20156 17.7984 1.5 12 1.5ZM12 20.7188C7.18594 20.7188 3.28125 16.8141 3.28125 12C3.28125 7.18594 7.18594 3.28125 12 3.28125C16.8141 3.28125 20.7188 7.18594 20.7188 12C20.7188 16.8141 16.8141 20.7188 12 20.7188Z" fill="#172B3A" /></svg>`;
const PHONE_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none"><path d="M16.7364 20.8316H17.101C17.5906 20.8108 18.0385 20.5608 18.3197 20.165L20.5489 16.9462C20.7885 16.6025 20.8822 16.1754 20.7989 15.7587C20.7156 15.3421 20.476 14.9879 20.1322 14.7483L15.2989 11.5296C15.0434 11.3578 14.7421 11.2671 14.4343 11.2691C14.0072 11.2691 13.5906 11.4358 13.2885 11.7691L11.7572 13.4254C11.0385 12.9775 10.0801 12.3108 9.29889 11.5296C8.54889 10.7796 7.8718 9.82122 7.40305 9.07122L9.0593 7.53997C9.6218 7.01914 9.72597 6.16497 9.29889 5.52955L6.08014 0.69622C5.85097 0.35247 5.48639 0.10247 5.06972 0.0295532C4.86683 -0.0110383 4.65779 -0.00980302 4.4554 0.0331834C4.25301 0.0761697 4.06151 0.160003 3.89264 0.279553L0.673886 2.50872C0.267636 2.78997 0.028053 3.23789 0.0072197 3.72747C-0.0240303 4.44622 -0.159447 10.915 4.88222 15.9566C9.41347 20.4879 15.101 20.8421 16.7364 20.8421V20.8316ZM5.08014 8.38372C4.91347 8.53997 4.86139 8.78997 4.96555 8.9983C5.01764 9.09205 6.16347 11.3316 7.81972 12.9983C9.48639 14.665 11.726 15.8108 11.8197 15.8629C12.0281 15.9671 12.2781 15.9254 12.4343 15.7483L14.5072 13.5087L18.5281 16.1858L16.7572 18.7483C15.5489 18.7483 10.3718 18.4983 6.35097 14.4775C2.33014 10.4566 2.08014 5.26914 2.08014 4.07122L4.64264 2.30039L7.31972 6.32122L5.08014 8.39414V8.38372Z" fill="#172B3A" /></svg>`;
const EMAIL_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none"><path d="M19.7904 4.1665H5.20703C4.37823 4.1665 3.58337 4.49574 2.99732 5.0818C2.41127 5.66785 2.08203 6.4627 2.08203 7.2915V17.7082C2.08203 18.537 2.41127 19.3318 2.99732 19.9179C3.58337 20.5039 4.37823 20.8332 5.20703 20.8332H19.7904C20.6192 20.8332 21.414 20.5039 22.0001 19.9179C22.5861 19.3318 22.9154 18.537 22.9154 17.7082V7.2915C22.9154 6.4627 22.5861 5.66785 22.0001 5.0818C21.414 4.49574 20.6192 4.1665 19.7904 4.1665ZM19.0924 6.24984L12.4987 11.1978L5.90495 6.24984H19.0924ZM19.7904 18.7498H5.20703C4.93076 18.7498 4.66581 18.6401 4.47046 18.4447C4.27511 18.2494 4.16536 17.9844 4.16536 17.7082V7.55192L11.8737 13.3332C12.054 13.4684 12.2733 13.5415 12.4987 13.5415C12.7241 13.5415 12.9434 13.4684 13.1237 13.3332L20.832 7.55192V17.7082C20.832 17.9844 20.7223 18.2494 20.5269 18.4447C20.3316 18.6401 20.0666 18.7498 19.7904 18.7498Z" fill="#172B3A" /></svg>`;
const LOCATION_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="19" height="23" viewBox="0 0 19 23" fill="none"><path d="M9.33203 12.4585C11.0579 12.4585 12.457 11.0594 12.457 9.3335C12.457 7.60761 11.0579 6.2085 9.33203 6.2085C7.60614 6.2085 6.20703 7.60761 6.20703 9.3335C6.20703 11.0594 7.60614 12.4585 9.33203 12.4585Z" stroke="#172B3A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /><path d="M3.44078 3.44078C5.00358 1.87797 7.1232 1 9.33333 1C11.5435 1 13.6631 1.87797 15.2259 3.44078C16.7887 5.00358 17.6667 7.1232 17.6667 9.33333C17.6667 11.3042 17.2479 12.5938 16.1042 14.0208L9.33333 21.8333L2.5625 14.0208C1.41875 12.5938 1 11.3042 1 9.33333C1 7.1232 1.87797 5.00358 3.44078 3.44078Z" stroke="#172B3A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>`;
const LINKEDIN_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none"><path d="M15.7812 8.75004C14.9829 8.7473 14.1918 8.90201 13.4533 9.20532C12.7147 9.50864 12.0433 9.9546 11.4773 10.5177C10.9113 11.0808 10.4619 11.75 10.1548 12.4869C9.84764 13.2239 9.68886 14.0142 9.6875 14.8125V20.9375C9.6875 21.1862 9.78627 21.4246 9.96209 21.6005C10.1379 21.7763 10.3764 21.875 10.625 21.875H12.8125C13.0611 21.875 13.2996 21.7763 13.4754 21.6005C13.6512 21.4246 13.75 21.1862 13.75 20.9375V14.8125C13.7498 14.5286 13.8094 14.2478 13.925 13.9884C14.0406 13.729 14.2096 13.497 14.4209 13.3073C14.6322 13.1176 14.8811 12.9746 15.1514 12.8875C15.4217 12.8005 15.7073 12.7714 15.9896 12.8021C16.4958 12.8659 16.9611 13.1132 17.2971 13.4972C17.6331 13.8812 17.8165 14.3752 17.8125 14.8855V20.9375C17.8125 21.1862 17.9113 21.4246 18.0871 21.6005C18.2629 21.7763 18.5014 21.875 18.75 21.875H20.9375C21.1861 21.875 21.4246 21.7763 21.6004 21.6005C21.7762 21.4246 21.875 21.1862 21.875 20.9375V14.8125C21.8736 14.0142 21.7149 13.2239 21.4077 12.4869C21.1006 11.75 20.6512 11.0808 20.0852 10.5177C19.5192 9.9546 18.8478 9.50864 18.1092 9.20532C17.3707 8.90201 16.5796 8.7473 15.7812 8.75004Z" fill="#172B3A" /><path d="M6.875 9.6875H4.0625C3.54473 9.6875 3.125 10.1072 3.125 10.625V20.9375C3.125 21.4553 3.54473 21.875 4.0625 21.875H6.875C7.39277 21.875 7.8125 21.4553 7.8125 20.9375V10.625C7.8125 10.1072 7.39277 9.6875 6.875 9.6875Z" fill="#172B3A" /><path d="M5.46875 7.8125C6.76317 7.8125 7.8125 6.76317 7.8125 5.46875C7.8125 4.17433 6.76317 3.125 5.46875 3.125C4.17433 3.125 3.125 4.17433 3.125 5.46875C3.125 6.76317 4.17433 7.8125 5.46875 7.8125Z" fill="#172B3A" /></svg>`;
const GITHUB_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 20 20" fill="none"><path d="M10 0C8.68678 0 7.38642 0.258658 6.17317 0.761205C4.95991 1.26375 3.85752 2.00035 2.92893 2.92893C1.05357 4.8043 0 7.34784 0 10C0 14.42 2.87 18.17 6.84 19.5C7.34 19.58 7.5 19.27 7.5 19V17.31C4.73 17.91 4.14 15.97 4.14 15.97C3.68 14.81 3.03 14.5 3.03 14.5C2.12 13.88 3.1 13.9 3.1 13.9C4.1 13.97 4.63 14.93 4.63 14.93C5.5 16.45 6.97 16 7.54 15.76C7.63 15.11 7.89 14.67 8.17 14.42C5.95 14.17 3.62 13.31 3.62 9.5C3.62 8.39 4 7.5 4.65 6.79C4.55 6.54 4.2 5.5 4.75 4.15C4.75 4.15 5.59 3.88 7.5 5.17C8.29 4.95 9.15 4.84 10 4.84C10.85 4.84 11.71 4.95 12.5 5.17C14.41 3.88 15.25 4.15 15.25 4.15C15.8 5.5 15.45 6.54 15.35 6.79C16 7.5 16.38 8.39 16.38 9.5C16.38 13.32 14.04 14.16 11.81 14.41C12.17 14.72 12.5 15.33 12.5 16.26V19C12.5 19.27 12.66 19.59 13.17 19.5C17.14 18.16 20 14.42 20 10C20 8.68678 19.7413 7.38642 19.2388 6.17317C18.7362 4.95991 17.9997 3.85752 17.0711 2.92893C16.1425 2.00035 15.0401 1.26375 13.8268 0.761205C12.6136 0.258658 11.3132 0 10 0Z" fill="#172B3A" /></svg>`;

const getYear = (dateVal: any): string => {
    if (!dateVal) return "";
    const date = new Date(dateVal);
    return isNaN(date.getTime()) ? "" : String(date.getUTCFullYear());
};

const iconLine = (text: string): string =>
    `<div class="icon-txt"><div class="icon">${CHECK_ICON}</div><p>${escapeHtml(text)}</p></div>`;

export const renderMist = (resume: any): string => {
    let html = loadTemplate("mist", "resumes");

    // --- NAME + PHOTO ---
    const fullName = [resume.firstName, resume.lastName].filter(Boolean).join(" ");
    html = replace(html, "name", escapeHtml(fullName));
    const photoUrl = resume.photoUrl ? `${SERVER_URL}${resume.photoUrl}` : "";
    html = replace(html, "photoUrl", photoUrl);

    // --- TAGLINE ---
    const primaryExperience = (resume.candidate_experience || [])[0];
    const taglineText = primaryExperience?.jobTitle || primaryExperience?.role || "";
    html = replace(html, "tagline", taglineText ? `<h6>${escapeHtml(taglineText.toUpperCase())}</h6>` : "");

    // --- SUMMARY ---
    const summary = resume.resume_builder?.summary
        ? `<p>${nl2br(escapeHtml(resume.resume_builder.summary))}</p>`
        : "";
    html = replace(html, "summary", summary);

    // --- CONTACT ---
    const contactParts: string[] = [];
    if (resume.phone) contactParts.push(`<p>${PHONE_ICON}<a href="tel:${escapeHtml(resume.phone)}">${escapeHtml(resume.phone)}</a></p>`);
    if (resume.email) contactParts.push(`<p>${EMAIL_ICON}<a href="mailto:${escapeHtml(resume.email)}">${escapeHtml(resume.email)}</a></p>`);
    const address = [resume.city, resume.state, resume.country].filter(Boolean).join(", ");
    if (address) contactParts.push(`<p>${LOCATION_ICON}${escapeHtml(address)}</p>`);
    if (resume.linkedin) contactParts.push(`<p>${LINKEDIN_ICON}<a href="${escapeHtml(normalizeUrl(resume.linkedin))}" target="_blank">LinkedIn</a></p>`);
    if (resume.github) contactParts.push(`<p>${GITHUB_ICON}<a href="${escapeHtml(normalizeUrl(resume.github))}" target="_blank">GitHub</a></p>`);
    html = replace(html, "contact", contactParts.join(""));

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

            const companyLine = [company, location].filter(Boolean).join(" | ");

            const bullets = exp.description
                ? exp.description
                    .split(/\r?\n/)
                    .map((line: string) => line.trim().replace(/^[•\-*]\s*/, ""))
                    .filter(Boolean)
                    .map((line: string) => iconLine(line))
                    .join("")
                : "";

            return `
<div class="details">
    <div class="year-position">
        <div class="year"><h6>${escapeHtml(years)}</h6></div>
        <div class="position"><h5>${escapeHtml(role)}</h5></div>
    </div>
    ${companyLine ? `<h4>${escapeHtml(companyLine)}</h4>` : ""}
    ${bullets}
</div>`;
        })
        .join("");
    html = replace(html, "experience", experienceHtml);

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

            const location = edu.address || edu.city || "";
            const gradeVal = edu.grade || edu.gpa;

            const extraLines: string[] = [];
            if (level) extraLines.push(iconLine(level));
            if (location) extraLines.push(iconLine(location));
            if (gradeVal) extraLines.push(iconLine(`CGPA: ${gradeVal}`));

            return `
<div class="details">
    <div class="year-position">
        <div class="year"><h6>${escapeHtml(years)}</h6></div>
        <div class="position"><h5>${escapeHtml(degree)}</h5></div>
    </div>
    ${institute ? `<h4>${escapeHtml(institute)}</h4>` : ""}
    ${extraLines.join("")}
</div>`;
        })
        .join("");
    html = replace(html, "education", educationHtml);

    // --- SKILLS ---
    const skillsList = resume.candidate_skills || [];
    const skillsHtml = skillsList
        .map((skill: any) => iconLine(skill.skillName || skill.name || ""))
        .join("");
    html = replace(html, "skills", skillsHtml);

    return html;
};