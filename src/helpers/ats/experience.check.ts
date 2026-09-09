import { ATSResume, ATSCheckResult, ATSIssue } from "../../types/ats.types";
import { addIssue, hasText } from "../../helpers/ats.helpers";

export function checkExperience(resume: ATSResume): ATSCheckResult {
  const issues: ATSIssue[] = [];
  const experiences = resume.resume_experience || [];
  let score = 0;

  if (!experiences.length) {
    addIssue(issues, "error", "Work experience is missing.", "experience");
    return { type: "experience", score: 0, maxScore: 100, issues };
  }

  score += 20;

  for (const experience of experiences) {
    const description = experience.description?.trim() || "";

    if (hasText(experience.company)) score += 15;
    else addIssue(issues, "error", "Company name is missing.", "company");

    if (hasText(experience.role)) score += 15;
    else addIssue(issues, "error", "Job title is missing.", "role");

    if (experience.startDate) score += 7;
    else addIssue(issues, "warning", "Start date is missing.", "startDate");

    if (experience.isCurrent || experience.endDate) score += 8;
    else addIssue(issues, "warning", "End date is missing.", "endDate");

    if (description) {
      score += 15;
    } else {
      addIssue(
        issues,
        "warning",
        "Add responsibilities and achievements for this position.",
        "description"
      );
    }

    if (description) {
      const bullets = description
        .split("\n")
        .map(line => line.trim())
        .filter(Boolean);

      if (bullets.length >= 3) score += 10;
      else {
        score += 5;
        addIssue(
          issues,
          "suggestion",
          "Add at least 3 bullet points for this position.",
          "description"
        );
      }

      if (/\d+%|\d+\+|\b\d+\s*(users|projects|employees|developers|years?|months?)\b/i.test(description)) {
        score += 10;
      } else {
        score += 5;
        addIssue(
          issues,
          "suggestion",
          "Add measurable results to your experience.",
          "description"
        );
      }
    }
  }

  return {
    type: "experience",
    score: Math.min(score, 95),
    maxScore: 100,
    issues,
  };
}