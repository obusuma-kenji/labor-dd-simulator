import { StageScenario, LaborRisk, DDFinding, RiskCoverageScore, RiskMatchEvaluation, RiskLevel } from "../types";

const riskSeverityScore = (sev: RiskLevel): number => {
  switch (sev) {
    case "low":
      return 1;
    case "medium":
      return 2;
    case "high":
      return 3;
    case "critical":
      return 4;
    default:
      return 1;
  }
};

const findingSeverityScore = (sev: string): number => {
  if (!sev) return 1;
  if (sev.includes("重")) return 4;
  if (sev.includes("高")) return 3;
  if (sev.includes("中")) return 2;
  if (sev.includes("低")) return 1;
  return 1;
};

const normalizeCategory = (cat: string): string => {
  if (!cat) return "other";
  const c = cat.toLowerCase();

  if (["hr", "labor", "labour", "人事", "労務"].some((k) => c.includes(k))) {
    return "hr";
  }
  if (["safety", "安全"].some((k) => c.includes(k))) {
    return "hr";
  }
  if (["culture", "風土", "ハラスメント"].some((k) => c.includes(k))) {
    return "hr";
  }
  if (["risk"].some((k) => c.includes(k))) {
    return "risk";
  }
  if (["financial", "財務"].some((k) => c.includes(k))) {
    return "financial";
  }
  if (["legal", "法務"].some((k) => c.includes(k))) {
    return "legal";
  }
  if (["business", "事業"].some((k) => c.includes(k))) {
    return "business";
  }
  return c;
};

const normalizeText = (text?: string | null): string => {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[、。・,\.\-~ー「」『』【】()（）\[\]]/g, "");
};

const computeTextSimilarity = (risk: LaborRisk, finding: DDFinding): number => {
  const riskKey = normalizeText(risk.title);
  const fTitle = normalizeText(finding.title);
  const fDesc = normalizeText(finding.description);

  if (!riskKey || (!fTitle && !fDesc)) return 0;

  if (fTitle.includes(riskKey) || riskKey.includes(fTitle)) {
    return 1.0;
  }

  if (fDesc.includes(riskKey)) {
    return 0.7;
  }

  const anyKeyword =
    (risk as any).keywords &&
    Array.isArray((risk as any).keywords) &&
    (risk as any).keywords.some((kw: string) => {
      const k = normalizeText(kw);
      return k && (fTitle.includes(k) || fDesc.includes(k));
    });

  if (anyKeyword) {
    return 0.6;
  }

  return 0;
};

const computeRiskFindingMatchScore = (
  risk: LaborRisk,
  finding: DDFinding
): number => {
  let score = 0;

  const riskCat = normalizeCategory(risk.category);
  const findingCat = normalizeCategory(finding.category);

  if (riskCat === findingCat) {
    score += 0.3;
  } else if (
    (riskCat === "hr" && findingCat === "risk") ||
    (riskCat === "risk" && findingCat === "hr")
  ) {
    score += 0.15;
  }

  const rSev = riskSeverityScore(risk.severity);
  const fSev = findingSeverityScore(finding.severity);
  const diff = Math.abs(rSev - fSev);

  if (diff === 0) score += 0.2;
  else if (diff === 1) score += 0.1;

  const textSim = computeTextSimilarity(risk, finding);
  score += 0.5 * textSim;

  if (score > 1) score = 1;
  return score;
};

const isMajorRisk = (risk: LaborRisk): boolean => {
  return risk.severity === "high" || risk.severity === "critical";
};

export const evaluateRiskCoverage = (
  stage: StageScenario,
  findings: DDFinding[],
  matchThreshold = 0.6
): RiskCoverageScore => {
  const usedFindingIndices = new Set<number>();
  const evaluations: RiskMatchEvaluation[] = [];
  const risks = stage.risks;

  for (const risk of risks) {
    let bestScore = 0;
    let bestIndex: number | null = null;
    let bestFinding: DDFinding | undefined;

    findings.forEach((f, idx) => {
      if (usedFindingIndices.has(idx)) return;
      const s = computeRiskFindingMatchScore(risk, f);
      if (s > bestScore) {
        bestScore = s;
        bestIndex = idx;
        bestFinding = f;
      }
    });

    const hit = bestScore >= matchThreshold;
    if (hit && bestIndex !== null) {
      usedFindingIndices.add(bestIndex);
    }

    const evalItem: RiskMatchEvaluation = {
      riskId: risk.id,
      risk,
      matchedFindingIndex: bestIndex,
      matchedFinding: bestFinding,
      score: bestScore,
      isHit: hit,
      isMajor: isMajorRisk(risk)
    };

    evaluations.push(evalItem);
  }

  const totalRisks = evaluations.length;
  const totalMajorRisks = evaluations.filter((e) => e.isMajor).length;
  const hitCount = evaluations.filter((e) => e.isHit).length;
  const majorHitCount = evaluations.filter((e) => e.isHit && e.isMajor).length;

  const hitRate = totalRisks > 0 ? hitCount / totalRisks : 0;
  const majorHitRate = totalMajorRisks > 0 ? majorHitCount / totalMajorRisks : 0;

  const meetsMinMajorHits =
    (stage.scoringRules?.minMajorRisksFound ?? 0) <= majorHitCount;

  return {
    stageId: stage.id,
    totalRisks,
    totalMajorRisks,
    hitCount,
    majorHitCount,
    hitRate,
    majorHitRate,
    meetsMinMajorHits,
    details: evaluations
  };
};
