import { escapeHtml, nl2br } from "../../../src/helpers/templates/html.helper";
import { loadTemplate, replace } from "../../../src/helpers/templates/template.helper";
import { SERVER_URL } from "../../../src/config/environment.config";

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

export const renderProfessional = (resume: any): string => {
    let html = loadTemplate("professional");

    const fullName = [
        resume.firstName,
        resume.lastName
    ]
        .filter(Boolean)
        .join(" ");

    html = replace(html, "name", escapeHtml(fullName));

    const photoUrl = resume.photoUrl
        ? `${SERVER_URL}${resume.photoUrl}`
        : "";

    const photo = photoUrl
        ? `
<div class="profile_image">
    <img
        src="${photoUrl}"
        alt="${escapeHtml(fullName)}"
    />
</div>
`
        : "";

    html = replace(html, "photo", photo);

    html = replace(
        html,
        "headerClass",
        photo ? "with-photo" : "without-photo"
    );

    const contact: string[] = [];

    if (resume.phone) {
        contact.push(`<span>${escapeHtml(resume.phone)}</span>`);
    }

    if (resume.email) {
        contact.push(`<span>${escapeHtml(resume.email)}</span>`);
    }

    const address = [
        resume.city,
        resume.state,
        resume.country
    ]
        .filter(Boolean)
        .join(", ");

    if (address) {
        contact.push(`<span>${escapeHtml(address)}</span>`);
    }

    html = replace(
        html,
        "contact",
        contact.join("")
    );

    const summary = resume.resume_builder?.summary
        ? `<p>${nl2br(resume.resume_builder.summary)}</p>`
        : "";

    html = replace(
        html,
        "summary",
        summary
    );

    const educations = resume.candidate_education || [];
    const education = educations.length
        ? educations.map((edu: any) => {
            const institute = edu.instituteName || edu.school || "";
            const degree = edu.courseDegree || edu.degree || "";
            const level = edu.educationLevel || edu.fieldOfStudy || "";
            const isCurrent = edu.currentlyStudying ?? edu.isCurrent ?? false;
            const gradeVal = edu.grade || edu.gpa;

            const startYear = edu.startYear ?? getYear(edu.startDate);
            const endYear = isCurrent
                ? "Present"
                : (edu.passingYear ?? getYear(edu.endDate));

            return `
<div class="education_item">

    <div class="education_left">

        <h3>${escapeHtml(institute)}</h3>

        <h4>${escapeHtml(degree)}</h4>

        ${level
                    ? `<p>${escapeHtml(level)}</p>`
                    : ""}

        ${gradeVal
                    ? `<p>Grade: ${escapeHtml(gradeVal)}</p>`
                    : ""}

        ${edu.address
                    ? `<p>${escapeHtml(edu.address)}</p>`
                    : ""}

    </div>

    <div class="education_right">

        <span class="date_badge">

            ${startYear}

            -

            ${endYear}

        </span>

    </div>

</div>
`;
        }).join("")
        : "";

    html = replace(
        html,
        "education",
        education
    );

    const experiences = resume.candidate_experience || [];
    const experience = experiences.length
        ? experiences.map((exp: any) => {
            const company = exp.companyName || exp.company || "";
            const role = exp.jobTitle || exp.role || "";
            const isCurrent = exp.isCurrent ?? !exp.endYear;

            const startMonth = exp.startMonth ?? getMonth(exp.startDate);
            const startYear = exp.startYear ?? getYear(exp.startDate);
            const endMonth = exp.endMonth ?? getMonth(exp.endDate);
            const endYear = exp.endYear ?? getYear(exp.endDate);

            return `
<div class="experience_item">

    <div class="experience_left">

        <h3>${escapeHtml(company)}</h3>

        <h4>${escapeHtml(role)}</h4>

        ${exp.location
                    ? `<p class="location">${escapeHtml(exp.location)}</p>`
                    : ""}

        ${exp.employmentType
                    ? `<p>${escapeHtml(exp.employmentType)}</p>`
                    : ""}


${exp.description
                    ? `<div class="description">${nl2br(exp.description)}</div>`
                    : ""}

    </div>

    <div class="experience_right">

        <span class="date_badge">

            ${escapeHtml(startMonth)}
            ${startYear ? ` ${escapeHtml(startYear)}` : ""}

            -

            ${isCurrent
                    ? "Present"
                    : `${escapeHtml(endMonth)} ${escapeHtml(endYear)}`}

        </span>

    </div>

</div>
`;
        }).join("")
        : "";

    html = replace(
        html,
        "experience",
        experience
    );

    const skillsList = resume.candidate_skills || [];
    const skills = skillsList.length
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
        skills
    );

    return html;
};