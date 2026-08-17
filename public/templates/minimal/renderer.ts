import { escapeHtml, nl2br } from "../../../src/helpers/templates/html.helper";
import { loadTemplate, replace } from "../../../src/helpers/templates/template.helper";

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
            return `
<div class="timeline-item">

    <div class="timeline-dot"></div>

    <div class="timeline-content">

        <div class="timeline-date">

    ${escapeHtml(String(edu.startYear ?? ""))}

    -

    ${edu.currentlyStudying
                    ? "Present"
                    : escapeHtml(String(edu.passingYear ?? ""))}

</div>

        <div class="title">${escapeHtml(String(edu.courseDegree ?? ""))}</div>

        <div class="sub-title">${escapeHtml(String(edu.instituteName ?? ""))}</div>

        ${edu.educationLevel
                    ? `<div>${escapeHtml(String(edu.educationLevel))}</div>`
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
            const isPresent = exp.currentlyWorking || !exp.endYear;

            return `

<div class="timeline-item">

    <div class="timeline-dot"></div>

    <div class="timeline-content">

        <div class="timeline-date">

            ${escapeHtml(String(exp.startMonth ?? ""))} ${escapeHtml(String(exp.startYear ?? ""))}

            -

            ${isPresent
                    ? "Present"
                    : `${escapeHtml(String(exp.endMonth ?? ""))} ${escapeHtml(String(exp.endYear ?? ""))}`}

        </div>

        <div class="title">${escapeHtml(String(exp.jobTitle ?? ""))}</div>

        <div class="sub-title">

            ${escapeHtml(String(exp.companyName ?? ""))}

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
            .map((skill: any) => `<li>${escapeHtml(String(skill.skillName ?? ""))}</li>`)
            .join("")}
    </ul>

</div>`
        : "";

    html = replace(html, "skills", skills);

    return html;
};