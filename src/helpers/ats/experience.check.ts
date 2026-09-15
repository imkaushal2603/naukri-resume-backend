import { ATSResume, ATSCheckResult, ATSIssue } from "../../types/ats.types";
import { addIssue, getATSRating, hasText } from "../../helpers/ats.helpers";

export function checkExperience(resume: ATSResume): ATSCheckResult {
  const issues: ATSIssue[] = [];
  const experiences = resume.resume_experience || [];

  if (!experiences.length) {
    addIssue(issues, "error", "Work experience section is missing.", "experience");
    return { type: "experience", score: 0, maxScore: 100, issues, rating: getATSRating(0) };
  }

  const baseScore = 20;
  let totalItemsScore = 0;

  experiences.forEach((experience, index) => {
    let itemScore = 0;
    const description = experience.description?.trim() || "";
    const jobLabel = experience.role || experience.company || `Position #${index + 1}`;

    // Company & Role checks (30 pts combined)
    if (hasText(experience.company)) itemScore += 15;
    else addIssue(issues, "error", `Company name is missing for "${jobLabel}".`, "company");

    if (hasText(experience.role)) itemScore += 15;
    else addIssue(issues, "error", `Job title is missing for "${jobLabel}".`, "role");

    // Start & End Date checks (20 pts combined)
    if (experience.startDate) itemScore += 10;
    else addIssue(issues, "warning", `Start date is missing for "${jobLabel}".`, "startDate");

    if (experience.isCurrent || experience.endDate) itemScore += 10;
    else addIssue(issues, "warning", `End date is missing for "${jobLabel}".`, "endDate");

    // Description Quality Checks (50 pts total)
    if (description) {
      itemScore += 15; // Presence points

      // 1. Detect both newline bullets AND inline asterisks/bullets/dash points
      const bullets = description
        .split(/\n|(?=\s*[\*•\-]\s*)/)
        .map((line) => line.replace(/^[\*•\-]\s*/, "").trim())
        .filter(Boolean);

      // 2. Fallback check: count sentences if written as a paragraph
      const sentences = description.split(/[.!?]+/).filter((s) => s.trim().length > 10);

      if (bullets.length >= 3 || sentences.length >= 3) {
        itemScore += 15;
      } else {
        itemScore += 5;
        addIssue(
          issues,
          "suggestion",
          `Add at least 3 bullet points or detailed sentences for "${jobLabel}".`,
          "description"
        );
      }

      // 3. Measurable results / Metrics check
      const hasMetrics = /\d+%|\d+\+|\b\d+\s*(users|projects|employees|developers|years?|months?|clients?|teams?)\b/i.test(description);

      if (hasMetrics) {
        itemScore += 20;
      } else {
        itemScore += 5;
        addIssue(
          issues,
          "suggestion",
          `Add measurable results (e.g., %, numbers, or team size) for "${jobLabel}".`,
          "description"
        );
      }
    } else {
      addIssue(
        issues,
        "warning",
        `Add responsibilities and achievements for "${jobLabel}".`,
        "description"
      );
    }

    totalItemsScore += itemScore;
  });

  const averageItemScore = Math.round((totalItemsScore / experiences.length) * 0.8);
  const finalScore = Math.min(baseScore + averageItemScore, 95);

  return {
    type: "experience",
    score: finalScore,
    maxScore: 100,
    issues,
    rating: getATSRating(finalScore),
  };
}