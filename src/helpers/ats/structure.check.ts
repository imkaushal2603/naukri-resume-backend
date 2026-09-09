import { ATSResume, ATSCheckResult, ATSIssue } from "../../types/ats.types";
import { addIssue, hasText } from "../../helpers/ats.helpers";

export function checkStructure(resume: ATSResume): ATSCheckResult {
  const issues: ATSIssue[] = [];
  let score = 0;

  // Name - 15
  if (hasText(resume.fullName)) score += 15;
  else addIssue(issues, "error", "Name is missing.", "fullName");

  // Summary - 15
  if (hasText(resume.summary)) score += 15;
  else addIssue(issues, "suggestion", "Consider adding a professional summary.", "summary");

  // Experience - 25
  if (resume.resume_experience?.length) score += 25;
  else addIssue(issues, "error", "Work experience section is missing.", "experience");

  // Education - 20
  if (resume.resume_education?.length) score += 20;
  else addIssue(issues, "warning", "Education section is missing.", "education");

  // Skills - 20
  if (resume.resume_skills?.length) score += 20;
  else addIssue(issues, "warning", "Skills section is missing.", "skills");

  // Template - 5
  if (resume.resume_templates) {
    score += 5;
  } else {
    addIssue(issues, "warning", "Resume template information is missing.", "template");
  }

  return {
    type: "structure",
    score: Math.min(score, 95),
    maxScore: 100,
    issues,
  };
}