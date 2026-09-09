import { ATSResume, ATSCheckResult, ATSIssue } from "../../types/ats.types";
import { addIssue, hasText } from "../../helpers/ats.helpers";

export function checkSkills(resume: ATSResume): ATSCheckResult {
  const issues: ATSIssue[] = [];
  const skills = resume.resume_skills || [];
  let score = 0;

  if (!skills.length) {
    addIssue(issues, "error", "Skills section is missing.", "skills");
    return { type: "skills", score: 0, maxScore: 100, issues };
  }

  // Skills section exists - 30
  score += 30;

  // Number of skills - 25
  if (skills.length >= 5) {
    score += 25;
  } else if (skills.length >= 3) {
    score += 15;
    addIssue(issues, "suggestion", "Consider adding more relevant skills.", "skills");
  } else {
    score += 5;
    addIssue(issues, "warning", "Add more relevant skills to strengthen your resume.", "skills");
  }

  // Skill names - 20
  const validSkills = skills.filter(skill => hasText(skill.name));

  if (validSkills.length === skills.length) {
    score += 20;
  } else {
    score += 10;
    addIssue(issues, "warning", "One or more skills have no name.", "skills");
  }

  // Duplicate skills - 15
  const skillNames = skills
    .map(skill => skill.name?.trim().toLowerCase())
    .filter(Boolean);

  const uniqueSkills = new Set(skillNames);

  if (uniqueSkills.size === skillNames.length) {
    score += 15;
  } else {
    score += 5;
    addIssue(issues, "warning", "Remove duplicate skills.", "skills");
  }

  // Skill length - 10
  const hasLongSkill = skills.some(
    skill => (skill.name?.trim().length || 0) > 50
  );

  if (!hasLongSkill) {
    score += 10;
  } else {
    score += 5;
    addIssue(
      issues,
      "suggestion",
      "Keep skill names short and easy for ATS systems to read.",
      "skills"
    );
  }

  return {
    type: "skills",
    score: Math.min(score, 95),
    maxScore: 100,
    issues,
  };
}