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
};

export const renderResumeTemplate = (templateKey: string, userData: any): string => {
    const renderer = templateMap[templateKey] || renderClassic;
    return renderer(userData);
};