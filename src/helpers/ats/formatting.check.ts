import { ATSResume, ATSCheckResult, ATSIssue } from "../../types/ats.types";
import { addIssue, getATSRating, hasText } from "../../helpers/ats.helpers";

export function checkFormatting(resume: ATSResume): ATSCheckResult {
  const issues: ATSIssue[] = [];
  let score = 0;

  const template = resume.resume_templates;

  if (!template) {
    addIssue(issues, "error", "Resume template information is missing.", "template");
    return { type: "formatting", score: 0, maxScore: 100, issues, rating: getATSRating(0) };
  }

  // Template exists - 25
  score += 25;

  // Template name - 15
  if (hasText(template.name)) {
    score += 15;
  } else {
    addIssue(issues, "warning", "Template name is missing.", "template");
  }

  // Template key - 15
  if (hasText(template.templateKey)) {
    score += 15;
  } else {
    addIssue(issues, "warning", "Template configuration is incomplete.", "template");
  }

  // Template active - 15
  if (template.status) {
    score += 15;
  } else {
    addIssue(issues, "warning", "The selected resume template is inactive.", "template");
  }

  // Profile photo check - 10
  if (!resume.profilePhoto) {
    score += 10;
  } else {
    score += 5;
    addIssue(
      issues,
      "suggestion",
      "Consider removing the profile photo for optimal ATS parsing.",
      "profilePhoto"
    );
  }

  // Safely verify text content presence - 20
  const hasContent =
    hasText(resume.fullName) ||
    hasText(resume.summary) ||
    (resume.resume_experience || []).length > 0 ||
    (resume.resume_education || []).length > 0 ||
    (resume.resume_skills || []).length > 0;

  if (hasContent) {
    score += 20;
  } else {
    addIssue(issues, "error", "Resume contains very little readable content.", "content");
  }

  const finalScore = Math.min(score, 95);

  return {
    type: "formatting",
    score: finalScore,
    maxScore: 100,
    issues,
    rating: getATSRating(finalScore)
  };
}