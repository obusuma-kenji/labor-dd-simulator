import { GameState, StageScenario, InvestigationCard, LaborRisk, DDResult } from "../types";
import { generateDDResults } from "../geminiService";

export interface CardApplyResult {
  nextState: GameState;
  card: InvestigationCard;
  newlyDiscoveredRisks: LaborRisk[];
}

export const canUseCard = (
  gameState: GameState,
  card: InvestigationCard
): boolean => {
  const remaining = gameState.investigationPoints ?? 0;
  const used = new Set(gameState.usedCardIds ?? []);
  return remaining >= card.cost && !used.has(card.id);
};

export const applyInvestigationCard = (
  gameState: GameState,
  stage: StageScenario,
  cardId: string
): CardApplyResult => {
  const card = stage.investigationCards.find((c) => c.id === cardId);
  if (!card) {
    throw new Error(`カードIDが不正です: ${cardId}`);
  }

  const currentPoints = gameState.investigationPoints ?? 0;
  if (currentPoints < card.cost) {
    throw new Error("調査ポイントが不足しています。");
  }

  const usedCardIds = new Set(gameState.usedCardIds ?? []);
  if (usedCardIds.has(card.id)) {
    throw new Error("このカードはすでに使用済みです。");
  }

  usedCardIds.add(card.id);

  const discoveredRiskIds = new Set(gameState.discoveredRiskIds ?? []);
  const newlyDiscoveredRisks: LaborRisk[] = [];

  for (const riskId of card.revealsRisks) {
    if (!discoveredRiskIds.has(riskId)) {
      discoveredRiskIds.add(riskId);
      const risk = stage.risks.find((r) => r.id === riskId);
      if (risk) {
        newlyDiscoveredRisks.push(risk);
      }
    }
  }

  const nextState: GameState = {
    ...gameState,
    investigationPoints: currentPoints - card.cost,
    usedCardIds: Array.from(usedCardIds),
    discoveredRiskIds: Array.from(discoveredRiskIds)
  };

  return {
    nextState,
    card,
    newlyDiscoveredRisks
  };
};

export const buildLaborDDExtraContext = (
  stage: StageScenario,
  gameState: GameState
): string => {
  const usedCardIds = new Set(gameState.usedCardIds ?? []);
  const discoveredRiskIds = new Set(gameState.discoveredRiskIds ?? []);

  const cardContexts: string[] = [];
  for (const card of stage.investigationCards) {
    if (usedCardIds.has(card.id) && card.addsContext?.length) {
      cardContexts.push(...card.addsContext);
    }
  }

  const discoveredRisks = stage.risks.filter((r) =>
    discoveredRiskIds.has(r.id)
  );
  const riskSummaries = discoveredRisks.map((r) => {
    const impactLabel =
      r.impact === 0
        ? "影響額不明"
        : `影響額: ¥${r.impact.toLocaleString()}（${
            r.type === "risk" ? "マイナス要因" : "プラス要因"
          }）`;

    return `- [${r.category}/${r.severity}] ${r.title} … ${impactLabel}`;
  });

  const blocks: string[] = [];

  if (cardContexts.length > 0) {
    blocks.push(
      "【ヒアリング・資料確認で得られた具体的な情報】\n" +
        cardContexts.map((c) => `- ${c}`).join("\n")
    );
  }

  if (riskSummaries.length > 0) {
    blocks.push(
      "【これまでに判明している主な労務リスク・機会】\n" +
        riskSummaries.join("\n")
    );
  }

  if (blocks.length === 0) {
    return "（まだ十分な追加情報は得られていません。簡易的な労務DDとして、ごく表面的な指摘のみ行ってください。）";
  }

  return blocks.join("\n\n");
};

export const runLaborDDForPlayer = async (
  stage: StageScenario,
  gameState: GameState,
  ddLevel: "簡易DD" | "標準DD" | "詳細DD" = "標準DD"
): Promise<DDResult> => {
  const extraContext = buildLaborDDExtraContext(stage, gameState);
  const ddResult = await generateDDResults(stage.company, ddLevel, extraContext);
  return ddResult;
};
