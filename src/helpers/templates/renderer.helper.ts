import { renderClassic } from "../../../public/templates/classic/renderer";
import { renderProfessional } from "../../../public/templates/professional/renderer";
import { renderModern } from "../../../public/templates/modern/renderer";
import { renderMinimal } from "../../../public/templates/minimal/renderer";

const templateMap: Record<string, (userData: any) => string> = {
    classic: renderClassic,
    professional: renderProfessional,
    modern: renderModern,
    minimal: renderMinimal,
};

export const renderResumeTemplate = (templateKey: string, userData: any): string => {
    const renderer = templateMap[templateKey] || renderClassic;
    return renderer(userData);
};