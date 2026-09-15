import { ATSResume, ATSCheckResult, ATSIssue } from "../../types/ats.types";
import { addIssue, getATSRating, hasText } from "../../helpers/ats.helpers";

export function checkSkills(resume: ATSResume): ATSCheckResult {
  const issues: ATSIssue[] = [];
  const skills = resume.resume_skills || [];
  let score = 0;

  if (!skills.length) {
    addIssue(issues, "error", "Skills section is missing.", "skills");
    return { type: "skills", score: 0, maxScore: 100, issues, rating: getATSRating(0) };
  }

  // Skills section exists - 30
  score += 30;

  // Number of skills - 25
  if (skills.length >= 5) {
    score += 25;
  } else if (skills.length >= 3) {
    score += 15;
    addIssue(issues, "suggestion", "Consider adding at least 5 relevant skills.", "skills");
  } else {
    score += 5;
    addIssue(issues, "warning", "Add more relevant skills to strengthen your resume.", "skills");
  }

  // Skill names check - 20
  const validSkills = skills.filter((skill) => hasText(skill.name));

  if (validSkills.length === skills.length) {
    score += 20;
  } else {
    score += 10;
    addIssue(issues, "warning", "One or more skills have empty names.", "skills");
  }

  // Duplicate skills check - 15
  const rawSkillNames = skills
    .map((skill) => skill.name?.trim())
    .filter((name): name is string => Boolean(name));

  const lowerNames = rawSkillNames.map((name) => name.toLowerCase());
  const duplicates = rawSkillNames.filter(
    (name, index) => lowerNames.indexOf(name.toLowerCase()) !== index
  );

  if (duplicates.length === 0) {
    score += 15;
  } else {
    score += 5;
    const uniqueDupes = Array.from(new Set(duplicates));
    addIssue(
      issues,
      "warning",
      `Remove duplicate skills: ${uniqueDupes.map((d) => `"${d}"`).join(", ")}.`,
      "skills"
    );
  }

  // Skill length check - 10
  const longSkills = skills.filter((skill) => (skill.name?.trim().length || 0) > 50);

  if (longSkills.length === 0) {
    score += 10;
  } else {
    score += 5;
    addIssue(
      issues,
      "suggestion",
      "Keep skill names concise (under 50 characters) for optimal ATS readability.",
      "skills"
    );
  }

  const finalScore = Math.min(score, 95);

  return {
    type: "skills",
    score: finalScore,
    maxScore: 100,
    issues,
    rating: getATSRating(finalScore),
  };
}