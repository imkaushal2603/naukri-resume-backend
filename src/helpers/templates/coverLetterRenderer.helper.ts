import { renderCoverLetterQuill } from "../../../public/templates/cover-letter/quill/renderer";
import { renderCoverLetterFolio } from "../../../public/templates/cover-letter/folio/renderer";
import { renderCoverLetterVellum } from "../../../public/templates/cover-letter/vellum/renderer";
import { renderCoverLetterHeather } from "../../../public/templates/cover-letter/heather/renderer";
import { renderCoverLetterEmber } from "../../../public/templates/cover-letter/ember/renderer";
import { renderCoverLetterPostmark } from "../../../public/templates/cover-letter/postmark/renderer";
import { renderCoverLetterSaffron } from "../../../public/templates/cover-letter/saffron/renderer";
import { renderCoverLetterDossier } from "../../../public/templates/cover-letter/dossier/renderer";
// import { renderCoverLetterPewter } from "../../../public/templates/cover-letter/pewter/renderer";

const coverLetterTemplateMap: Record<string, (data: any) => string> = {
    Quill: renderCoverLetterQuill,
    folio: renderCoverLetterFolio,
    vellum: renderCoverLetterVellum,
    heather: renderCoverLetterHeather,
    ember: renderCoverLetterEmber,
    postmark: renderCoverLetterPostmark,
    saffron: renderCoverLetterSaffron,
    dossier: renderCoverLetterDossier,
    // pewter: renderCoverLetterPewter,
};

export const COVER_LETTER_TEMPLATES = [
    { key: "quill", name: "Quill" },
    { key: "folio", name: "Folio" },
    { key: "vellum", name: "Vellum" },
    { key: "heather", name: "Heather" },
    { key: "ember", name: "Ember" },
    { key: "postmark", name: "Postmark" },
    { key: "saffron", name: "Saffron" },
    { key: "dossier", name: "Dossier" },
    // { key: "pewter", name: "Pewter" }
];

export const renderCoverLetter = (templateKey: string, data: any): string => {
    const renderer = coverLetterTemplateMap[templateKey] || renderCoverLetterQuill;
    return renderer(data);
};