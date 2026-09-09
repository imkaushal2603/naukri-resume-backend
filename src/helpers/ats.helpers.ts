import { ATSIssue } from "../types/ats.types";

export function addIssue(
    issues: ATSIssue[],
    type: ATSIssue["type"],
    message: string,
    field?: string
) {
    issues.push({ type, message, ...(field && { field }) });
}

export function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPhone(phone: string) {
    const digits = phone.replace(/\D/g, "");
    return digits.length >= 7 && digits.length <= 15;
}

export function isValidUrl(url: string) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

export function hasText(value: string | null | undefined) {
    return Boolean(value?.trim());
}

export function calculatePercentage(score: number, maxScore: number) {
    return maxScore === 0 ? 0 : Math.round((score / maxScore) * 100);
}
export function getATSRating(percentage: number) {

    if (percentage >= 90) {
        return "Excellent";
    }

    if (percentage >= 80) {
        return "Very Good";
    }

    if (percentage >= 70) {
        return "Good";
    }

    if (percentage >= 50) {
        return "Needs Improvement";
    }

    return "Poor";
}