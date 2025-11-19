import React, { useState } from 'react';
import { InvestigationCard, ConsultantAdvice } from '../types';

interface CardSelectionModalProps {
  card: InvestigationCard;
  companyName: string;
  companyIndustry: string;
  onClose: () => void;
  onConfirm: () => void;
  onConsult: (reason: string) => Promise<ConsultantAdvice>;
}

export const CardSelectionModal: React.FC<CardSelectionModalProps> = ({
  card,
  companyName,
  companyIndustry,
  onClose,
  onConfirm,
  onConsult
}) => {
  const [reason, setReason] = useState('');
  const [advice, setAdvice] = useState<ConsultantAdvice | null>(null);
  const [isConsulting, setIsConsulting] = useState(false);
  const [showAdvice, setShowAdvice] = useState(false);

  const handleConsult = async () => {
    if (reason.trim().length < 10) {
      alert('選択理由を10文字以上入力してください');
      return;
    }

    setIsConsulting(true);
    try {
      const result = await onConsult(reason);
      setAdvice(result);
      setShowAdvice(true);
    } catch (error) {
      console.error('コンサルタントへの相談に失敗しました:', error);
      alert('コンサルタントへの相談に失敗しました。もう一度お試しください。');
    } finally {
      setIsConsulting(false);
    }
  };

  const handleConfirm = () => {
    if (!advice) {
      alert('まずコンサルタントに相談してください');
      return;
    }
    onConfirm();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-slate-700">
        {!showAdvice ? (
          // 選択理由入力画面
          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-blue-400 mb-2">
                  💼 大御所コンサルタントとの対話
                </h2>
                <p className="text-slate-400 text-sm">{companyName}（{companyIndustry}）</p>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <div className="bg-slate-900/50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-bold text-white mb-2">選択したカード</h3>
              <div className="flex items-start">
                <span className="text-3xl mr-3">📋</span>
                <div>
                  <p className="text-xl font-bold text-blue-300">{card.name}</p>
                  <p className="text-slate-300 text-sm mt-2">{card.description}</p>
                  <p className="text-blue-400 font-bold mt-3">調査コスト: {card.cost} ポイント</p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-white font-bold mb-3">
                この調査を選んだ理由を教えてください
                <span className="text-red-400 ml-2">*</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="例：未払残業代のリスクが高いと考えたため、実際の勤怠データを確認し、労働時間の実態を把握する必要があると判断しました。"
                className="w-full h-32 bg-slate-900/50 border border-slate-600 rounded-lg p-4 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
              />
              <p className="text-slate-400 text-sm mt-2">
                {reason.length} / 10文字以上（具体的に記入してください）
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleConsult}
                disabled={isConsulting || reason.trim().length < 10}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-slate-700 disabled:to-slate-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
              >
                {isConsulting ? (
                  <span className="flex items-center justify-center">
                    <span className="animate-spin mr-2">⏳</span>
                    コンサルタントが検討中...
                  </span>
                ) : (
                  '🎓 コンサルタントに相談する'
                )}
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                キャンセル
              </button>
            </div>
          </div>
        ) : (
          // アドバイス表示画面
          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-green-400">
                🎓 コンサルタントからのアドバイス
              </h2>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            {advice && (
              <>
                {/* スコア表示 */}
                <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-lg p-6 mb-6 border border-blue-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-300 mb-2">選択の適切度スコア</p>
                      <p className="text-5xl font-bold text-blue-300">{advice.score} <span className="text-2xl">/ 100</span></p>
                    </div>
                    <div className="text-6xl">
                      {advice.score >= 80 ? '🌟' : advice.score >= 60 ? '👍' : '💡'}
                    </div>
                  </div>
                </div>

                {/* コンサルタントのコメント */}
                <div className="bg-slate-900/50 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-bold text-blue-400 mb-3 flex items-center">
                    <span className="mr-2">💬</span>
                    コンサルタントの評価
                  </h3>
                  <p className="text-slate-200 leading-relaxed whitespace-pre-line">
                    {advice.consultantComment}
                  </p>
                </div>

                {/* この選択の強み */}
                {advice.strengths.length > 0 && (
                  <div className="bg-green-900/20 rounded-lg p-6 mb-6 border border-green-700">
                    <h3 className="text-lg font-bold text-green-400 mb-3 flex items-center">
                      <span className="mr-2">✅</span>
                      この選択の強み
                    </h3>
                    <ul className="space-y-2">
                      {advice.strengths.map((strength, idx) => (
                        <li key={idx} className="text-slate-200 flex items-start">
                          <span className="text-green-400 mr-2 mt-1">•</span>
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 注意点・リスク */}
                {advice.risks.length > 0 && (
                  <div className="bg-yellow-900/20 rounded-lg p-6 mb-6 border border-yellow-700">
                    <h3 className="text-lg font-bold text-yellow-400 mb-3 flex items-center">
                      <span className="mr-2">⚠️</span>
                      注意点・リスク
                    </h3>
                    <ul className="space-y-2">
                      {advice.risks.map((risk, idx) => (
                        <li key={idx} className="text-slate-200 flex items-start">
                          <span className="text-yellow-400 mr-2 mt-1">•</span>
                          <span>{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 代替案 */}
                {advice.alternatives.length > 0 && (
                  <div className="bg-purple-900/20 rounded-lg p-6 mb-6 border border-purple-700">
                    <h3 className="text-lg font-bold text-purple-400 mb-3 flex items-center">
                      <span className="mr-2">💡</span>
                      代替案・補完的な調査
                    </h3>
                    <ul className="space-y-2">
                      {advice.alternatives.map((alt, idx) => (
                        <li key={idx} className="text-slate-200 flex items-start">
                          <span className="text-purple-400 mr-2 mt-1">•</span>
                          <span>{alt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* アクションボタン */}
                <div className="flex gap-4">
                  <button
                    onClick={handleConfirm}
                    className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200"
                  >
                    ✓ この調査を実行する
                  </button>
                  <button
                    onClick={() => {
                      setShowAdvice(false);
                      setAdvice(null);
                      setReason('');
                    }}
                    className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                  >
                    再検討する
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
