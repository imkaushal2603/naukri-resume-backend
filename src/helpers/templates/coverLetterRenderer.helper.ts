import { renderCoverLetterClassic } from "../../../public/templates/cover-letter/classic/renderer";
import { renderCoverLetterModern } from "../../../public/templates/cover-letter/modern/renderer";
import { renderCoverLetterMinimal } from "../../../public/templates/cover-letter/minimal/renderer";

const coverLetterTemplateMap: Record<string, (data: any) => string> = {
    classic: renderCoverLetterClassic,
    modern: renderCoverLetterModern,
    minimal: renderCoverLetterMinimal,
};

export const COVER_LETTER_TEMPLATES = [
    { key: "classic", name: "Classic" },
    { key: "modern", name: "Modern" },
    { key: "minimal", name: "Minimal" },
];

export const renderCoverLetter = (templateKey: string, data: any): string => {
    const renderer = coverLetterTemplateMap[templateKey] || renderCoverLetterClassic;
    return renderer(data);
};