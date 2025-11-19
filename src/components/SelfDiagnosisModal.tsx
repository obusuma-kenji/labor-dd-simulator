import React, { useState } from 'react';

interface SelfDiagnosisModalProps {
  companyIndustry: string;
  onClose: () => void;
}

interface CheckItem {
  id: string;
  question: string;
  riskLevel: number; // 1-10
}

const industryCheckLists: Record<string, CheckItem[]> = {
  '製造業': [
    { id: 'm1', question: '月80時間を超える残業が発生していますか？', riskLevel: 10 },
    { id: 'm2', question: '36協定は適切に締結・届出していますか？', riskLevel: 8 },
    { id: 'm3', question: '5年以上勤務している契約社員はいますか？', riskLevel: 7 },
    { id: 'm4', question: '固定残業代制度を導入していますか？', riskLevel: 6 },
    { id: 'm5', question: '過去2年以内に労基署の調査を受けましたか？', riskLevel: 9 },
    { id: 'm6', question: '就業規則の最終改定は3年以上前ですか？', riskLevel: 5 },
    { id: 'm7', question: 'ベテラン社員の技能がマニュアル化されていませんか？', riskLevel: 6 },
    { id: 'm8', question: '残業代の計算に自信がありますか？（いいえ=リスク）', riskLevel: 7 }
  ],
  '飲食業': [
    { id: 'f1', question: '週末・祝日は14時間以上働くスタッフがいますか？', riskLevel: 10 },
    { id: 'f2', question: 'パート・アルバイトの社会保険加入を確認していますか？（いいえ=リスク）', riskLevel: 8 },
    { id: 'f3', question: '正社員とパートで同じ業務をしていますか？', riskLevel: 7 },
    { id: 'f4', question: '休日出勤の代休取得ルールは明確ですか？（いいえ=リスク）', riskLevel: 7 },
    { id: 'f5', question: 'ハラスメント相談窓口を設置していますか？（いいえ=リスク）', riskLevel: 6 },
    { id: 'f6', question: '固定残業代の実態時間を把握していますか？（いいえ=リスク）', riskLevel: 8 },
    { id: 'f7', question: '若手の離職率が高いですか？', riskLevel: 5 },
    { id: 'f8', question: '調理師の長時間労働を改善したいと思いますか？', riskLevel: 6 }
  ],
  '介護事業': [
    { id: 'c1', question: '処遇改善加算を取得していますか？', riskLevel: 10 },
    { id: 'c2', question: 'キャリアパス要件を満たしていますか？（いいえ=リスク）', riskLevel: 9 },
    { id: 'c3', question: '夜勤明けの引き継ぎ時間を労働時間に算入していますか？（いいえ=リスク）', riskLevel: 8 },
    { id: 'c4', question: '訪問介護で無資格者が身体介護をしていませんか？', riskLevel: 10 },
    { id: 'c5', question: 'ストレスチェックを適切に実施していますか？（いいえ=リスク）', riskLevel: 7 },
    { id: 'c6', question: '利用者・家族からのハラスメント対策はありますか？（いいえ=リスク）', riskLevel: 6 },
    { id: 'c7', question: '介護記録は紙ベースで管理していますか？', riskLevel: 4 },
    { id: 'c8', question: '過去3年以内に実地指導で指摘を受けましたか？', riskLevel: 8 }
  ],
  'IT・ソフトウェア': [
    { id: 'i1', question: '裁量労働制を導入していますか？', riskLevel: 9 },
    { id: 'i2', question: '裁量労働制適用者は実際に裁量がありますか？（いいえ=リスク）', riskLevel: 10 },
    { id: 'i3', question: 'フリーランスが社員と同じオフィスで働いていますか？', riskLevel: 8 },
    { id: 'i4', question: '固定残業代（45時間以上）を設定していますか？', riskLevel: 7 },
    { id: 'i5', question: '深夜・休日もSlackやメールが飛び交っていますか？', riskLevel: 8 },
    { id: 'i6', question: '36協定の上限を超えることがありますか？', riskLevel: 9 },
    { id: 'i7', question: 'リモートワーク制度が整備されていますか？（いいえ=リスク）', riskLevel: 5 },
    { id: 'i8', question: 'エンジニアの離職率が高いですか？', riskLevel: 6 }
  ]
};

export const SelfDiagnosisModal: React.FC<SelfDiagnosisModalProps> = ({ 
  companyIndustry, 
  onClose 
}) => {
  const [currentStep, setCurrentStep] = useState<'intro' | 'checklist' | 'result'>('intro');
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [contactInfo, setContactInfo] = useState({ name: '', email: '', phone: '' });

  // 業種に応じたチェックリストを取得
  const getCheckList = (): CheckItem[] => {
    if (companyIndustry.includes('製造')) return industryCheckLists['製造業'];
    if (companyIndustry.includes('飲食')) return industryCheckLists['飲食業'];
    if (companyIndustry.includes('介護')) return industryCheckLists['介護事業'];
    if (companyIndustry.includes('IT') || companyIndustry.includes('ソフトウェア')) return industryCheckLists['IT・ソフトウェア'];
    return industryCheckLists['製造業']; // デフォルト
  };

  const checkList = getCheckList();

  // リスクスコアを計算
  const calculateRiskScore = (): number => {
    const totalRisk = Array.from(checkedItems)
      .map(id => checkList.find(item => item.id === id)?.riskLevel || 0)
      .reduce((sum, risk) => sum + risk, 0);
    
    const maxRisk = checkList.reduce((sum, item) => sum + item.riskLevel, 0);
    return Math.round((totalRisk / maxRisk) * 100);
  };

  const handleCheck = (itemId: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(itemId)) {
      newChecked.delete(itemId);
    } else {
      newChecked.add(itemId);
    }
    setCheckedItems(newChecked);
  };

  const handleSubmitChecklist = () => {
    setCurrentStep('result');
  };

  const riskScore = calculateRiskScore();
  const getRiskLevel = () => {
    if (riskScore >= 70) return { level: '危険', color: 'red', message: '複数の重大なリスクが潜んでいます' };
    if (riskScore >= 50) return { level: '要注意', color: 'orange', message: '早急な対策が必要です' };
    if (riskScore >= 30) return { level: '注意', color: 'yellow', message: '一部改善の余地があります' };
    return { level: '良好', color: 'green', message: '概ね適切に管理されています' };
  };

  const riskLevel = getRiskLevel();

  // イントロ画面
  if (currentStep === 'intro') {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
        <div className="bg-slate-800 rounded-lg max-w-2xl w-full p-8 border border-slate-700">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold mb-4 text-blue-400">お疲れ様でした！</h2>
            <p className="text-slate-300 text-lg">労務DDシミュレーションを完了しました</p>
          </div>

          <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-yellow-400 mb-3">⚠️ 重要なお知らせ</h3>
            <p className="text-slate-200 leading-relaxed mb-4">
              このゲームで発見したリスクは、<strong className="text-yellow-300">実際の企業で頻繁に発生</strong>しています。
            </p>
            <p className="text-slate-200 leading-relaxed">
              <strong className="text-red-400">あなたの会社は大丈夫ですか？</strong>
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setCurrentStep('checklist')}
              className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold py-4 px-6 rounded-lg text-lg transition-all duration-200 transform hover:scale-105"
            >
              🔍 自社の労務リスクを診断する（無料・1分）
            </button>
            <button
              onClick={onClose}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              後で診断する
            </button>
          </div>
        </div>
      </div>
    );
  }

  // チェックリスト画面
  if (currentStep === 'checklist') {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-slate-800 rounded-lg max-w-3xl w-full p-8 border border-slate-700 my-8">
          <h2 className="text-2xl font-bold mb-2 text-blue-400">🔍 自社の労務リスク診断</h2>
          <p className="text-slate-300 mb-6">該当する項目にチェックを入れてください（匿名・無料）</p>

          <div className="bg-slate-900/50 rounded-lg p-6 mb-6 space-y-4">
            {checkList.map((item) => (
              <label
                key={item.id}
                className="flex items-start p-4 rounded-lg hover:bg-slate-700/50 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={checkedItems.has(item.id)}
                  onChange={() => handleCheck(item.id)}
                  className="mt-1 mr-3 w-5 h-5"
                />
                <span className="text-slate-200">{item.question}</span>
              </label>
            ))}
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleSubmitChecklist}
              disabled={checkedItems.size === 0}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-700 disabled:to-slate-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
            >
              診断結果を見る
            </button>
            <button
              onClick={() => setCurrentStep('intro')}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              戻る
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 結果画面
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-slate-800 rounded-lg max-w-3xl w-full p-8 border border-slate-700 my-8">
        <h2 className="text-2xl font-bold mb-6 text-blue-400">📊 診断結果</h2>

        {/* リスクスコア */}
        <div className={`bg-${riskLevel.color}-900/20 border border-${riskLevel.color}-700 rounded-lg p-8 mb-6 text-center`}>
          <p className="text-slate-300 mb-2">あなたの会社の労務リスクスコア</p>
          <p className={`text-6xl font-bold mb-4 text-${riskLevel.color}-400`}>
            {riskScore} <span className="text-2xl">/ 100</span>
          </p>
          <p className={`text-2xl font-bold mb-2 text-${riskLevel.color}-400`}>
            【{riskLevel.level}】
          </p>
          <p className="text-slate-200">{riskLevel.message}</p>
        </div>

        {/* チェックされた項目 */}
        {checkedItems.size > 0 && (
          <div className="bg-slate-900/50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-bold text-yellow-400 mb-4">⚠️ 確認されたリスク要因</h3>
            <ul className="space-y-2">
              {Array.from(checkedItems).map(id => {
                const item = checkList.find(i => i.id === id);
                return item ? (
                  <li key={id} className="text-slate-200 flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>{item.question}</span>
                  </li>
                ) : null;
              })}
            </ul>
          </div>
        )}

        {/* 推奨アクション */}
        <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-bold text-blue-400 mb-4">💡 推奨アクション</h3>
          <ol className="list-decimal list-inside space-y-2 text-slate-200">
            <li>勤怠管理の実態を調査する</li>
            <li>就業規則・労使協定の内容を確認する</li>
            <li>社会保険労務士に相談する</li>
            {riskScore >= 50 && <li className="text-red-400 font-bold">労務デューデリジェンス（労務DD）の実施を検討する</li>}
          </ol>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-700 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-bold text-purple-400 mb-3">🎁 無料労務診断のご案内</h3>
          <p className="text-slate-200 mb-4 leading-relaxed">
            専門家（社会保険労務士）による<strong className="text-yellow-300">無料労務診断</strong>を実施しています。
            御社の労務リスクを詳しく診断し、具体的な改善策をご提案します。
          </p>
          
          <div className="space-y-3 mb-4">
            <input
              type="text"
              placeholder="お名前"
              value={contactInfo.name}
              onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
              className="w-full bg-slate-900/50 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-500"
            />
            <input
              type="email"
              placeholder="メールアドレス"
              value={contactInfo.email}
              onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
              className="w-full bg-slate-900/50 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-500"
            />
            <input
              type="tel"
              placeholder="電話番号（任意）"
              value={contactInfo.phone}
              onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
              className="w-full bg-slate-900/50 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-500"
            />
          </div>

          <button
            onClick={() => {
              alert(`お申し込みありがとうございます！\n\nお名前: ${contactInfo.name}\nメール: ${contactInfo.email}\n\n担当者より3営業日以内にご連絡いたします。`);
              onClose();
            }}
            disabled={!contactInfo.name || !contactInfo.email}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-slate-700 disabled:to-slate-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
          >
            無料労務診断を申し込む
          </button>
          <p className="text-xs text-slate-400 mt-2 text-center">
            ※ご入力いただいた情報は、労務診断のご連絡のみに使用いたします
          </p>
        </div>

        <div className="text-center">
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
