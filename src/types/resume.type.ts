export interface ParsedResumeData {
    basicInfo: {
        fullName: string | null;
        email: string | null;
        phone: string | null;
        country: string | null;
        state: string | null;
        city: string | null;
        zipCode: string | null;
        linkedin: string | null;
        github: string | null;
    };
    summary: string | null;
    education: Array<{
        school: string | null;
        degree: string | null;
        educationLevel: string | null;
        startDate: string | null;
        endDate: string | null;
        isCurrent: boolean;
        gpa: string | null;
    }>;
    experience: Array<{
        company: string | null;
        role: string | null;
        location: string | null;
        employmentType: string | null;
        startDate: string | null;
        endDate: string | null;
        isCurrent: boolean;
        description: string | null;
    }>;
    skills: string[];
}