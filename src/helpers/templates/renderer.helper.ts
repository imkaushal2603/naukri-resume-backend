import { renderClassic } from "../../../public/templates/resumes/classic/renderer";
import { renderProfessional } from "../../../public/templates/resumes/professional/renderer";
import { renderMinimal } from "../../../public/templates/resumes/minimal/renderer";
import { renderOnyx } from "../../../public/templates/resumes/onyx/renderer";
import { renderHarbor } from "../../../public/templates/resumes/harbor/renderer";
import { renderUmber } from "../../../public/templates/resumes/umber/renderer";
import { renderPulse } from "../../../public/templates/resumes/pulse/renderer";

const templateMap: Record<string, (userData: any) => string> = {
    classic: renderClassic,
    professional: renderProfessional,
    minimal: renderMinimal,
    onyx: renderOnyx,
    harbor: renderHarbor,
    umber: renderUmber,
    pulse: renderPulse,
};

export const renderResumeTemplate = (templateKey: string, userData: any): string => {
    const renderer = templateMap[templateKey] || renderClassic;
    return renderer(userData);
};