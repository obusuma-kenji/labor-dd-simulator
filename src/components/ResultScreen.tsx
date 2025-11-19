import React from "react";
import {
  StageScenario,
  FinalStageScore,
  RiskMatchEvaluation
} from "../types";

type ResultScreenProps = {
  stage: StageScenario;
  player: FinalStageScore;
  ai: FinalStageScore;
};

const yen = (v: number) => `¥${v.toLocaleString()}`;
const pct = (rate: number) => `${(rate * 100).toFixed(1)}%`;

const riskHitIcon = (e?: RiskMatchEvaluation): string => {
  if (!e) return "—";
  if (e.score >= 0.8) return "◎";
  if (e.score >= 0.6) return "○";
  if (e.score >= 0.3) return "△";
  return "×";
};

const riskHitClass = (e?: RiskMatchEvaluation): string => {
  if (!e) return "text-gray-400";
  if (e.score >= 0.8) return "text-green-500 font-bold";
  if (e.score >= 0.6) return "text-emerald-500";
  if (e.score >= 0.3) return "text-amber-500";
  return "text-red-500";
};

const rankLabel = (rank: string) => {
  switch (rank) {
    case "S":
      return "神業レベル";
    case "A":
      return "プロ級";
    case "B":
      return "実務レベル";
    case "C":
      return "要改善";
    case "D":
    default:
      return "危険水準";
  }
};

export const ResultScreen: React.FC<ResultScreenProps> = ({
  stage,
  player,
  ai
}) => {
  const bestScore = Math.max(player.totalScore, ai.totalScore, 1);
  const barWidth = (score: number) =>
    `${Math.max(10, (score / bestScore) * 100)}%`;

  const winner =
    player.totalScore > ai.totalScore
      ? "player"
      : player.totalScore < ai.totalScore
      ? "ai"
      : "draw";

  const winnerLabel =
    winner === "player"
      ? "社労士プレイヤーの勝利！"
      : winner === "ai"
      ? "AIアナリストの勝利…"
      : "引き分け";

  const riskRows = player.riskCoverage.details.map((p) => {
    const aiDetail = ai.riskCoverage.details.find(
      (d) => d.riskId === p.riskId
    );
    return { risk: p.risk, player: p, ai: aiDetail };
  });

  const valP = player.valuation;
  const valA = ai.valuation;

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      <header className="bg-slate-900 text-white rounded-2xl p-5 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-lg">
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-300">
            Stage Result
          </p>
          <h1 className="text-xl md:text-2xl font-bold mt-1">
            {stage.name}
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            買収対象：{stage.company.name}（{stage.company.industry}） / 従業員{" "}
            {stage.company.employees}名
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div
            className={`px-4 py-2 rounded-full text-sm font-semibold ${
              winner === "player"
                ? "bg-emerald-500/20 text-emerald-200 border border-emerald-400"
                : winner === "ai"
                ? "bg-amber-500/20 text-amber-200 border border-amber-400"
                : "bg-slate-700 text-slate-200 border border-slate-500"
            }`}
          >
            {winnerLabel}
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl shadow-md p-5 border border-slate-100 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">
                Player
              </p>
              <p className="text-sm text-slate-500">社労士としてのあなた</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-slate-500">総合スコア</p>
                <p className="text-2xl font-bold text-slate-900">
                  {player.totalScore}
                  <span className="text-base text-slate-500"> / 100</span>
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center text-xl font-bold">
                  {player.rank}
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  {rankLabel(player.rank)}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-2">
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all"
                style={{ width: barWidth(player.totalScore) }}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-3 text-xs">
            <div>
              <p className="text-slate-500 mb-1">リスクカバレッジ</p>
              <p className="font-semibold text-slate-900">
                {(player.riskCoverage.majorHitRate * 100).toFixed(0)}%
              </p>
              <p className="text-[11px] text-slate-500">
                重大 {player.riskCoverage.majorHitCount}/
                {player.riskCoverage.totalMajorRisks} 件
              </p>
            </div>
            <div>
              <p className="text-slate-500 mb-1">企業価値推計</p>
              <p className="font-semibold text-slate-900">
                {valP.trueValueScore} 点
              </p>
              <p className="text-[11px] text-slate-500">
                誤差 {pct(valP.trueValueErrorRate)}
              </p>
            </div>
            <div>
              <p className="text-slate-500 mb-1">簿外債務推計</p>
              <p className="font-semibold text-slate-900">
                {valP.bogiScore} 点
              </p>
              <p className="text-[11px] text-slate-500">
                誤差 {pct(valP.bogiErrorRate)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-5 border border-slate-100 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">
                AI
              </p>
              <p className="text-sm text-slate-500">
                データドリブンなAIアナリスト
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-slate-500">総合スコア</p>
                <p className="text-2xl font-bold text-slate-900">
                  {ai.totalScore}
                  <span className="text-base text-slate-500"> / 100</span>
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-slate-700 text-white flex items-center justify-center text-xl font-bold">
                  {ai.rank}
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  {rankLabel(ai.rank)}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-2">
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-sky-500 rounded-full transition-all"
                style={{ width: barWidth(ai.totalScore) }}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-3 text-xs">
            <div>
              <p className="text-slate-500 mb-1">リスクカバレッジ</p>
              <p className="font-semibold text-slate-900">
                {(ai.riskCoverage.majorHitRate * 100).toFixed(0)}%
              </p>
              <p className="text-[11px] text-slate-500">
                重大 {ai.riskCoverage.majorHitCount}/
                {ai.riskCoverage.totalMajorRisks} 件
              </p>
            </div>
            <div>
              <p className="text-slate-500 mb-1">企業価値推計</p>
              <p className="font-semibold text-slate-900">
                {valA.trueValueScore} 点
              </p>
              <p className="text-[11px] text-slate-500">
                誤差 {pct(valA.trueValueErrorRate)}
              </p>
            </div>
            <div>
              <p className="text-slate-500 mb-1">簿外債務推計</p>
              <p className="font-semibold text-slate-900">
                {valA.bogiScore} 点
              </p>
              <p className="text-[11px] text-slate-500">
                誤差 {pct(valA.bogiErrorRate)}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-2xl shadow-md p-5 border border-slate-100">
        <h2 className="text-sm font-semibold text-slate-800 mb-3">
          重大リスクのカバレッジ比較
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs md:text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-2 pr-2 text-slate-500">リスク</th>
                <th className="text-center py-2 px-2 text-slate-500">
                  Player
                </th>
                <th className="text-center py-2 px-2 text-slate-500">AI</th>
                <th className="text-right py-2 pl-2 text-slate-500">
                  影響額
                </th>
              </tr>
            </thead>
            <tbody>
              {riskRows.map(({ risk, player: pDetail, ai: aDetail }) => {
                if (!pDetail.isMajor && !(aDetail?.isMajor)) {
                  return null;
                }
                return (
                  <tr
                    key={risk.id}
                    className="border-b border-slate-100 last:border-0"
                  >
                    <td className="py-2 pr-2 align-top">
                      <div className="font-medium text-slate-900">
                        {risk.title}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        [{risk.category} / {risk.severity}]
                      </div>
                    </td>
                    <td className="py-2 px-2 text-center align-top">
                      <span className={riskHitClass(pDetail)}>
                        {riskHitIcon(pDetail)}
                      </span>
                    </td>
                    <td className="py-2 px-2 text-center align-top">
                      <span className={riskHitClass(aDetail)}>
                        {riskHitIcon(aDetail)}
                      </span>
                    </td>
                    <td className="py-2 pl-2 text-right align-top text-slate-800">
                      {yen(risk.impact)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-white rounded-2xl shadow-md p-5 border border-slate-100">
        <h2 className="text-sm font-semibold text-slate-800 mb-3">
          企業価値・簿外債務の推計精度
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs md:text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-2 pr-2 text-slate-500">指標</th>
                <th className="text-right py-2 px-2 text-slate-500">
                  真値
                </th>
                <th className="text-right py-2 px-2 text-slate-500">
                  Player
                </th>
                <th className="text-right py-2 px-2 text-slate-500">
                  AI
                </th>
                <th className="text-right py-2 pl-2 text-slate-500">
                  誤差（Player / AI）
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="py-2 pr-2">真の企業価値</td>
                <td className="py-2 px-2 text-right">
                  {yen(valP.trueValueTruth)}
                </td>
                <td className="py-2 px-2 text-right">
                  {yen(valP.trueValueEst)}
                </td>
                <td className="py-2 px-2 text-right">
                  {yen(valA.trueValueEst)}
                </td>
                <td className="py-2 pl-2 text-right text-slate-600">
                  {pct(valP.trueValueErrorRate)} /{" "}
                  {pct(valA.trueValueErrorRate)}
                </td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-2 pr-2">潜在価値（PMI後）</td>
                <td className="py-2 px-2 text-right">
                  {yen(valP.potentialTruth)}
                </td>
                <td className="py-2 px-2 text-right">
                  {yen(valP.potentialEst)}
                </td>
                <td className="py-2 px-2 text-right">
                  {yen(valA.potentialEst)}
                </td>
                <td className="py-2 pl-2 text-right text-slate-600">
                  {pct(valP.potentialErrorRate)} /{" "}
                  {pct(valA.potentialErrorRate)}
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-2">簿外債務（労務リスク）</td>
                <td className="py-2 px-2 text-right">
                  {yen(valP.bogiTruth)}
                </td>
                <td className="py-2 px-2 text-right">
                  {yen(valP.bogiEst)}
                </td>
                <td className="py-2 px-2 text-right">
                  {yen(valA.bogiEst)}
                </td>
                <td className="py-2 pl-2 text-right text-slate-600">
                  {pct(valP.bogiErrorRate)} / {pct(valA.bogiErrorRate)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900 text-slate-50 rounded-2xl p-4 space-y-2">
          <h3 className="text-sm font-semibold">Player への講評</h3>
          <ul className="text-xs list-disc list-inside space-y-1">
            {player.notes.map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
        </div>
        <div className="bg-slate-800 text-slate-100 rounded-2xl p-4 space-y-2">
          <h3 className="text-sm font-semibold">AI の評価サマリー</h3>
          <ul className="text-xs list-disc list-inside space-y-1">
            {ai.notes.map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default ResultScreen;
