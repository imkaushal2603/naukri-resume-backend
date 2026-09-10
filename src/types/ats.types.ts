export type ATSCheckType =
    | "contact"
    | "summary"
    | "experience"
    | "education"
    | "skills"
    | "structure"
    | "formatting";

export type ATSSeverity =
    | "error"
    | "warning"
    | "suggestion"
    | "success";

export interface ATSIssue {
    type: ATSSeverity;
    message: string;
    field?: string;
}

export interface ATSCheckResult {
    type: ATSCheckType;
    score: number;
    maxScore: number;
    issues: ATSIssue[];
    rating?: ATSRating;
}

export interface ATSResumeResult {
    score: number;
    maxScore: number;
    percentage: number;
    rating: ATSRating;

    categories: ATSCheckResult[];

    issues: ATSIssue[];
}

export type ATSRating =
    | "Poor"
    | "Needs Improvement"
    | "Good"
    | "Very Good"
    | "Excellent";

export interface ATSResume {
    id: number;

    fullName: string | null;
    email: string | null;
    phone: string | null;

    city: string | null;
    state: string | null;
    country: string | null;
    zipCode: string | null;

    linkedin: string | null;
    github: string | null;

    summary: string | null;

    profilePhoto: string | null;

    resume_education: ATSEducation[];
    resume_experience: ATSExperience[];
    resume_skills: ATSSkill[];

    resume_templates: ATSTemplate | null;
}

export interface ATSEducation {
    id: number;
    school: string | null;
    degree: string | null;
    educationLevel: string | null;

    startDate: Date | string | null;
    endDate: Date | string | null;

    isCurrent: boolean;

    gpa: string | null;
}

export interface ATSExperience {
    id: number;

    company: string | null;
    role: string | null;
    location: string | null;
    employmentType: string | null;

    startDate: Date | string | null;
    endDate: Date | string | null;

    isCurrent: boolean;

    description: string | null;
}

export interface ATSSkill {
    id: number;

    name: string | null;
    level: string | null;
}

export interface ATSTemplate {
    id: number;
    name: string;
    templateKey: string;

    status: boolean;
    tier: string;
}