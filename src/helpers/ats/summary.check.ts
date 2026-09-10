import { ATSResume, ATSCheckResult, ATSIssue } from "../../types/ats.types";
import { addIssue, getATSRating, hasText } from "../../helpers/ats.helpers";

export function checkSummary(resume: ATSResume): ATSCheckResult {
  const issues: ATSIssue[] = [];
  let score = 0;
  const summary = resume.summary?.trim() || "";

  if (!hasText(summary)) {
    addIssue(issues, "error", "Professional summary is missing.", "summary");
    return { type: "summary", score: 0, maxScore: 100, issues };
  }

  // Presence - 25
  score += 25;

  // Length - 20
  if (summary.length >= 100 && summary.length <= 600) {
    score += 20;
  } else if (summary.length >= 70) {
    score += 12;
    addIssue(issues, "warning", "Summary could be more detailed.", "summary");
  } else {
    score += 5;
    addIssue(issues, "warning", "Summary is too short.", "summary");
  }

  // Role/title clarity - 20
  const roleWords = [
    "developer", "engineer", "designer", "manager",
    "analyst", "consultant", "specialist", "administrator"
  ];

  if (roleWords.some(word => summary.toLowerCase().includes(word))) {
    score += 20;
  } else {
    score += 10;
    addIssue(issues, "warning", "Clearly mention your professional role in the summary.", "summary");
  }

  // Relevant keywords - 15
  const keywordPattern =
    /\b(JavaScript|TypeScript|React|Node\.js|Python|Java|SQL|AWS|Docker|API|database|software|web)\b/i;

  if (keywordPattern.test(summary)) {
    score += 15;
  } else {
    score += 7;
    addIssue(issues, "suggestion", "Consider mentioning relevant technical or professional skills.", "summary");
  }

  // Achievements - 10
  if (/\d+%|\d+\+|\b\d+\s*(years?|months?)\b/i.test(summary)) {
    score += 10;
  } else {
    score += 5;
    addIssue(issues, "suggestion", "Add a measurable achievement or result.", "summary");
  }

  // Clarity - 10
  const sentences = summary.split(/[.!?]+/).filter(Boolean);

  if (sentences.length >= 2 && sentences.length <= 5) {
    score += 10;
  } else {
    score += 5;
    addIssue(issues, "suggestion", "Keep the summary concise and easy to scan.", "summary");
  }

  // Never allow a perfect score
  score = Math.min(score, 95);

  return {
    type: "summary",
    score,
    maxScore: 100,
    issues,
    rating: getATSRating(score)
  };
}