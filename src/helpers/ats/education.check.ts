import { ATSResume, ATSCheckResult, ATSIssue } from "../../types/ats.types";
import { addIssue, hasText } from "../../helpers/ats.helpers";

export function checkEducation(resume: ATSResume): ATSCheckResult {
  const issues: ATSIssue[] = [];
  const education = resume.resume_education || [];
  let score = 0;

  if (!education.length) {
    addIssue(issues, "error", "Education section is missing.", "education");
    return { type: "education", score: 0, maxScore: 100, issues };
  }

  score += 20;

  for (const item of education) {
    if (hasText(item.school)) score += 20;
    else addIssue(issues, "error", "School or institution name is missing.", "school");

    if (hasText(item.degree)) score += 20;
    else addIssue(issues, "warning", "Degree or qualification is missing.", "degree");

    if (item.startDate) score += 10;
    else addIssue(issues, "warning", "Education start date is missing.", "startDate");

    if (item.isCurrent || item.endDate) score += 10;
    else addIssue(issues, "warning", "Education end date is missing.", "endDate");

    if (item.startDate && item.endDate && !item.isCurrent) {
      const startDate = new Date(item.startDate);
      const endDate = new Date(item.endDate);

      if (startDate <= endDate) {
        score += 10;
      } else {
        addIssue(
          issues,
          "error",
          "Education start date cannot be later than end date.",
          "date"
        );
      }
    } else if (item.isCurrent) {
      score += 10;
    }

    if (hasText(item.gpa)) {
      score += 10;
    }
  }

  return {
    type: "education",
    score: Math.min(score, 95),
    maxScore: 100,
    issues,
  };
}