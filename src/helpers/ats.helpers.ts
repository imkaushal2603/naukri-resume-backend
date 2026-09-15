import { ATSIssue } from "../types/ats.types";

export function addIssue(
    issues: ATSIssue[],
    type: ATSIssue["type"],
    message: string,
    field?: string
) {
    // Prevent pushing duplicate issue messages
    const exists = issues.some(
        (issue) => issue.message === message && issue.field === field
    );
    if (!exists) {
        issues.push({ type, message, ...(field && { field }) });
    }
}

export function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function isValidPhone(phone: string): boolean {
    const digits = phone.replace(/\D/g, "");
    return digits.length >= 7 && digits.length <= 15;
}

export function isValidUrl(url: string): boolean {
    const trimmed = url.trim();
    if (!trimmed) return false;
    
    // Auto-prepend https:// if protocol is missing for standard URL parsing
    const formattedUrl = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    
    try {
        const parsed = new URL(formattedUrl);
        return Boolean(parsed.hostname && parsed.hostname.includes("."));
    } catch {
        return false;
    }
}

export function hasText(value: string | null | undefined): boolean {
    return Boolean(value?.trim());
}

export function calculatePercentage(score: number, maxScore: number): number {
    if (!maxScore || maxScore <= 0) return 0;
    const percentage = Math.round((score / maxScore) * 100);
    return Math.min(Math.max(percentage, 0), 100);
}

export function getATSRating(percentage: number): "Excellent" | "Very Good" | "Good" | "Needs Improvement" | "Poor" {
    if (percentage >= 90) return "Excellent";
    if (percentage >= 80) return "Very Good";
    if (percentage >= 70) return "Good";
    if (percentage >= 50) return "Needs Improvement";
    return "Poor";
}