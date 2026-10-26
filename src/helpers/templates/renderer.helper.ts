import { renderClassic } from "../../../public/templates/resumes/classic/renderer";
import { renderProfessional } from "../../../public/templates/resumes/professional/renderer";
import { renderMinimal } from "../../../public/templates/resumes/minimal/renderer";
import { renderOnyx } from "../../../public/templates/resumes/onyx/renderer";
import { renderHarbor } from "../../../public/templates/resumes/harbor/renderer";
import { renderUmber } from "../../../public/templates/resumes/umber/renderer";
import { renderPulse } from "../../../public/templates/resumes/pulse/renderer";
import { renderLagoon } from "../../../public/templates/resumes/lagoon/renderer";
import { renderMarine } from "../../../public/templates/resumes/marine/renderer";
import { renderAmber } from "../../../public/templates/resumes/amber/renderer";
import { renderClover } from "../../../public/templates/resumes/clover/renderer";
import { renderBlank } from "../../../public/templates/resumes/blank/renderer";
import { renderLinen } from "../../../public/templates/resumes/linen/renderer";
import { renderWillow } from "../../../public/templates/resumes/willow/renderer";
import { renderConfetti } from "../../../public/templates/resumes/confetti/renderer";
import { renderFlare } from "../../../public/templates/resumes/flare/renderer";
import { renderFrost } from "../../../public/templates/resumes/frost/renderer";
import { renderGranite } from "../../../public/templates/resumes/granite/renderer";
import { renderDenim } from "../../../public/templates/resumes/denim/renderer";
import { renderSage } from "../../../public/templates/resumes/sage/renderer";
import { renderMist } from "../../../public/templates/resumes/mist/renderer";
import { renderCitrine } from "../../../public/templates/resumes/citrine/renderer";
import { renderViolet } from "../../../public/templates/resumes/violet/renderer";
import { renderCove } from "../../../public/templates/resumes/cove/renderer";
import { renderMagenta } from "../../../public/templates/resumes/magenta/renderer";
import { renderIndigo } from "../../../public/templates/resumes/indigo/renderer";
import { renderCoral } from "../../../public/templates/resumes/coral/renderer";
import { renderAzure } from "../../../public/templates/resumes/azure/renderer";
import { renderSketch } from "../../../public/templates/resumes/sketch/renderer";
import { renderSunset } from "../../../public/templates/resumes/sunset/renderer";
import { renderCobalt } from "../../../public/templates/resumes/cobalt/renderer";
import { renderParchment } from "../../../public/templates/resumes/parchment/renderer";

const templateMap: Record<string, (userData: any) => string> = {
    classic: renderClassic,
    professional: renderProfessional,
    minimal: renderMinimal,
    onyx: renderOnyx,
    harbor: renderHarbor,
    umber: renderUmber,
    pulse: renderPulse,
    lagoon: renderLagoon,
    marine: renderMarine,
    amber: renderAmber,
    clover: renderClover,
    blank: renderBlank,
    linen: renderLinen,
    willow: renderWillow,
    confetti: renderConfetti,
    flare: renderFlare,
    frost: renderFrost,
    granite: renderGranite,
    denim: renderDenim,
    sage: renderSage,
    mist: renderMist,
    citrine: renderCitrine,
    violet: renderViolet,
    cove: renderCove,
    magenta: renderMagenta,
    indigo: renderIndigo,
    coral: renderCoral,
    azure: renderAzure,
    sketch: renderSketch,
    sunset: renderSunset,
    cobalt: renderCobalt,
    parchment: renderParchment,
};

const PRINT_CSS = `
<style id="print-pagination">
@media print {
    @page { size: A4; margin: 12mm 0; }
    @page :first { size: A4; margin: 0 0 12mm 0; }

    html, body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
    }

    body > div,
    .page, .resume, .resume_page, .first-resume-section, .resume-top-sec {
        box-shadow: none !important;
        border-radius: 0 !important;
        overflow: visible !important;
        height: auto !important;
        min-height: 0 !important;
        margin-top: 0 !important;
        margin-bottom: 0 !important;
    }

    h1, h2, h3, h4, h5, h6,
    .section_title, .main-title {
        break-after: avoid;
        page-break-after: avoid;
    }

    .resume-item,
    [class*="timeline_item"], [class*="timeline-item"],
    [class*="experience_item"], [class*="education_item"],
    [class*="experience_details"], [class*="education_details"],
    li, tr, img, blockquote {
        break-inside: avoid;
        page-break-inside: avoid;
    }

    p, li {
        orphans: 3;
        widows: 3;
    }

    [class*="section"], [class*="card"], .experience-txt, .education, .skills {
        -webkit-box-decoration-break: clone;
        box-decoration-break: clone;
    }
}
</style>`;

export const renderResumeTemplate = (templateKey: string, userData: any): string => {
    const renderer = templateMap[templateKey] || renderClassic;
    const html = renderer(userData);

    if (html.includes("</head>")) {
        return html.replace("</head>", `${PRINT_CSS}</head>`);
    }
    return PRINT_CSS + html;
};