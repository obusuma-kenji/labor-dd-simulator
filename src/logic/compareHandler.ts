import { GameState, FinalStageScore } from "../types";
import { stage1Scenario } from "../stages/stage1Scenario";
import { runLaborDDForPlayer } from "./laborStageEngine";
import { runLaborDDForAI } from "./aiDdEngine";
import { evaluateRiskCoverage } from "./riskScoring";
import { computeFinalStageScore } from "./finalScoring";

export interface CompareResult {
  player: FinalStageScore;
  ai: FinalStageScore;
}

export const handleComparePlayerVsAI = async (
  gameState: GameState
): Promise<CompareResult> => {
  const playerDd = await runLaborDDForPlayer(
    stage1Scenario,
    gameState,
    "詳細DD"
  );
  const aiDd = await runLaborDDForAI(stage1Scenario, "標準DD");

  const playerRiskScore = evaluateRiskCoverage(
    stage1Scenario,
    playerDd.findings
  );
  const aiRiskScore = evaluateRiskCoverage(
    stage1Scenario,
    aiDd.ddResult.findings
  );

  const playerFinal = computeFinalStageScore(
    "player",
    stage1Scenario,
    playerRiskScore,
    playerDd
  );
  const aiFinal = computeFinalStageScore(
    "ai",
    stage1Scenario,
    aiRiskScore,
    aiDd.ddResult
  );

  return {
    player: playerFinal,
    ai: aiFinal
  };
};
