import { escapeHtml, nl2br, normalizeUrl } from "../../../../src/helpers/templates/html.helper";
import { loadTemplate, replace } from "../../../../src/helpers/templates/template.helper";
import { SERVER_URL } from "../../../../src/config/environment.config";

const PHONE_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="20" fill="#4578B8" /><path d="M24.5 24.5H15.5V12.5H24.5V24.5Z" fill="white" /><path d="M24.5 9.5C25.2956 9.5 26.0587 9.81607 26.6213 10.3787C27.1839 10.9413 27.5 11.7044 27.5 12.5V27.5C27.5 28.2956 27.1839 29.0587 26.6213 29.6213C26.0587 30.1839 25.2956 30.5 24.5 30.5H15.5C14.7044 30.5 13.9413 30.1839 13.3787 29.6213C12.8161 29.0587 12.5 28.2956 12.5 27.5V12.5C12.5 11.7044 12.8161 10.9413 13.3787 10.3787C13.9413 9.81607 14.7044 9.5 15.5 9.5H24.5ZM19.25 27.5C19.0511 27.5 18.8603 27.579 18.7197 27.7197C18.579 27.8603 18.5 28.0511 18.5 28.25C18.5 28.4489 18.579 28.6397 18.7197 28.7803C18.8603 28.921 19.0511 29 19.25 29H20.75C20.9489 29 21.1397 28.921 21.2803 28.7803C21.421 28.6397 21.5 28.4489 21.5 28.25C21.5 28.0511 21.421 27.8603 21.2803 27.7197C21.1397 27.579 20.9489 27.5 20.75 27.5H19.25ZM15.5 11C15.1022 11 14.7206 11.158 14.4393 11.4393C14.158 11.7206 14 12.1022 14 12.5V24.5C14 24.8978 14.158 25.2794 14.4393 25.5607C14.7206 25.842 15.1022 26 15.5 26H24.5C24.8978 26 25.2794 25.842 25.5607 25.5607C25.842 25.2794 26 24.8978 26 24.5V12.5C26 12.1022 25.842 11.7206 25.5607 11.4393C25.2794 11.158 24.8978 11 24.5 11H15.5Z" fill="white" /></svg>`;
const EMAIL_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="20" fill="#4578B8" /><path d="M26.7309 13.4101L25.4509 14.4101L20.0009 18.4601L14.5509 14.3701L13.2709 13.3701C12.9694 13.1206 12.6013 12.9651 12.2122 12.9228C11.8232 12.8806 11.4302 12.9533 11.0821 13.1322C10.734 13.311 10.4461 13.5881 10.2539 13.929C10.0617 14.2699 9.97374 14.6597 10.0009 15.0501V26.6401C10.0009 27.0008 10.1442 27.3467 10.3993 27.6018C10.6543 27.8568 11.0002 28.0001 11.3609 28.0001H14.5509V20.2801L20.0009 24.3701L25.4509 20.2801V28.0001H28.6409C29.0016 28.0001 29.3475 27.8568 29.6026 27.6018C29.8576 27.3467 30.0009 27.0008 30.0009 26.6401V15.0501C30.0197 14.6631 29.9256 14.2789 29.7302 13.9443C29.5347 13.6097 29.2463 13.3391 28.8999 13.1654C28.5535 12.9917 28.1641 12.9224 27.7791 12.9658C27.394 13.0092 27.0299 13.1636 26.7309 13.4101Z" fill="white" /></svg>`;
const LOCATION_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="20" fill="#4578B8" /><path d="M19 17.86V24L20 26L21 24V17.86C22.72 17.41 24 15.86 24 14C24 11.79 22.21 10 20 10C17.79 10 16 11.79 16 14C16 15.86 17.28 17.41 19 17.86Z" fill="white" /><path d="M23 22.1699V24.1799C26.29 24.5899 28 25.5899 28 25.9999C28 26.5099 25.25 27.9999 20 27.9999C14.75 27.9999 12 26.5099 12 25.9999C12 25.5999 13.71 24.5899 17 24.1799V22.1699C13.25 22.5899 10 23.8299 10 25.9999C10 28.7499 15.18 29.9999 20 29.9999C24.82 29.9999 30 28.7499 30 25.9999C30 23.8199 26.75 22.5899 23 22.1699Z" fill="white" /></svg>`;
const LINKEDIN_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="20" fill="#4578B8" /><path d="M26.667 28.3333H25.2753C24.8333 28.3333 24.4094 28.1577 24.0968 27.8451C23.7843 27.5325 23.6087 27.1086 23.6087 26.6666V22.1916C23.6161 22.0161 23.5631 21.8433 23.4584 21.7023C23.3537 21.5612 23.2038 21.4603 23.0337 21.4166C22.9347 21.4015 22.8336 21.4079 22.7373 21.4352C22.641 21.4625 22.5517 21.5101 22.4753 21.5749C22.3968 21.6416 22.3337 21.7246 22.2905 21.8182C22.2473 21.9117 22.2251 22.0136 22.2253 22.1166V26.6666C22.2253 27.1086 22.0497 27.5325 21.7372 27.8451C21.4246 28.1577 21.0007 28.3333 20.5587 28.3333H19.167C18.725 28.3333 18.301 28.1577 17.9885 27.8451C17.6759 27.5325 17.5003 27.1086 17.5003 26.6666V22.1166C17.5003 20.68 18.071 19.3022 19.0868 18.2864C20.1027 17.2706 21.4804 16.6999 22.917 16.6999C24.3536 16.6999 25.7313 17.2706 26.7472 18.2864C27.763 19.3022 28.3337 20.68 28.3337 22.1166V26.6666C28.3337 27.1086 28.1581 27.5325 27.8455 27.8451C27.5329 28.1577 27.109 28.3333 26.667 28.3333ZM22.917 19.7416C23.0474 19.7339 23.1782 19.7339 23.3087 19.7416C23.8681 19.8492 24.3719 20.1504 24.7315 20.5923C25.0911 21.0342 25.2836 21.5886 25.2753 22.1583V26.6666H26.667V22.1166C26.667 21.122 26.2719 20.1682 25.5686 19.4649C24.8654 18.7617 23.9116 18.3666 22.917 18.3666C21.9224 18.3666 20.9686 18.7617 20.2653 19.4649C19.5621 20.1682 19.167 21.122 19.167 22.1166V26.6666H20.5587V22.1166C20.5586 21.4896 20.8066 20.888 21.2484 20.4431C21.6902 19.9982 22.29 19.746 22.917 19.7416ZM15.0003 28.3333H13.3337C12.8916 28.3333 12.4677 28.1577 12.1551 27.8451C11.8426 27.5325 11.667 27.1086 11.667 26.6666V18.3333C11.667 17.8912 11.8426 17.4673 12.1551 17.1547C12.4677 16.8422 12.8916 16.6666 13.3337 16.6666H15.0003C15.4424 16.6666 15.8663 16.8422 16.1788 17.1547C16.4914 17.4673 16.667 17.8912 16.667 18.3333V26.6666C16.667 27.1086 16.4914 27.5325 16.1788 27.8451C15.8663 28.1577 15.4424 28.3333 15.0003 28.3333ZM13.3337 18.3333V26.6666H15.0003V18.3333H13.3337ZM14.167 15.8333C13.6725 15.8333 13.1892 15.6866 12.7781 15.4119C12.3669 15.1372 12.0465 14.7468 11.8573 14.29C11.6681 13.8331 11.6186 13.3305 11.715 12.8455C11.8115 12.3606 12.0496 11.9151 12.3992 11.5655C12.7489 11.2159 13.1943 10.9778 13.6793 10.8813C14.1642 10.7848 14.6669 10.8343 15.1237 11.0236C15.5805 11.2128 15.971 11.5332 16.2457 11.9443C16.5204 12.3555 16.667 12.8388 16.667 13.3333C16.667 13.9963 16.4036 14.6322 15.9348 15.101C15.4659 15.5699 14.83 15.8333 14.167 15.8333ZM14.167 12.4999C14.0022 12.4999 13.8411 12.5488 13.704 12.6404C13.567 12.7319 13.4602 12.8621 13.3971 13.0144C13.334 13.1666 13.3175 13.3342 13.3497 13.4958C13.3818 13.6575 13.4612 13.806 13.5777 13.9225C13.6943 14.0391 13.8428 14.1184 14.0044 14.1506C14.1661 14.1827 14.3336 14.1662 14.4859 14.1032C14.6382 14.0401 14.7683 13.9333 14.8599 13.7962C14.9515 13.6592 15.0003 13.4981 15.0003 13.3333C15.0003 13.1122 14.9125 12.9003 14.7562 12.744C14.6 12.5877 14.388 12.4999 14.167 12.4999Z" fill="white" /></svg>`;
const GITHUB_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="20" fill="#4578B8" /><path d="M23.5331 28.3333C23.3121 28.3333 23.1001 28.2455 22.9439 28.0892C22.7876 27.9329 22.6998 27.7209 22.6998 27.4999V25.3333C22.7257 25.084 22.699 24.8321 22.6215 24.5939C22.544 24.3556 22.4174 24.1362 22.2498 23.9499C22.146 23.8374 22.0753 23.6985 22.0453 23.5484C22.0153 23.3983 22.0272 23.2429 22.0797 23.0991C22.1322 22.9554 22.2233 22.8288 22.343 22.7334C22.4626 22.638 22.6063 22.5774 22.7581 22.5583C24.7915 22.3166 26.6665 21.6666 26.6665 18.1416C26.6671 17.4833 26.4728 16.8396 26.1081 16.2916C25.7716 15.7871 25.6487 15.1698 25.7665 14.5749C25.8418 14.1869 25.8418 13.788 25.7665 13.3999C25.1427 13.6115 24.5553 13.9179 24.0248 14.3083C23.9246 14.3794 23.8098 14.4276 23.6888 14.4492C23.5678 14.4708 23.4435 14.4653 23.3248 14.4333C21.8209 14.0083 20.2287 14.0083 18.7248 14.4333C18.6061 14.4653 18.4818 14.4708 18.3608 14.4492C18.2398 14.4276 18.125 14.3794 18.0248 14.3083C17.4914 13.9128 16.8976 13.6061 16.2665 13.3999C16.1867 13.7875 16.1867 14.1873 16.2665 14.5749C16.3757 15.1773 16.2473 15.7986 15.9081 16.3083C15.545 16.8601 15.351 17.506 15.3498 18.1666C15.3498 21.4083 16.9165 22.2749 19.2665 22.5749C19.4202 22.594 19.5656 22.6556 19.6863 22.7527C19.8071 22.8499 19.8983 22.9788 19.9498 23.1249C19.9982 23.2667 20.0076 23.419 19.9768 23.5656C19.946 23.7123 19.8762 23.8479 19.7748 23.9583C19.6127 24.1315 19.4883 24.3365 19.4094 24.5602C19.3305 24.784 19.2989 25.0217 19.3165 25.2583V27.4999C19.3165 27.7209 19.2287 27.9329 19.0724 28.0892C18.9161 28.2455 18.7041 28.3333 18.4831 28.3333C18.2621 28.3333 18.0501 28.2455 17.8939 28.0892C17.7376 27.9329 17.6498 27.7209 17.6498 27.4999V27.0249C16.8309 27.1191 16.0015 27.0094 15.2353 26.7055C14.4691 26.4016 13.7899 25.9131 13.2581 25.2833C12.9848 24.9803 12.6569 24.7315 12.2915 24.5499C12.1853 24.5226 12.0856 24.4746 11.998 24.4087C11.9104 24.3428 11.8366 24.2603 11.7809 24.1659C11.7252 24.0714 11.6886 23.967 11.6733 23.8584C11.6579 23.7499 11.6641 23.6394 11.6915 23.5333C11.7188 23.4271 11.7668 23.3274 11.8327 23.2398C11.8986 23.1522 11.9811 23.0784 12.0755 23.0227C12.1699 22.967 12.2744 22.9304 12.3829 22.9151C12.4915 22.8997 12.602 22.9059 12.7081 22.9333C13.3496 23.1658 13.9227 23.5555 14.3748 24.0666C15.2081 24.8999 16.0415 25.6333 17.6248 25.3333C17.5972 24.8858 17.6624 24.4376 17.8165 24.0166C16.0998 23.5833 13.6498 22.3499 13.6498 18.1833C13.6476 17.1963 13.9375 16.2307 14.4831 15.4083C14.5845 15.2564 14.6233 15.0713 14.5915 14.8916C14.4235 13.992 14.519 13.0631 14.8665 12.2166C14.9137 12.1037 14.9853 12.0027 15.076 11.9206C15.1667 11.8385 15.2744 11.7774 15.3915 11.7416C15.6748 11.6583 16.6915 11.4916 18.6165 12.7416C20.1748 12.3666 21.7998 12.3666 23.3581 12.7416C25.2831 11.4916 26.2998 11.6499 26.5748 11.7416C26.6918 11.7774 26.7995 11.8385 26.8902 11.9206C26.981 12.0027 27.0525 12.1037 27.0998 12.2166C27.4488 13.0657 27.5443 13.9977 27.3748 14.8999C27.3577 14.9812 27.3571 15.0651 27.3728 15.1466C27.3885 15.2282 27.4204 15.3058 27.4665 15.3749C28.0136 16.1998 28.3036 17.1684 28.2998 18.1583C28.2998 22.3833 25.8665 23.6083 24.1331 23.9916C24.2854 24.4389 24.3477 24.9118 24.3165 25.3833V27.4999C24.3168 27.7125 24.2359 27.9173 24.0903 28.0722C23.9447 28.2271 23.7454 28.3205 23.5331 28.3333Z" fill="white" /></svg>`;

function iconTxt(icon: string, content: string): string {
    return `<div class="icon-txt"><div class="icon">${icon}</div><div class="txt"><p>${content}</p></div></div>`;
}

const getYear = (dateVal: any): string => {
    if (!dateVal) return "";
    const date = new Date(dateVal);
    return isNaN(date.getTime()) ? "" : String(date.getUTCFullYear());
};

export const renderAzure = (resume: any): string => {
    let html = loadTemplate("azure", "resumes");

    // --- NAME + PHOTO ---
    const firstName = resume.firstName || "";
    const lastName = resume.lastName || "";
    const fullNameHtml = [
        firstName ? escapeHtml(firstName) : "",
        lastName ? `<span>${escapeHtml(lastName)}</span>` : "",
    ]
        .filter(Boolean)
        .join(" ");
    html = replace(html, "name", fullNameHtml);
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
    if (resume.phone) contactParts.push(iconTxt(PHONE_ICON, `<a href="tel:${escapeHtml(resume.phone)}">${escapeHtml(resume.phone)}</a>`));
    if (resume.email) contactParts.push(iconTxt(EMAIL_ICON, `<a href="mailto:${escapeHtml(resume.email)}">${escapeHtml(resume.email)}</a>`));
    const address = [resume.city, resume.state, resume.country].filter(Boolean).join(", ");
    if (address) contactParts.push(iconTxt(LOCATION_ICON, escapeHtml(address)));
    if (resume.linkedin) contactParts.push(`<div class="icon-txt"><div class="icon">${LINKEDIN_ICON}</div><div class="txt"><p><a href="${escapeHtml(normalizeUrl(resume.linkedin))}" target="_blank">Linkedin</a></p></div></div>`);
    if (resume.github) contactParts.push(`<div class="icon-txt"><div class="icon">${GITHUB_ICON}</div><div class="txt"><p><a href="${escapeHtml(normalizeUrl(resume.github))}" target="_blank">Github</a></p></div></div>`);
    html = replace(html, "contact", contactParts.join(""));

    // --- SKILLS ---
    const skillsList = resume.candidate_skills || [];
    const skillsHtml = skillsList
        .map((skill: any) => `<p>${escapeHtml(skill.skillName || skill.name || "")}</p>`)
        .join("");
    html = replace(html, "skills", skillsHtml);

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