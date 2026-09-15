import { ATSResume, ATSCheckResult, ATSIssue } from "../../types/ats.types";
import { addIssue, getATSRating, hasText } from "../../helpers/ats.helpers";

export function checkSummary(resume: ATSResume): ATSCheckResult {
  const issues: ATSIssue[] = [];
  let score = 0;
  const summary = resume.summary?.trim() || "";

  if (!hasText(summary)) {
    addIssue(issues, "error", "Professional summary is missing.", "summary");
    return { type: "summary", score: 0, maxScore: 100, issues, rating: getATSRating(0) };
  }

  // Presence - 25
  score += 25;

  // Length - 20
  if (summary.length >= 100 && summary.length <= 600) {
    score += 20;
  } else if (summary.length >= 70) {
    score += 12;
    addIssue(issues, "warning", "Summary could be more detailed (aim for 100-600 characters).", "summary");
  } else {
    score += 5;
    addIssue(issues, "warning", "Summary is too short for ATS evaluation.", "summary");
  }

  // Role/title clarity - 20
  const roleWords = [
    "developer", "engineer", "designer", "manager", "lead",
    "analyst", "consultant", "specialist", "administrator", "architect"
  ];

  if (roleWords.some((word) => summary.toLowerCase().includes(word))) {
    score += 20;
  } else {
    score += 10;
    addIssue(issues, "warning", "Clearly mention your core professional title in the summary.", "summary");
  }

  // Dynamic Skills & Industry Keywords - 15
  const userSkills = (resume.resume_skills || [])
    .map((s) => s.name?.trim().toLowerCase())
    .filter((name): name is string => Boolean(name));

  const containsUserSkill = userSkills.some((skill) => summary.toLowerCase().includes(skill));
  const fallbackKeywordsPattern = /\b(JavaScript|TypeScript|React|Node\.js|Python|Java|SQL|AWS|Docker|API|database|software|web|design|management)\b/i;

  if (containsUserSkill || fallbackKeywordsPattern.test(summary)) {
    score += 15;
  } else {
    score += 7;
    addIssue(issues, "suggestion", "Incorporate key technical or professional skills directly into your summary.", "summary");
  }

  // Quantifiable Achievements - 10
  if (/\d+%|\d+\+|\b\d+\s*(years?|months?|projects?|clients?)\b/i.test(summary)) {
    score += 10;
  } else {
    score += 5;
    addIssue(issues, "suggestion", "Add a measurable result or metric to your summary.", "summary");
  }

  // Clarity & Sentence Structure - 10
  const sentences = summary.split(/[.!?]+/).filter(Boolean);

  if (sentences.length >= 2 && sentences.length <= 5) {
    score += 10;
  } else {
    score += 5;
    addIssue(issues, "suggestion", "Keep the summary concise (aim for 2 to 4 sentences).", "summary");
  }

  const finalScore = Math.min(score, 95);

  return {
    type: "summary",
    score: finalScore,
    maxScore: 100,
    issues,
    rating: getATSRating(finalScore),
  };
}