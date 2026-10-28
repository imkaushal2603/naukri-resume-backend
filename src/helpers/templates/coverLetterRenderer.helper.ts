import { renderCoverLetterQuill } from "../../../public/templates/cover-letter/quill/renderer";
import { renderCoverLetterFolio } from "../../../public/templates/cover-letter/folio/renderer";
import { renderCoverLetterVellum } from "../../../public/templates/cover-letter/vellum/renderer";
import { renderCoverLetterHeather } from "../../../public/templates/cover-letter/heather/renderer";
import { renderCoverLetterEmber } from "../../../public/templates/cover-letter/ember/renderer";
import { renderCoverLetterPostmark } from "../../../public/templates/cover-letter/postmark/renderer";
import { renderCoverLetterSaffron } from "../../../public/templates/cover-letter/saffron/renderer";
import { renderCoverLetterDossier } from "../../../public/templates/cover-letter/dossier/renderer";
import { renderCoverLetterMargin } from "../../../public/templates/cover-letter/margin/renderer";
import { renderCoverLetterEnvoy } from "../../../public/templates/cover-letter/envoy/renderer";
import { renderCoverLetterRegatta } from "../../../public/templates/cover-letter/regatta/renderer";
import { renderCoverLetterGingham } from "../../../public/templates/cover-letter/gingham/renderer";
import { renderCoverLetterBluebell } from "../../../public/templates/cover-letter/bluebell/renderer";
import { renderCoverLetterSkylark } from "../../../public/templates/cover-letter/skylark/renderer";
import { renderCoverLetterPewter } from "../../../public/templates/cover-letter/pewter/renderer";

const coverLetterTemplateMap: Record<string, (data: any) => string> = {
    Quill: renderCoverLetterQuill,
    folio: renderCoverLetterFolio,
    vellum: renderCoverLetterVellum,
    heather: renderCoverLetterHeather,
    ember: renderCoverLetterEmber,
    postmark: renderCoverLetterPostmark,
    saffron: renderCoverLetterSaffron,
    dossier: renderCoverLetterDossier,
    margin: renderCoverLetterMargin,
    envoy: renderCoverLetterEnvoy,
    regatta: renderCoverLetterRegatta,
    gingham: renderCoverLetterGingham,
    bluebell: renderCoverLetterBluebell,
    skylark: renderCoverLetterSkylark,
    pewter: renderCoverLetterPewter,
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
    { key: "margin", name: "Margin" },
    { key: "envoy", name: "Envoy" },
    { key: "regatta", name: "Regatta" },
    { key: "gingham", name: "Gingham" },
    { key: "bluebell", name: "Bluebell" },
    { key: "skylark", name: "Skylark" },
    { key: "pewter", name: "Pewter" }
];

const PRINT_CSS = `
<style id="print-pagination">
@media print {
    @page {
        size: A4;
        margin: 4mm;
    }

    html, body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
        background-color: transparent !important;
        width: 100% !important;
        height: auto !important;
    }

    * {
        -webkit-box-decoration-break: clone;
        box-decoration-break: clone;
    }

    h1, h2, h3, h4, h5, h6 {
        break-after: avoid !important;
        page-break-after: avoid !important;
        break-inside: avoid !important;
        page-break-inside: avoid !important;
    }
        
    p, li {
        orphans: 3;
        widows: 3;
    }
}
</style>`;

export const renderCoverLetter = (templateKey: string, data: any): string => {
    const renderer = coverLetterTemplateMap[templateKey] || renderCoverLetterQuill;
    const html = renderer(data);

    if (html.includes("</head>")) {
        return html.replace("</head>", `${PRINT_CSS}</head>`);
    }
    return PRINT_CSS + html;
};