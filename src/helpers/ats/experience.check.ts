import { ATSResume, ATSCheckResult, ATSIssue } from "../../types/ats.types";
import { addIssue, getATSRating, hasText } from "../../helpers/ats.helpers";

export function checkExperience(resume: ATSResume): ATSCheckResult {
  const issues: ATSIssue[] = [];
  const experiences = resume.resume_experience || [];

  if (!experiences.length) {
    addIssue(issues, "error", "Work experience section is missing.", "experience");
    return { type: "experience", score: 0, maxScore: 100, issues, rating: getATSRating(0) };
  }

  const baseScore = 20; // Section presence base score
  let totalItemsScore = 0;

  experiences.forEach((experience, index) => {
    let itemScore = 0;
    const description = experience.description?.trim() || "";
    const jobLabel = experience.role || experience.company || `Position #${index + 1}`;

    // Company Name - 15 points
    if (hasText(experience.company)) {
      itemScore += 15;
    } else {
      addIssue(issues, "error", `Company name is missing for "${jobLabel}".`, "company");
    }

    // Job Title - 15 points
    if (hasText(experience.role)) {
      itemScore += 15;
    } else {
      addIssue(issues, "error", `Job title is missing for "${jobLabel}".`, "role");
    }

    // Start Date - 10 points
    if (experience.startDate) {
      itemScore += 10;
    } else {
      addIssue(issues, "warning", `Start date is missing for "${jobLabel}".`, "startDate");
    }

    // End Date or Current - 10 points
    if (experience.isCurrent || experience.endDate) {
      itemScore += 10;
    } else {
      addIssue(issues, "warning", `End date is missing for "${jobLabel}".`, "endDate");
    }

    // Description & Quality - 50 points total
    if (description) {
      itemScore += 15;

      const bullets = description
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

      if (bullets.length >= 3) {
        itemScore += 15;
      } else {
        itemScore += 5;
        addIssue(
          issues,
          "suggestion",
          `Add at least 3 bullet points for "${jobLabel}".`,
          "description"
        );
      }

      if (/\d+%|\d+\+|\b\d+\s*(users|projects|employees|developers|years?|months?)\b/i.test(description)) {
        itemScore += 20;
      } else {
        itemScore += 5;
        addIssue(
          issues,
          "suggestion",
          `Add measurable results to your experience for "${jobLabel}".`,
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

  // Average item scores (max 80 points) + base score (20 points)
  const averageItemScore = Math.round((totalItemsScore / experiences.length) * 0.8);
  const calculatedScore = baseScore + averageItemScore;

  const finalScore = Math.min(calculatedScore, 95);

  return {
    type: "experience",
    score: finalScore,
    maxScore: 100,
    issues,
    rating: getATSRating(finalScore),
  };
}