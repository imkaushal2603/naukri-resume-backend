import { renderCoverLetterQuill } from "../../../public/templates/cover-letter/quill/renderer";
import { renderCoverLetterFolio } from "../../../public/templates/cover-letter/folio/renderer";
import { renderCoverLetterVellum } from "../../../public/templates/cover-letter/vellum/renderer";
// import { renderCoverLetterHeather } from "../../../public/templates/cover-letter/heather/renderer";
// import { renderCoverLetterEmber } from "../../../public/templates/cover-letter/ember/renderer";

const coverLetterTemplateMap: Record<string, (data: any) => string> = {
    Quill: renderCoverLetterQuill,
    folio: renderCoverLetterFolio,
    vellum: renderCoverLetterVellum,
    // heather: renderCoverLetterHeather,
    // ember: renderCoverLetterEmber,
};

export const COVER_LETTER_TEMPLATES = [
    { key: "quill", name: "Quill" },
    { key: "folio", name: "Folio" },
    { key: "vellum", name: "Vellum" },
    // { key: "heather", name: "Heather" },
    // { key: "ember", name: "Ember" },
];

export const renderCoverLetter = (templateKey: string, data: any): string => {
    const renderer = coverLetterTemplateMap[templateKey] || renderCoverLetterQuill;
    return renderer(data);
};