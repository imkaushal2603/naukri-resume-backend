import OpenAI from "openai";
import { ATSResume } from "../../types/ats.types";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface DetailedAICheckResult {
    contactValid: boolean;
    contactScore: number;
    contactIssues: string[];
    educationScore: number;
    educationIssues: string[];
    experienceScore: number;
    experienceIssues: string[];
    skillsScore: number;
    skillsIssues: string[];
    summaryScore: number;
    summaryIssues: string[];
    overallAuthenticityScore: number;
    isFakeResume: boolean;
    suggestedSkills: string[];
}

export async function checkWithAI(resume: ATSResume): Promise<DetailedAICheckResult> {
    const resumeData = {
        fullName: resume.fullName,
        city: resume.city,
        state: resume.state,
        country: resume.country,
        summary: resume.summary || "",
        experience: (resume.resume_experience || []).map((e) => ({
            role: e.role,
            company: e.company,
            location: e.location,
            startDate: e.startDate,
            endDate: e.endDate,
            isCurrent: e.isCurrent,
            description: e.description,
        })),
        education: (resume.resume_education || []).map((e) => ({
            school: e.school,
            degree: e.degree,
            educationLevel: e.educationLevel,
            startDate: e.startDate,
            endDate: e.endDate,
        })),
        skills: (resume.resume_skills || []).map((s) => s.name),
    };

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            temperature: 0,
            messages: [
                {
                    role: "system",
                    content: `You are an aggressive ATS auditor and resume fraud detector. Evaluate every single field strictly.

CRITICAL AUDIT RULES:
1. Contact & Location: Verify if full name looks like a real human name, and city/state/country are real places. Penalize fake, gibberish, or number-based names/locations (e.g. "345435"). Assign a contactScore reflecting this.
2. Education: Verify if school/university names are real institutions. Degree must be valid. Dates must be coherent.
3. Experience: Job titles and company names must be realistic (e.g. "trds" as company/role is strictly fake). Check if dates are realistic and descriptions are non-gibberish. ALWAYS include the job title or company name in experienceIssues (e.g., 'Add measurable results (e.g., %, performance gains, or scale metrics) for "Senior Software Engineer"').
4. Skills: Check if minimum 5 skills are present AND directly relevant to the experience/roles listed. Penalize generic or random lists.
5. Summary: Ensure it aligns with the role and isn't low-effort filler text.

MANDATORY FEEDBACK RULE:
If you give ANY section score (contactScore, educationScore, experienceScore, skillsScore, summaryScore) less than 80, you MUST provide at least one clear, actionable feedback string in that section's corresponding issues array (contactIssues, educationIssues, etc.) detailing EXACTLY why the score was reduced. NEVER return a score under 80 with an empty issues array.

SCORING CRITERIA:
- If a section contains fake/gibberish words (like "trds", "asdf") or a fake/numeric location or name, score that section between 10 and 20 — not 0, since the field is present and structurally complete, it is only the content authenticity that is being penalized. Only use a score below 10 if the section is entirely empty or completely unparseable.
- Set "isFakeResume" to true if more than 2 fields contain gibberish or fake data.

Return strictly JSON matching this structure (these are example values showing the FORMAT only — replace every value with your own real analysis of the actual resume provided):
{
  "contactValid": false,
  "contactScore": 0,
  "contactIssues": ["<describe the specific contact/location problem found, or leave empty array if none>"],
  "educationScore": 0,
  "educationIssues": ["<describe the specific education problem found, or leave empty array if none>"],
  "experienceScore": 0,
  "experienceIssues": ["<describe the specific experience problem found, or leave empty array if none>"],
  "skillsScore": 0,
  "skillsIssues": ["<describe the specific skills problem found, or leave empty array if none>"],
  "summaryScore": 0,
  "summaryIssues": ["<describe the specific summary problem found, or leave empty array if none>"],
  "overallAuthenticityScore": 0,
  "isFakeResume": false,
  "suggestedSkills": ["<skill 1>", "<skill 2>"]
}`,
                },
                {
                    role: "user",
                    content: `Today's date: ${new Date().toISOString().split("T")[0]}\n\nResume Data:\n${JSON.stringify(resumeData, null, 2)}`,
                },
            ],
            response_format: { type: "json_object" },
        });
        return JSON.parse(completion.choices[0].message.content || "{}");
    } catch (err) {
        console.error("AI Check Failed:", err);
        return {
            contactValid: true,
            contactScore: 50,
            contactIssues: [],
            educationScore: 50,
            educationIssues: [],
            experienceScore: 50,
            experienceIssues: [],
            skillsScore: 50,
            skillsIssues: [],
            summaryScore: 50,
            summaryIssues: [],
            overallAuthenticityScore: 50,
            isFakeResume: false,
            suggestedSkills: [],
        };
    }
}

export async function getCoverLetterSummarySuggestions(
    jobTitle: string,
    companyName?: string,
    excludeSummaries: string[] = []
): Promise<string[]> {
    let activeExcludes = excludeSummaries;
    if (activeExcludes.length > 15) {
        activeExcludes = [];
    }

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            temperature: 0.85,
            messages: [
                {
                    role: "system",
                    content: `You are an expert career coach writing cover letter opening paragraphs.

First, check if the provided Job Title is a real, recognizable job title (e.g. "Software Engineer", "Marketing Manager", "Nurse"). If it is NOT a real job title — if it's gibberish, a number, a random string, or too vague to identify a profession — respond with exactly: {"suggestions": []}

If it IS a real job title, given the job title (and optionally a company name), write 3 distinct, professional cover letter body paragraphs a candidate could use as a starting point. Each should:
- Be 3-5 sentences, written in first person
- Sound confident and specific to the role, without fabricating specific achievements or company details the candidate hasn't provided
- Vary in tone/angle across the 3 (e.g. one emphasizing skills, one enthusiasm/fit, one experience)
- DO NOT repeat any paragraph listed in EXCLUDE_LIST, and avoid near-identical phrasing to it

Output ONLY valid JSON: {"suggestions": ["...", "...", "..."]}`,
                },
                {
                    role: "user",
                    content: `Job Title: ${jobTitle}\nCompany: ${companyName || "N/A"}\nEXCLUDE_LIST: ${JSON.stringify(activeExcludes)}`,
                },
            ],
            response_format: { type: "json_object" },
        });

        const parsed = JSON.parse(completion.choices[0].message.content || "{}");
        return Array.isArray(parsed.suggestions) ? parsed.suggestions.slice(0, 3) : [];
    } catch (err: any) {
        console.error("Cover letter summary suggestion failed:", err?.message || err);
        return [];
    }
}