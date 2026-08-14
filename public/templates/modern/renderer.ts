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

export const renderModern = (resume: any): string => {

    let html = loadTemplate("modern");

    const fullName = [
        resume.firstName,
        resume.lastName
    ]
        .filter(Boolean)
        .join(" ");

    html = replace(
        html,
        "name",
        escapeHtml(fullName)
    );

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


    const address = [
        resume.city,
        resume.state,
        resume.country
    ]
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

    const experience = resume.candidate_experience?.length
        ? resume.candidate_experience.map((exp: any) => {
            const start = formatMonthYear(exp.startDate);
            const end = formatMonthYear(exp.endDate);
            const isPresent = exp.isCurrent || !exp.endDate;

            return `

<div class="timeline_item">

    <div class="timeline_item_info">

        <div class="company">
            ${escapeHtml(exp.company)}
        </div>

        <div class="position">
            ${escapeHtml(exp.role)}
        </div>

        ${exp.location
                ? `
<div class="location">
    ${escapeHtml(exp.location)}
</div>
`
                : ""
            }


${exp.description
                ? `<div class="description">${nl2br(exp.description)}</div>`
                : ""}



    </div>

    <span class="date">

        ${start.month} ${start.year}

        -

        ${isPresent
                ? "Present"
                : `${end.month} ${end.year}`
            }

    </span>

</div>

`;
        }).join("")
        : "";

    html = replace(
        html,
        "experience",
        experience
    );

    const education = resume.candidate_education?.length
        ? resume.candidate_education.map((edu: any) => {
            const start = formatMonthYear(edu.startDate);
            const end = formatMonthYear(edu.endDate);

            return `

<div class="timeline_item">

    <div class="timeline_item_info">

        <div class="school">
            ${escapeHtml(edu.school)}
        </div>

        <div class="degree">
            ${escapeHtml(edu.degree)}
        </div>

        ${edu.fieldOfStudy
                ? `
<div class="location">
    ${escapeHtml(edu.fieldOfStudy)}
</div>
`
                : ""
            }

        ${edu.gpa
                ? `
<div class="grade">
    Grade: ${escapeHtml(edu.gpa)}
</div>
`
                : ""
            }

    </div>

    <span class="date">

        ${start.year}

        -

        ${edu.isCurrent
                ? "Present"
                : escapeHtml(end.year)
            }

    </span>

</div>

`;
        }).join("")
        : "";

    html = replace(
        html,
        "education",
        education
    );

    const skills = resume.candidate_skills?.length
        ? resume.candidate_skills
            .map((skill: any) => `
<li class="skill">
    ${escapeHtml(skill.name)}
</li>
`)
            .join("")
        : "";

    html = replace(
        html,
        "skills",
        skills
    );

    return html;
};