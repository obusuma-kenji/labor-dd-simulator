// ゲーム全体の状態
export interface GameState {
  monthsOwned: number;
  investigationPoints: number;
  usedCardIds: string[];
  discoveredRiskIds: string[];
}

// カード
export interface InvestigationCard {
  id: string;
  name: string;
  description: string;
  cost: number;
  revealsRisks: string[];
  addsContext: string[];
}

// リスク
export type RiskType = "risk" | "opportunity";
export type RiskSeverity = "critical" | "high" | "medium" | "low";
export type RiskCategory = "legal" | "hr" | "financial" | "operational";

export interface Risk {
  id: string;
  type: RiskType;
  hidden: boolean;
  category: RiskCategory;
  severity: RiskSeverity;
  title: string;
  description: string;
  impact: number;
  recommendation: string;
}

// 企業情報
export interface Company {
  id: string;
  name: string;
  industry: string;
  employees: number;
  revenue: number;
  profit: number;
  askingPrice: number;
  trueValue: number;
  averageAge: number;
  strengths: string[];
  weaknesses: string[];
}

// ストーリー
export interface StoryContent {
  background: string;
  ownerProfile: {
    name: string;
    age: number;
    career: string;
    concern: string;
  };
  successionReason: string;
  keyChallenge: string;
  employeesSituation: string;
}

// イベント
export interface GameEvent {
  id: string;
  monthTrigger: number;
  title: string;
  description: string;
  choices: EventChoice[];
}

export interface EventChoice {
  text: string;
  impact: {
    investigationPoints?: number;
    revealsRisks?: string[];
    addContext?: string[];
  };
}

// スコアリングルール
export interface ScoringRules {
  minMajorRisksFound: number;
  maxTrueValueDiffRate: number;
  maxBogiDiffRate: number;
}

// ステージシナリオ
export interface StageScenario {
  id: string;
  name: string;
  story: StoryContent;
  company: Company;
  initialGameState: GameState;
  risks: Risk[];
  investigationCards: InvestigationCard[];
  events: GameEvent[];
  scoringRules: ScoringRules;
}

// DD結果
export interface DDResult {
  discoveredRisks: Risk[];
  totalImpact: number;
  estimatedValue: number;
  playerEstimate: number;
  usedCards: InvestigationCard[];
  totalCost: number;
}

// DDファインディング
export interface DDFinding {
  riskId: string;
  cardId: string;
  severity: RiskSeverity;
  impact: number;
}

// リスクレベル
export type RiskLevel = 'critical' | 'high' | 'medium' | 'low';

// 最終スコア
export interface FinalStageScore {
  riskCoverage: RiskCoverageScore;
  valuationAccuracy: ValuationAccuracyScore;
  efficiency: EfficiencyScore;
  finalRank: Rank;
  feedback: string;
  nextStageUnlocked: boolean;
}

// リスクカバレッジスコア
export interface RiskCoverageScore {
  foundMajorRisks: number;
  totalMajorRisks: number;
  foundMinorRisks: number;
  totalMinorRisks: number;
  missedCriticalRisks: Risk[];
  score: number;
  feedback: string;
}

// 評価精度スコア
export interface ValuationAccuracyScore {
  playerEstimate: number;
  trueValue: number;
  difference: number;
  diffRate: number;
  score: number;
  feedback: string;
}

// 効率スコア
export interface EfficiencyScore {
  usedPoints: number;
  totalPoints: number;
  usedCards: number;
  optimalCards: number;
  score: number;
  feedback: string;
}

// ランク
export type Rank = "S" | "A" | "B" | "C" | "D";

// リスクマッチング評価
export interface RiskMatchEvaluation {
  riskId: string;
  playerDiscovered: boolean;
  aiDiscovered: boolean;
  playerDetail?: DDFinding;
  aiDetail?: DDFinding;
  match: 'both' | 'player_only' | 'ai_only' | 'neither';
}

// AIコンサルタントアドバイス
export interface ConsultantAdvice {
  appropriatenessScore: number;
  strengths: string[];
  risks: string[];
  alternatives: string[];
  overallComment: string;
}