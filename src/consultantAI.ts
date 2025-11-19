import { ConsultantAdvice, InvestigationCard, Company, CompanyStory } from './types';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

/**
 * AIコンサルタントに相談して、カード選択に対するアドバイスを取得
 */
export async function consultWithAI(
  card: InvestigationCard,
  reason: string,
  company: Company,
  story: CompanyStory
): Promise<ConsultantAdvice> {
  
  // APIキーのチェック
  if (!GEMINI_API_KEY || GEMINI_API_KEY === '') {
    console.warn('Gemini APIキーが設定されていません。フォールバックモードで動作します。');
    return getFallbackAdvice(card, reason, company);
  }
  
  const prompt = `
あなたは30年以上の経験を持つ事業承継専門の大御所コンサルタントです。
M&Aにおける労務デューデリジェンス（労務DD）の専門家として、若手コンサルタントにアドバイスをしてください。

# 対象企業情報
企業名: ${company.name}
業種: ${company.industry}
従業員数: ${company.employees}名
年商: ${(company.revenue / 100000000).toFixed(1)}億円

# 企業の課題
${story.keyChallenge}

# 若手コンサルタントが選択した調査
調査項目: ${card.name}
調査内容: ${card.description}
調査コスト: ${card.cost}ポイント

# 選択理由
${reason}

# 指示
以下の観点から、この選択を評価してアドバイスしてください：

1. **この選択の評価コメント**（100-150文字程度）
   - なぜこの調査が適切か（または不適切か）
   - この企業の状況を踏まえた評価

2. **この選択の強み**（2-3項目）
   - この調査で得られる情報の価値
   - リスク発見の有効性

3. **注意点・リスク**（1-3項目）
   - この調査だけでは不十分な点
   - 見落としがちなポイント

4. **代替案・補完的な調査**（1-3項目）
   - 併せて実施すべき調査
   - より効果的なアプローチ

5. **適切度スコア**（0-100点）
   - 85-100点: 極めて適切な選択
   - 70-84点: 良い選択
   - 50-69点: 妥当だが改善の余地あり
   - 0-49点: 再検討を推奨

# 出力形式
必ず以下のJSON形式で出力してください：

{
  "consultantComment": "評価コメント",
  "strengths": ["強み1", "強み2", "強み3"],
  "risks": ["注意点1", "注意点2"],
  "alternatives": ["代替案1", "代替案2"],
  "score": 85
}

重要: JSON形式のみを出力し、他の説明文は一切含めないでください。
`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error Details:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // レスポンスの検証
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('Gemini APIからの応答が空です');
    }

    const generatedText = data.candidates[0].content.parts[0].text;

    // JSONを抽出（マークダウンのコードブロックを除去）
    let jsonText = generatedText.trim();
    jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    const advice = JSON.parse(jsonText);

    return {
      cardId: card.id,
      cardName: card.name,
      playerReason: reason,
      consultantComment: advice.consultantComment,
      strengths: advice.strengths || [],
      risks: advice.risks || [],
      alternatives: advice.alternatives || [],
      score: advice.score || 70
    };

  } catch (error) {
    console.error('AI相談エラー:', error);
    
    // フォールバック: ダミーのアドバイスを返す
    return getFallbackAdvice(card, reason, company);
  }
}

/**
 * フォールバック用のアドバイスを生成
 */
function getFallbackAdvice(
  card: InvestigationCard,
  reason: string,
  company: Company
): ConsultantAdvice {
  return {
    cardId: card.id,
    cardName: card.name,
    playerReason: reason,
    consultantComment: `${card.name}は、${company.name}の状況を考えると重要な調査です。選択理由も明確で、適切な判断だと思います。ただし、この調査だけでなく、他の関連する調査も併せて実施することで、より包括的なリスク把握が可能になります。\n\n※現在、AIコンサルタント機能はオフラインモードで動作しています。`,
    strengths: [
      '選択した調査項目は企業の課題に直結している',
      '客観的なデータで実態を把握できる',
      'リスクの定量化が可能'
    ],
    risks: [
      '書類だけでは実態と乖離している可能性がある',
      '現場の声も併せて確認することが重要'
    ],
    alternatives: [
      '従業員へのインタビューも実施する',
      '過去の是正勧告履歴も確認する'
    ],
    score: 75
  };
}