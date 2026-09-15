import { ATSResume, ATSCheckResult, ATSIssue } from "../../types/ats.types";
import { addIssue, getATSRating, hasText } from "../../helpers/ats.helpers";

export function checkEducation(resume: ATSResume): ATSCheckResult {
  const issues: ATSIssue[] = [];
  const education = resume.resume_education || [];

  if (!education.length) {
    addIssue(issues, "error", "Education section is missing.", "education");
    return { type: "education", score: 0, maxScore: 100, issues, rating: getATSRating(0) };
  }

  let baseScore = 20; // Section presence base score
  let totalItemsScore = 0;

  education.forEach((item, index) => {
    let itemScore = 0;
    const eduLabel = item.school || item.degree || `Education #${index + 1}`;

    // School Name - 30%
    if (hasText(item.school)) {
      itemScore += 30;
    } else {
      addIssue(issues, "error", `School or institution name is missing for "${eduLabel}".`, "school");
    }

    // Degree / Qualification - 30%
    if (hasText(item.degree)) {
      itemScore += 30;
    } else {
      addIssue(issues, "warning", `Degree or qualification is missing for "${eduLabel}".`, "degree");
    }

    // Start Date - 10%
    if (item.startDate) {
      itemScore += 10;
    } else {
      addIssue(issues, "warning", `Education start date is missing for "${eduLabel}".`, "startDate");
    }

    // End Date or Current - 10%
    if (item.isCurrent || item.endDate) {
      itemScore += 10;
    } else {
      addIssue(issues, "warning", `Education end date is missing for "${eduLabel}".`, "endDate");
    }

    // Date Logic Check - 10%
    if (item.startDate && item.endDate && !item.isCurrent) {
      const startDate = new Date(item.startDate);
      const endDate = new Date(item.endDate);

      if (startDate <= endDate) {
        itemScore += 10;
      } else {
        addIssue(
          issues,
          "error",
          `Start date cannot be later than end date for "${eduLabel}".`,
          "date"
        );
      }
    } else if (item.isCurrent) {
      itemScore += 10;
    }

    // GPA / Academic Distinction - 10%
    if (hasText(item.gpa)) {
      itemScore += 10;
    }

    totalItemsScore += itemScore;
  });

  // Calculate normalized item score based on entry count (Max 80 points across entries)
  const averageItemScore = Math.round((totalItemsScore / education.length) * 0.8);
  const calculatedScore = baseScore + averageItemScore;

  // Cap score strictly at 95
  const finalScore = Math.min(calculatedScore, 95);

  return {
    type: "education",
    score: finalScore,
    maxScore: 100,
    issues,
    rating: getATSRating(finalScore),
  };
}