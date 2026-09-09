import { ATSResume, ATSCheckResult, ATSIssue } from "../../types/ats.types";
import { addIssue, hasText, isValidEmail, isValidPhone, isValidUrl } from "../../helpers/ats.helpers";

export function checkContact(resume: ATSResume): ATSCheckResult {
    const issues: ATSIssue[] = [];
    let score = 0;

    // Full name - 25
    if (hasText(resume.fullName)) score += 25;
    else addIssue(issues, "error", "Full name is missing.", "fullName");

    // Email - 25
    if (!hasText(resume.email)) {
        addIssue(issues, "error", "Email address is missing.", "email");
    } else if (!isValidEmail(resume.email!)) {
        score += 10;
        addIssue(issues, "warning", "Email address format appears invalid.", "email");
    } else score += 25;

    // Phone - 20
    if (!hasText(resume.phone)) {
        addIssue(issues, "warning", "Phone number is missing.", "phone");
    } else if (!isValidPhone(resume.phone!)) {
        score += 10;
        addIssue(issues, "warning", "Phone number format may need improvement.", "phone");
    } else score += 20;

    // Location - 15
    if (hasText(resume.city) || hasText(resume.state) || hasText(resume.country)) {
        score += 15;
    } else {
        addIssue(issues, "suggestion", "Consider adding your location.", "location");
    }

    // LinkedIn - 10
    if (!hasText(resume.linkedin)) {
        addIssue(issues, "suggestion", "Consider adding your LinkedIn profile.", "linkedin");
    } else if (!isValidUrl(resume.linkedin!)) {
        score += 5;
        addIssue(issues, "warning", "LinkedIn URL appears invalid.", "linkedin");
    } else score += 10;

    // GitHub - 5

    if (!hasText(resume.github)) {
        addIssue(issues, "suggestion", "Consider adding your GitHub profile.", "github");
    } else score += 5;

    return { type: "contact", score, maxScore: 100, issues };
}