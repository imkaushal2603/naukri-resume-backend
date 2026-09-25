import { escapeHtml, nl2br } from "../../../../src/helpers/templates/html.helper";
import { loadTemplate, replace } from "../../../../src/helpers/templates/template.helper";
import { SERVER_URL } from "../../../../src/config/environment.config";

const LINKEDIN_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="27" viewBox="0 0 28 27" fill="none"><path d="M5.83333 2.91813C5.83295 3.69167 5.52528 4.43339 4.97803 4.98009C4.43078 5.5268 3.68876 5.83372 2.91521 5.83333C2.14166 5.83295 1.39995 5.52529 0.853241 4.97803C0.306533 4.43078 -0.000386409 3.68876 3.6511e-07 2.91521C0.000387139 2.14166 0.308049 1.39995 0.855303 0.853241C1.40256 0.306533 2.14458 -0.000386409 2.91813 3.6511e-07C3.69167 0.000387139 4.43339 0.308049 4.98009 0.855303C5.5268 1.40256 5.83372 2.14458 5.83333 2.91813ZM5.92083 7.99312H0.0875003V26.2515H5.92083V7.99312ZM15.1375 7.99312H9.33333V26.2515H15.0792V16.6702C15.0792 11.3327 22.0354 10.8369 22.0354 16.6702V26.2515H27.7958V14.6869C27.7958 5.68896 17.5 6.02438 15.0792 10.4431L15.1375 7.99312Z" fill="#000" /></svg>`;
const GITHUB_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none"><path d="M10.4906 8.77646e-07C4.69453 -0.00234287 0 4.68984 0 10.4813C0 15.0609 2.93672 18.9539 7.02656 20.3836C7.57734 20.5219 7.49297 20.1305 7.49297 19.8633V18.0469C4.3125 18.4195 4.18359 16.3148 3.97031 15.9633C3.53906 15.2273 2.51953 15.0398 2.82422 14.6883C3.54844 14.3156 4.28672 14.782 5.14219 16.0453C5.76094 16.9617 6.96797 16.807 7.57969 16.6547C7.71328 16.1039 7.99922 15.6117 8.39297 15.2297C5.09766 14.6391 3.72422 12.6281 3.72422 10.2375C3.72422 9.07734 4.10625 8.01094 4.85625 7.15078C4.37813 5.73281 4.90078 4.51875 4.97109 4.33828C6.33281 4.21641 7.74844 5.31328 7.85859 5.4C8.63203 5.19141 9.51563 5.08125 10.5047 5.08125C11.4984 5.08125 12.3844 5.19609 13.1648 5.40703C13.4297 5.20547 14.7422 4.26328 16.0078 4.37813C16.0758 4.55859 16.5867 5.74453 16.1367 7.14375C16.8961 8.00625 17.2828 9.08203 17.2828 10.2445C17.2828 12.6398 15.9 14.6531 12.5953 15.2344C12.8784 15.5127 13.1031 15.8447 13.2564 16.2109C13.4098 16.5771 13.4886 16.9702 13.4883 17.3672V20.0039C13.507 20.2148 13.4883 20.4234 13.8398 20.4234C17.9906 19.0242 20.9789 15.1031 20.9789 10.4836C20.9789 4.68984 16.282 8.77646e-07 10.4906 8.77646e-07Z" fill="black" /></svg>`;
const PHONE_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" viewBox="0 0 29 29" fill="none"><path d="M22.7615 28.331H23.2573C23.9232 28.3027 24.5323 27.9627 24.9148 27.4244L27.9465 23.0469C28.2723 22.5794 28.3998 21.9985 28.2865 21.4319C28.1732 20.8652 27.8473 20.3835 27.3798 20.0577L20.8065 15.6802C20.4591 15.4466 20.0493 15.3232 19.6307 15.326C19.0498 15.326 18.4832 15.5527 18.0723 16.006L15.9898 18.2585C15.0123 17.6494 13.709 16.7427 12.6465 15.6802C11.6265 14.6602 10.7057 13.3569 10.0682 12.3369L12.3207 10.2544C13.0857 9.54603 13.2273 8.38436 12.6465 7.52019L8.26899 0.946859C7.95732 0.479359 7.46149 0.139359 6.89482 0.0401923C6.61889 -0.0150121 6.3346 -0.0133321 6.05935 0.0451294C5.78409 0.103591 5.52366 0.217604 5.29399 0.380192L0.916486 3.41186C0.363986 3.79436 0.0381521 4.40353 0.00981879 5.06936C-0.0326812 6.04686 -0.216848 14.8444 6.63982 21.701C12.8023 27.8635 20.5373 28.3452 22.7615 28.3452V28.331ZM6.90899 11.4019C6.68232 11.6144 6.61149 11.9544 6.75315 12.2377C6.82399 12.3652 8.38232 15.411 10.6348 17.6777C12.9015 19.9444 15.9473 21.5027 16.0748 21.5735C16.3582 21.7152 16.6982 21.6585 16.9107 21.4177L19.7298 18.3719L25.1982 22.0127L22.7898 25.4977C21.1465 25.4977 14.1057 25.1577 8.63732 19.6894C3.16899 14.221 2.82899 7.16603 2.82899 5.53686L6.31399 3.12853L9.95482 8.59686L6.90899 11.416V11.4019Z" fill="black" /></svg>`;
const EMAIL_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="29" height="23" viewBox="0 0 29 23" fill="none"><path d="M2.83333 22.6667C2.05417 22.6667 1.38739 22.3895 0.833 21.8351C0.278611 21.2807 0.000944444 20.6134 0 19.8333V2.83333C0 2.05417 0.277667 1.38739 0.833 0.833C1.38833 0.278611 2.05511 0.000944445 2.83333 0H25.5C26.2792 0 26.9464 0.277666 27.5017 0.833C28.0571 1.38833 28.3343 2.05511 28.3333 2.83333V19.8333C28.3333 20.6125 28.0561 21.2798 27.5017 21.8351C26.9474 22.3904 26.2801 22.6676 25.5 22.6667H2.83333ZM25.5 5.66667L14.9104 12.2896C14.7924 12.3604 14.6686 12.4138 14.5392 12.4497C14.4099 12.4856 14.2857 12.503 14.1667 12.5021C14.0477 12.5011 13.9239 12.4837 13.7955 12.4497C13.6671 12.4157 13.5429 12.3623 13.4229 12.2896L2.83333 5.66667V19.8333H25.5V5.66667ZM14.1667 9.91667L25.5 2.83333H2.83333L14.1667 9.91667ZM2.83333 6.02083V3.93125V3.96667V3.94967V6.02083Z" fill="black" /></svg>`;
const LOCATION_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34" fill="none"><path d="M8.50008 11.9567C8.47175 19.1817 15.8242 24.9617 16.1359 25.2025C16.3909 25.4009 16.7026 25.5 17.0001 25.5C17.2976 25.5 17.6092 25.4009 17.8642 25.2025C18.1759 24.9617 25.5284 19.1817 25.5001 11.9567C25.5001 6.92754 21.6892 2.83337 17.0001 2.83337C12.3109 2.83337 8.50008 6.92754 8.50008 11.9567ZM22.6667 11.9567C22.6809 16.4759 18.7851 20.57 17.0001 22.2134C15.2151 20.5842 11.3192 16.49 11.3334 11.9567C11.3334 8.48587 13.8692 5.66671 17.0001 5.66671C20.1309 5.66671 22.6667 8.48587 22.6667 11.9567Z" fill="black" /><path d="M17.0007 8.5C16.2492 8.5 15.5285 8.79851 14.9972 9.32986C14.4658 9.86122 14.1673 10.5819 14.1673 11.3333C14.1673 12.0848 14.4658 12.8054 14.9972 13.3368C15.5285 13.8682 16.2492 14.1667 17.0007 14.1667C17.7521 14.1667 18.4728 13.8682 19.0041 13.3368C19.5355 12.8054 19.834 12.0848 19.834 11.3333C19.834 10.5819 19.5355 9.86122 19.0041 9.32986C18.4728 8.79851 17.7521 8.5 17.0007 8.5ZM25.529 20.8675C24.9623 21.7742 24.339 22.61 23.7298 23.3608C26.7473 24.0408 28.334 25.0467 28.334 25.5C28.334 26.2225 24.4382 28.3333 17.0007 28.3333C9.56315 28.3333 5.66732 26.2225 5.66732 25.5C5.66732 25.0467 7.25398 24.0408 10.2715 23.3608C9.66232 22.61 9.05315 21.7742 8.47232 20.8675C5.18565 21.7742 2.83398 23.29 2.83398 25.5C2.83398 29.3958 10.1723 31.1667 17.0007 31.1667C23.829 31.1667 31.1673 29.3958 31.1673 25.5C31.1673 23.29 28.8015 21.7742 25.529 20.8675Z" fill="black" /></svg>`;

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

export const renderLinen = (resume: any): string => {
    let html = loadTemplate("linen", "resumes");

    // --- NAME + PHOTO ---
    const fullName = [resume.firstName, resume.lastName].filter(Boolean).join(" ");
    html = replace(html, "name", escapeHtml(fullName.toUpperCase()));
    const photoUrl = resume.photoUrl ? `${SERVER_URL}${resume.photoUrl}` : "";
    html = replace(html, "photoUrl", photoUrl);

    // --- TAGLINE ---
    const primaryExperience = (resume.candidate_experience || [])[0];
    const taglineText = primaryExperience?.jobTitle || primaryExperience?.role || "";
    html = replace(html, "tagline", taglineText ? `<h6>${escapeHtml(taglineText.toUpperCase())}</h6>` : "");

    // --- SOCIAL LINKS ---
    const socialParts: string[] = [];
    if (resume.linkedin) {
        socialParts.push(`<p>${LINKEDIN_ICON}<a href="${escapeHtml(resume.linkedin)}" target="_blank">linkedin</a></p>`);
    }
    if (resume.github) {
        socialParts.push(`<p>${GITHUB_ICON}<a href="${escapeHtml(resume.github)}" target="_blank">Github</a></p>`);
    }
    html = replace(html, "socialLinks", socialParts.join(""));

    // --- CONTACT ---
    const contactParts: string[] = [];
    if (resume.phone) {
        contactParts.push(`<p><a href="tel:${escapeHtml(resume.phone)}">${escapeHtml(resume.phone)}</a>${PHONE_ICON}</p>`);
    }
    if (resume.email) {
        contactParts.push(`<p><a href="mailto:${escapeHtml(resume.email)}">${escapeHtml(resume.email)}</a>${EMAIL_ICON}</p>`);
    }
    const address = [resume.city, resume.state, resume.country].filter(Boolean).join(", ");
    if (address) {
        contactParts.push(`<p>${escapeHtml(address)} ${LOCATION_ICON}</p>`);
    }
    html = replace(html, "contact", contactParts.join(""));

    // --- SUMMARY ---
    const summary = resume.resume_builder?.summary
        ? `<p>${nl2br(escapeHtml(resume.resume_builder.summary))}</p>`
        : "";
    html = replace(html, "summary", summary);

    // --- EDUCATION (with CGPA) ---
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

            const location = edu.address || edu.city || "";
            const gradeVal = edu.grade || edu.gpa;
            const metaParts = [duration, location];
            if (gradeVal) metaParts.push(`CGPA: ${gradeVal}`);
            const metaLine = metaParts.filter(Boolean).join(" | ");

            return `
<div class="details">
    <h5>${escapeHtml(degree)}</h5>
    <h5>${escapeHtml(institute)}</h5>
    ${metaLine ? `<p>${escapeHtml(metaLine)}</p>` : ""}
</div>`;
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
            const isCurrent = exp.isCurrent ?? !exp.endYear;

            const startMonth = exp.startMonth ?? getMonth(exp.startDate);
            const startYear = exp.startYear ?? getYear(exp.startDate);
            const endMonth = exp.endMonth ?? getMonth(exp.endDate);
            const endYear = exp.endYear ?? getYear(exp.endDate);

            const start = [startMonth, startYear].filter(Boolean).join("/");
            const end = isCurrent ? "Present" : [endMonth, endYear].filter(Boolean).join("/");
            const duration = start ? `${start} – ${end}` : end;
            const location = exp.location || "";

            const titleLine = [role, company].filter(Boolean).join(" — ");
            const description = exp.description
                ? `<p>${nl2br(escapeHtml(exp.description))}</p>`
                : "";

            return `
<div class="details">
    <h5>${escapeHtml(titleLine)}</h5>
    ${duration || location ? `<h6>${location ? escapeHtml(location) : ""} | ${duration ? escapeHtml(duration) : ""}</h6>` : ""}
    ${description}
</div>`;
        })
        .join("");
    html = replace(html, "experience", experienceHtml);

    return html;
};