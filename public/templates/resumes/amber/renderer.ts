import { escapeHtml, nl2br } from "../../../../src/helpers/templates/html.helper";
import { loadTemplate, replace } from "../../../../src/helpers/templates/template.helper";
import { SERVER_URL } from "../../../../src/config/environment.config";

const PHONE_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 40 40" fill="none"><rect x="0.5" y="0.5" width="39" height="39" rx="19.5" stroke="black" /><path fill-rule="evenodd" clip-rule="evenodd" d="M13.5104 18.4156C15.2517 22.2055 18.345 25.209 22.1846 26.8379L22.1963 26.8428L22.939 27.1733C23.3978 27.3779 23.9131 27.4184 24.3982 27.2879C24.8833 27.1574 25.3087 26.864 25.6029 26.4568L26.8415 24.7428C26.8779 24.6923 26.8936 24.6298 26.8853 24.5681C26.877 24.5064 26.8453 24.4503 26.7968 24.4112L24.6346 22.6661C24.6091 22.6455 24.5797 22.6303 24.5481 22.6214C24.5166 22.6125 24.4835 22.61 24.451 22.6142C24.4185 22.6184 24.3872 22.6291 24.3589 22.6457C24.3306 22.6623 24.306 22.6845 24.2865 22.7108L23.4446 23.8464C23.3454 23.9804 23.2033 24.0763 23.042 24.1182C22.8806 24.1602 22.7098 24.1455 22.5579 24.0768C19.6818 22.7726 17.3774 20.4682 16.0732 17.5921C16.0045 17.4402 15.9898 17.2694 16.0318 17.108C16.0737 16.9467 16.1696 16.8046 16.3036 16.7054L17.4382 15.8625C17.4646 15.843 17.4867 15.8184 17.5033 15.7901C17.5199 15.7619 17.5306 15.7305 17.5348 15.698C17.539 15.6655 17.5365 15.6325 17.5276 15.6009C17.5187 15.5694 17.5035 15.54 17.4829 15.5144L15.7388 13.3522C15.6997 13.3037 15.6436 13.2721 15.5819 13.2638C15.5202 13.2554 15.4577 13.2711 15.4072 13.3075L13.6835 14.5519C13.2736 14.8476 12.9787 15.2761 12.849 15.7645C12.7192 16.253 12.7626 16.7713 12.9718 17.2314L13.5104 18.4156ZM21.609 28.1776C17.4375 26.4059 14.0771 23.1416 12.1853 19.0232L12.1833 19.0212L11.6447 17.8351C11.2961 17.0685 11.2237 16.2048 11.4397 15.3907C11.6558 14.5767 12.147 13.8626 12.8299 13.3697L14.5536 12.1253C14.9067 11.8705 15.3439 11.7607 15.7755 11.8186C16.207 11.8765 16.5999 12.0976 16.8733 12.4364L18.6185 14.5996C18.7625 14.7781 18.8689 14.9838 18.9314 15.2045C18.9939 15.4251 19.0111 15.6561 18.9821 15.8836C18.953 16.1111 18.8783 16.3304 18.7623 16.5282C18.6464 16.7261 18.4916 16.8985 18.3074 17.035L17.656 17.5172C18.7577 19.6522 20.4968 21.3913 22.6318 22.4931L23.115 21.8417C23.2515 21.6576 23.4239 21.5029 23.6216 21.3871C23.8194 21.2712 24.0386 21.1965 24.2659 21.1675C24.4933 21.1384 24.7242 21.1556 24.9448 21.218C25.1653 21.2804 25.371 21.3867 25.5494 21.5306L27.7126 23.2757C28.0517 23.5492 28.273 23.9423 28.3309 24.374C28.3888 24.8058 28.2788 25.2433 28.0238 25.5964L26.7851 27.3114C26.2949 27.9899 25.586 28.4791 24.7776 28.6967C23.9692 28.9142 23.1106 28.847 22.346 28.5062L21.609 28.1776Z" fill="black" /><path fill-rule="evenodd" clip-rule="evenodd" d="M26.7628 12.7514C26.8989 12.8885 26.9767 13.0742 26.9767 13.2667V16.9903C26.9767 17.1837 26.8998 17.3691 26.7631 17.5059C26.6264 17.6426 26.4409 17.7194 26.2475 17.7194C26.0541 17.7194 25.8686 17.6426 25.7319 17.5059C25.5952 17.3691 25.5183 17.1837 25.5183 16.9903V15.0264L22.4461 18.0986C22.3788 18.1682 22.2983 18.2237 22.2094 18.2619C22.1204 18.3001 22.0247 18.3201 21.9279 18.3209C21.831 18.3217 21.735 18.3032 21.6454 18.2665C21.5559 18.2298 21.4745 18.1756 21.406 18.1071C21.3376 18.0387 21.2835 17.9572 21.2469 17.8676C21.2103 17.778 21.1919 17.6819 21.1927 17.5851C21.1936 17.4883 21.2138 17.3926 21.252 17.3037C21.2903 17.2147 21.3459 17.1343 21.4156 17.0671L24.4868 13.9949H22.5239C22.3305 13.9949 22.145 13.918 22.0083 13.7813C21.8715 13.6445 21.7947 13.4591 21.7947 13.2657C21.7947 13.0723 21.8715 12.8868 22.0083 12.7501C22.145 12.6133 22.3305 12.5365 22.5239 12.5365H26.2456C26.4389 12.5367 26.6242 12.6136 26.7608 12.7504" fill="black" /></svg>`;
const EMAIL_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 40 40" fill="none"><rect x="0.5" y="0.5" width="39" height="39" rx="19.5" stroke="black" /><path d="M28.125 11.875H11.875C10.0826 11.875 8.625 13.3326 8.625 15.125V24.875C8.625 26.6674 10.0826 28.125 11.875 28.125H28.125C29.9174 28.125 31.375 26.6674 31.375 24.875V15.125C31.375 13.3326 29.9174 11.875 28.125 11.875ZM11.875 13.5H28.125C29.022 13.5 29.75 14.2296 29.75 15.125V15.4516L20 20.702L10.25 15.4516V15.125C10.25 14.2296 10.978 13.5 11.875 13.5ZM28.125 26.5H11.875C11.444 26.5 11.0307 26.3288 10.726 26.024C10.4212 25.7193 10.25 25.306 10.25 24.875V17.2976L19.6149 22.34C19.7332 22.4037 19.8656 22.4371 20 22.4371C20.1344 22.4371 20.2668 22.4037 20.3851 22.34L29.75 17.2976V24.875C29.75 25.306 29.5788 25.7193 29.274 26.024C28.9693 26.3288 28.556 26.5 28.125 26.5Z" fill="black" /></svg>`;
const LOCATION_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 40 40" fill="none"><rect x="0.5" y="0.5" width="39" height="39" rx="19.5" stroke="black" /><path d="M20 21C21.6569 21 23 19.6569 23 18C23 16.3431 21.6569 15 20 15C18.3431 15 17 16.3431 17 18C17 19.6569 18.3431 21 20 21Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /><path d="M14.3431 12.3431C15.8434 10.8429 17.8783 10 20 10C22.1217 10 24.1566 10.8429 25.6569 12.3431C27.1571 13.8434 28 15.8783 28 18C28 19.892 27.598 21.13 26.5 22.5L20 30L13.5 22.5C12.402 21.13 12 19.892 12 18C12 15.8783 12.8429 13.8434 14.3431 12.3431Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>`;
const LINKEDIN_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 40 40" fill="none"><rect x="0.5" y="0.5" width="39" height="39" rx="19.5" stroke="black" /><path d="M12.983 10.821C12.6957 10.821 12.4111 10.8776 12.1457 10.9876C11.8802 11.0975 11.639 11.2587 11.4358 11.4619C11.2327 11.665 11.0715 11.9062 10.9615 12.1717C10.8516 12.4371 10.795 12.7217 10.795 13.009C10.795 13.2963 10.8516 13.5809 10.9615 13.8463C11.0715 14.1118 11.2327 14.353 11.4358 14.5561C11.639 14.7593 11.8802 14.9205 12.1457 15.0304C12.4111 15.1404 12.6957 15.197 12.983 15.197C13.2703 15.197 13.5548 15.1404 13.8203 15.0304C14.0858 14.9205 14.327 14.7593 14.5301 14.5561C14.7333 14.353 14.8945 14.1118 15.0044 13.8463C15.1144 13.5809 15.171 13.2963 15.171 13.009C15.171 12.7217 15.1144 12.4371 15.0044 12.1717C14.8945 11.9062 14.7333 11.665 14.5301 11.4619C14.327 11.2587 14.0858 11.0975 13.8203 10.9876C13.5548 10.8776 13.2703 10.821 12.983 10.821ZM17.237 16.855V28.994H21.006V22.991C21.006 21.407 21.304 19.873 23.268 19.873C25.205 19.873 25.229 21.684 25.229 23.091V28.995H29V22.338C29 19.068 28.296 16.555 24.474 16.555C22.639 16.555 21.409 17.562 20.906 18.515H20.855V16.855H17.237ZM11.095 16.855H14.87V28.994H11.095V16.855Z" fill="black" /></svg>`;
const GITHUB_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 40 40" fill="none"><rect x="0.5" y="0.5" width="39" height="39" rx="19.5" stroke="black" /><path d="M19.9898 8.9373C13.7107 8.93477 8.625 14.018 8.625 20.292C8.625 25.2533 11.8064 29.4707 16.2371 31.0195C16.8338 31.1693 16.7424 30.7453 16.7424 30.4559V28.4881C13.2969 28.8918 13.1572 26.6117 12.9262 26.2309C12.459 25.4336 11.3545 25.2305 11.6846 24.8496C12.4691 24.4459 13.2689 24.9512 14.1957 26.3197C14.866 27.3125 16.1736 27.1449 16.8363 26.9799C16.9811 26.3832 17.2908 25.85 17.7174 25.4361C14.1475 24.7963 12.6596 22.6178 12.6596 20.0279C12.6596 18.7711 13.0734 17.6158 13.8859 16.684C13.368 15.1479 13.9342 13.8326 14.0104 13.6371C15.4855 13.5051 17.0191 14.6934 17.1385 14.7873C17.9764 14.5613 18.9336 14.442 20.0051 14.442C21.0816 14.442 22.0414 14.5664 22.8869 14.7949C23.1738 14.5766 24.5957 13.5559 25.9668 13.6803C26.0404 13.8758 26.5939 15.1605 26.1064 16.6764C26.9291 17.6107 27.348 18.7762 27.348 20.0355C27.348 22.6305 25.85 24.8115 22.2699 25.4412C22.5766 25.7428 22.82 26.1024 22.9861 26.4991C23.1522 26.8958 23.2376 27.3217 23.2373 27.7518V30.6082C23.2576 30.8367 23.2373 31.0627 23.6182 31.0627C28.1148 29.5469 31.3521 25.299 31.3521 20.2945C31.3521 14.018 26.2639 8.9373 19.9898 8.9373Z" fill="black" /></svg>`;

function contactRow(icon: string, content: string): string {
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

export const renderAmber = (resume: any): string => {
    let html = loadTemplate("amber", "resumes");

    // --- NAME + PHOTO ---
    const fullName = [resume.firstName, resume.lastName].filter(Boolean).join(" ");
    html = replace(html, "name", escapeHtml(fullName.toUpperCase()));
    const photoUrl = resume.photoUrl ? `${SERVER_URL}${resume.photoUrl}` : "";
    html = replace(html, "photoUrl", photoUrl);

    // --- TAGLINE ---
    const primaryExperience = (resume.candidate_experience || [])[0];
    const taglineText = primaryExperience?.jobTitle || primaryExperience?.role || "";
    html = replace(html, "tagline", taglineText ? `<h4>${escapeHtml(taglineText.toUpperCase())}</h4>` : "");

    // --- CONTACT ---
    const contactParts: string[] = [];
    if (resume.phone) contactParts.push(contactRow(PHONE_ICON, `<a href="tel:${escapeHtml(resume.phone)}">${escapeHtml(resume.phone)}</a>`));
    if (resume.email) contactParts.push(contactRow(EMAIL_ICON, `<a href="mailto:${escapeHtml(resume.email)}">${escapeHtml(resume.email)}</a>`));
    const address = [resume.city, resume.state, resume.country].filter(Boolean).join(", ");
    if (address) contactParts.push(contactRow(LOCATION_ICON, `<p>${escapeHtml(address)}</p>`));
    if (resume.linkedin) contactParts.push(contactRow(LINKEDIN_ICON, `<a href="${escapeHtml(resume.linkedin)}" target="_blank">LinkedIn</a>`));
    if (resume.github) contactParts.push(contactRow(GITHUB_ICON, `<a href="${escapeHtml(resume.github)}" target="_blank">GitHub</a>`));
    html = replace(html, "contact", contactParts.join(""));

    // --- SUMMARY ---
    const summary = resume.resume_builder?.summary
        ? `<p>${nl2br(escapeHtml(resume.resume_builder.summary))}</p>`
        : "";
    html = replace(html, "summary", summary);

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

            return `
<div class="education_details">
    <h4>${escapeHtml(degree)} | ${escapeHtml(institute)}</h4>
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

            const startYear = exp.startYear ?? getYear(exp.startDate);
            const endYear = isCurrent ? "Present" : (exp.endYear ?? getYear(exp.endDate));
            const duration = [startYear, endYear].filter(Boolean).join("–");

            const titleLine = [role, company, duration].filter(Boolean).join(" | ");

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
    <h4>${escapeHtml(titleLine)}</h4>
    ${description}
</div>`;
        })
        .join("");
    html = replace(html, "experience", experienceHtml);

    return html;
};