import {
  StageScenario,
  RiskCoverageScore,
  ValuationAccuracyScore,
  FinalStageScore,
  Rank,
  DDResult
} from "../types";
import { DDFinding } from "../types";

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

const computeTrueBogiZaimu = (stage: StageScenario): number => {
  const sum = stage.risks
    .filter((r) => r.type === "risk" && r.impact < 0)
    .reduce((acc, r) => acc + r.impact, 0);
  return sum;
};

const computeTruePotentialValue = (stage: StageScenario): number => {
  const base = stage.company.trueValue ?? stage.company.askingPrice ?? 0;
  const positive = stage.risks
    .filter((r) => r.impact > 0)
    .reduce((acc, r) => acc + r.impact, 0);
  return base + positive;
};

const computeEstimatedBogiFromFindings = (findings: DDFinding[]): number => {
  return findings
    .filter((f) => {
      const cat = normalizeCategory(f.category);
      return (cat === "hr" || cat === "risk") && typeof f.impact === "number" && f.impact < 0;
    })
    .reduce((acc, f) => acc + (f.impact ?? 0), 0);
};

const errorRateToScore = (errorRate: number, threshold: number): number => {
  if (!isFinite(errorRate)) return 0;
  if (errorRate <= threshold) return 100;

  const maxRate = threshold * 3;
  if (errorRate >= maxRate) return 0;

  const over = (errorRate - threshold) / (maxRate - threshold);
  const score = Math.round(100 * (1 - over));
  return Math.max(0, Math.min(100, score));
};

export const computeValuationAccuracy = (
  stage: StageScenario,
  ddResult: DDResult
): ValuationAccuracyScore => {
  const trueValueTruth =
    stage.company.trueValue ?? stage.company.askingPrice ?? 0;
  const trueValueEst = ddResult.trueValue ?? trueValueTruth;

  const potentialTruth = computeTruePotentialValue(stage);
  const potentialEst = ddResult.potentialValue ?? potentialTruth;

  const bogiTruth = computeTrueBogiZaimu(stage);
  const bogiEst = computeEstimatedBogiFromFindings(ddResult.findings);

  const trueDenom = Math.max(1, Math.abs(trueValueTruth));
  const potentialDenom = Math.max(1, Math.abs(potentialTruth));
  const bogiDenom = Math.max(1, Math.abs(bogiTruth));

  const trueValueErrorRate = Math.abs(trueValueEst - trueValueTruth) / trueDenom;
  const potentialErrorRate = Math.abs(potentialEst - potentialTruth) / potentialDenom;
  const bogiErrorRate = Math.abs(bogiEst - bogiTruth) / bogiDenom;

  const thrTrue = stage.scoringRules?.maxTrueValueDiffRate ?? 0.1;
  const thrBogi = stage.scoringRules?.maxBogiDiffRate ?? 0.2;

  const trueValueScore = errorRateToScore(trueValueErrorRate, thrTrue);
  const potentialScore = errorRateToScore(potentialErrorRate, thrTrue);
  const bogiScore = errorRateToScore(bogiErrorRate, thrBogi);

  const totalScore = Math.round(
    0.5 * trueValueScore + 0.25 * potentialScore + 0.25 * bogiScore
  );

  return {
    trueValueTruth,
    trueValueEst,
    trueValueErrorRate,
    trueValueScore,
    potentialTruth,
    potentialEst,
    potentialErrorRate,
    potentialScore,
    bogiTruth,
    bogiEst,
    bogiErrorRate,
    bogiScore,
    totalScore
  };
};

const computeRiskCoverageComponent = (
  riskCoverage: RiskCoverageScore
): number => {
  const majorRate = riskCoverage.majorHitRate;
  const overallRate = riskCoverage.hitRate;

  const score = Math.round(100 * (0.7 * majorRate + 0.3 * overallRate));
  return Math.max(0, Math.min(100, score));
};

const toRank = (score: number): Rank => {
  if (score >= 90) return "S";
  if (score >= 75) return "A";
  if (score >= 60) return "B";
  if (score >= 45) return "C";
  return "D";
};

export const computeFinalStageScore = (
  actor: "player" | "ai",
  stage: StageScenario,
  riskCoverage: RiskCoverageScore,
  ddResult: DDResult
): FinalStageScore => {
  const valuation = computeValuationAccuracy(stage, ddResult);
  const riskScore = computeRiskCoverageComponent(riskCoverage);

  const rawTotal = Math.round(0.5 * riskScore + 0.5 * valuation.totalScore);

  const meetsMinMajor = riskCoverage.meetsMinMajorHits;
  let rank = toRank(rawTotal);

  if (!meetsMinMajor && (rank === "S" || rank === "A" || rank === "B")) {
    rank = "C";
  }

  const notes: string[] = [];

  notes.push(
    `重大リスクヒット率: ${(riskCoverage.majorHitRate * 100).toFixed(
      1
    )}%（${riskCoverage.majorHitCount} / ${riskCoverage.totalMajorRisks}件）`
  );
  notes.push(
    `全リスクヒット率: ${(riskCoverage.hitRate * 100).toFixed(
      1
    )}%（${riskCoverage.hitCount} / ${riskCoverage.totalRisks}件）`
  );

  if (!meetsMinMajor) {
    notes.push(
      "重大な労務リスクの拾い漏れがあるため、ランクはC以上に上がりませんでした。"
    );
  }

  notes.push(
    `真の企業価値の推計誤差: ${(valuation.trueValueErrorRate * 100).toFixed(
      1
    )}%（スコア${valuation.trueValueScore}点）`
  );
  notes.push(
    `潜在価値の推計誤差: ${(valuation.potentialErrorRate * 100).toFixed(
      1
    )}%（スコア${valuation.potentialScore}点）`
  );
  notes.push(
    `簿外債務（未払残業等）の推計誤差: ${(valuation.bogiErrorRate * 100).toFixed(
      1
    )}%（スコア${valuation.bogiScore}点）`
  );

  return {
    actor,
    stageId: stage.id,
    totalScore: rawTotal,
    rank,
    riskCoverage,
    valuation,
    notes
  };
};
