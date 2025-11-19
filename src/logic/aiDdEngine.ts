import { StageScenario, InvestigationCard, GameState, DDResult } from "../types";
import { generateDDResults } from "../geminiService";
import { buildLaborDDExtraContext } from "./laborStageEngine";

export interface AiInvestigationPlan {
  usedCardIds: string[];
  cards: InvestigationCard[];
}

export interface AiDDRunResult {
  plan: AiInvestigationPlan;
  ddResult: DDResult;
}

export const chooseAiInvestigationCards = (
  stage: StageScenario,
  budget: number = 4
): AiInvestigationPlan => {
  const structuralCards = stage.investigationCards.filter((card) => {
    const name = card.name || "";
    return !/インタビュー|見学/.test(name);
  });

  const sorted = structuralCards.slice().sort((a, b) => a.cost - b.cost);

  const chosen: InvestigationCard[] = [];
  let costSum = 0;

  for (const c of sorted) {
    if (costSum + c.cost <= budget) {
      chosen.push(c);
      costSum += c.cost;
    }
  }

  return {
    usedCardIds: chosen.map((c) => c.id),
    cards: chosen
  };
};

const buildAiLaborDDExtraContext = (
  stage: StageScenario,
  plan: AiInvestigationPlan
): string => {
  const aiState: GameState = {
    monthsOwned: 0,
    investigationPoints: 0,
    usedCardIds: plan.usedCardIds,
    discoveredRiskIds: []
  };

  const baseContext = buildLaborDDExtraContext(stage, aiState);

  const header = `
あなたはデータドリブンなAIアナリストです。
利用できる情報は、就業規則・36協定・勤怠／賃金データ・社保／労災などの書類ベースの情報と、
一般的な中小製造業の統計データのみです。

現場社員や経営者へのインタビュー、工場見学などの「生の声」や現場観察の情報は一切利用できません。
そのため、あなたのリスク評価と金額推計は、あくまで統計と書類情報に基づく推定になります。
`.trim();

  return `${header}\n\n${baseContext}`;
};

export const runLaborDDForAI = async (
  stage: StageScenario,
  ddLevel: "簡易DD" | "標準DD" | "詳細DD" = "標準DD"
): Promise<AiDDRunResult> => {
  const plan = chooseAiInvestigationCards(stage, 4);
  const extraContext = buildAiLaborDDExtraContext(stage, plan);
  const ddResult = await generateDDResults(stage.company, ddLevel, extraContext);
  return {
    plan,
    ddResult
  };
};
