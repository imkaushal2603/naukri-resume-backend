import { escapeHtml, nl2br } from "../../../src/helpers/templates/html.helper";
import { loadTemplate, replace } from "../../../src/helpers/templates/template.helper";

const formatMonthYear = (date: Date | string | null | undefined): { month: string; year: string } => {
    if (!date) return { month: "", year: "" };
    const d = new Date(date);
    if (isNaN(d.getTime())) return { month: "", year: "" };
    return {
        month: d.toLocaleString("en-US", { month: "short" }),
        year: String(d.getFullYear())
    };
};

export const renderMinimal = (resume: any): string => {
    let html = loadTemplate("minimal");

    /* Header */

    const fullName = [resume.firstName, resume.lastName]
        .filter(Boolean)
        .join(" ");

    html = replace(html, "name", escapeHtml(fullName));
    html = replace(html, "position", escapeHtml(resume.currentPosition ?? ""));

    /* Summary */

    const summary = resume.resume_builder?.summary
        ? `
<div class="main-section">
    <h2 class="main-title">Summary</h2>

    <div class="summary">
        ${nl2br(resume.resume_builder.summary)}
    </div>
</div>`
        : "";

    html = replace(html, "summary", summary);

    /* Education */

    const education = resume.candidate_education?.length
        ? `
<div class="main-section">

    <h2 class="main-title">Education</h2>

    <div class="timeline">

        ${resume.candidate_education.map((edu: any) => {
            const start = formatMonthYear(edu.startDate);
            const end = formatMonthYear(edu.endDate);

            return `
<div class="timeline-item">

    <div class="timeline-dot"></div>

    <div class="timeline-content">

        <div class="timeline-date">

    ${start.year}

    -

    ${edu.isCurrent
                    ? "Present"
                    : escapeHtml(end.year)}

</div>

        <div class="title">${escapeHtml(edu.degree)}</div>

        <div class="sub-title">${escapeHtml(edu.school)}</div>

        ${edu.fieldOfStudy
                    ? `<div>${escapeHtml(edu.fieldOfStudy)}</div>`
                    : ""}

    </div>

</div>`;
        }).join("")}

    </div>

</div>`
        : "";

    html = replace(html, "education", education);

    /* Experience */

    const experience = resume.candidate_experience?.length
        ? `
<div class="main-section">

    <h2 class="main-title">Experience</h2>

    <div class="timeline">

        ${resume.candidate_experience.map((exp: any) => {
            const start = formatMonthYear(exp.startDate);
            const end = formatMonthYear(exp.endDate);
            const isPresent = exp.isCurrent || !exp.endDate;

            return `

<div class="timeline-item">

    <div class="timeline-dot"></div>

    <div class="timeline-content">

        <div class="timeline-date">

            ${start.month} ${start.year}

            -

            ${isPresent
                    ? "Present"
                    : `${end.month} ${end.year}`}

        </div>

        <div class="title">${escapeHtml(exp.role)}</div>

        <div class="sub-title">

            ${escapeHtml(exp.company)}

            ${exp.location ? ` | ${escapeHtml(exp.location)}` : ""}

        </div>

        ${exp.description
                    ? `<div class="description">${nl2br(exp.description)}</div>`
                    : ""}

    </div>

</div>

`;
        }).join("")}

    </div>

</div>`
        : "";

    html = replace(html, "experience", experience);

    /* Contact */

    const contact = `
<div class="side">

    <h3>Contact</h3>

    <div class="contact">

        ${resume.phone
            ? `<div><i class="fa-solid fa-phone"></i> ${escapeHtml(resume.phone)}</div>`
            : ""}

        ${resume.email
            ? `<div><i class="fa-solid fa-envelope"></i> ${escapeHtml(resume.email)}</div>`
            : ""}

        ${(resume.city || resume.state)
            ? `<div><i class="fa-solid fa-location-dot"></i> ${escapeHtml(`${resume.city ?? ""}${resume.city && resume.state ? ", " : ""}${resume.state ?? ""}`)}</div>`
            : ""}

        ${resume.linkedin
            ? `<div><i class="fa-brands fa-linkedin"></i> ${escapeHtml(resume.linkedin)}</div>`
            : ""}

        ${resume.github
            ? `<div><i class="fa-brands fa-github"></i> ${escapeHtml(resume.github)}</div>`
            : ""}

    </div>

</div>`;

    html = replace(html, "contact", contact);

    /* Skills */

    const skills = resume.candidate_skills?.length
        ? `
<div class="side">

    <h3>Skills</h3>

    <ul>
        ${resume.candidate_skills
            .map((skill: any) => `<li>${escapeHtml(skill.name)}</li>`)
            .join("")}
    </ul>

</div>`
        : "";

    html = replace(html, "skills", skills);

    return html;
}