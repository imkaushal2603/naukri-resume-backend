import { escapeHtml, nl2br } from "../../../src/helpers/templates/html.helper";
import { loadTemplate, replace } from "../../../src/helpers/templates/template.helper";

export const renderModern = (resume: any): string => {

    let html = loadTemplate("modern");

    const fullName = [resume.firstName, resume.lastName]
        .filter(Boolean)
        .join(" ");

    html = replace(html, "name", escapeHtml(fullName));

    const contact: string[] = [];

    if (resume.phone) {
        contact.push(`
<div>
    <i class="fas fa-phone"></i>
    ${escapeHtml(resume.phone)}
</div>
`);
    }

    if (resume.email) {
        contact.push(`
<div>
    <i class="fas fa-envelope"></i>
    ${escapeHtml(resume.email)}
</div>
`);
    }
    if (resume.linkedin) {
        contact.push(`
<div>
    <i class="fa-brands fa-linkedin"></i>
    ${escapeHtml(resume.linkedin)}
</div>
`);
    }
    if (resume.github) {
        contact.push(`
<div>
    <i class="fa-brands fa-github"></i>
    ${escapeHtml(resume.github)}
</div>
`);
    }

    const address = [resume.city, resume.state, resume.country]
        .filter(Boolean)
        .join(", ");

    if (address) {
        contact.push(`
<div>
    <i class="fas fa-map-marker-alt"></i>
    ${escapeHtml(address)}
</div>
`);
    }

    html = replace(html, "contact", contact.join(""));

    const summary = resume.resume_builder?.summary
        ? `<p>${nl2br(resume.resume_builder.summary)}</p>`
        : "";

    html = replace(html, "summary", summary);

    /* Experience */

    const experience = resume.candidate_experience?.length
        ? resume.candidate_experience.map((exp: any) => {
            const isPresent = exp.currentlyWorking || !exp.endYear;

            return `

<div class="timeline_item">

    <div class="timeline_item_info">

        <div class="company">
            ${escapeHtml(String(exp.companyName ?? ""))}
        </div>

        <div class="position">
            ${escapeHtml(String(exp.jobTitle ?? ""))}
        </div>

        ${exp.location
                    ? `
<div class="location">
    ${escapeHtml(String(exp.location))}
</div>
`
                    : ""}

        ${exp.description
                    ? `<div class="description">${nl2br(exp.description)}</div>`
                    : ""}

    </div>

    <span class="date">

        ${escapeHtml(String(exp.startMonth ?? ""))} ${escapeHtml(String(exp.startYear ?? ""))}

        -

        ${isPresent
                    ? "Present"
                    : `${escapeHtml(String(exp.endMonth ?? ""))} ${escapeHtml(String(exp.endYear ?? ""))}`}

    </span>

</div>

`;
        }).join("")
        : "";

    html = replace(html, "experience", experience);

    /* Education */

    const education = resume.candidate_education?.length
        ? resume.candidate_education.map((edu: any) => {
            return `

<div class="timeline_item">

    <div class="timeline_item_info">

        <div class="school">
            ${escapeHtml(String(edu.instituteName ?? ""))}
        </div>

        <div class="degree">
            ${escapeHtml(String(edu.courseDegree ?? ""))}
        </div>

        ${edu.educationLevel
                    ? `
<div class="location">
    ${escapeHtml(String(edu.educationLevel))}
</div>
`
                    : ""}

        ${edu.grade
                    ? `
<div class="grade">
    Grade: ${escapeHtml(String(edu.grade))}
</div>
`
                    : ""}

    </div>

    <span class="date">

        ${escapeHtml(String(edu.startYear ?? ""))}

        -

        ${edu.currentlyStudying
                    ? "Present"
                    : escapeHtml(String(edu.passingYear ?? ""))}

    </span>

</div>

`;
        }).join("")
        : "";

    html = replace(html, "education", education);

    /* Skills */

    const skills = resume.candidate_skills?.length
        ? resume.candidate_skills
            .map((skill: any) => `
<li class="skill">
    ${escapeHtml(String(skill.skillName ?? ""))}
</li>
`)
            .join("")
        : "";

    html = replace(html, "skills", skills);

    return html;
};