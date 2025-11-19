import { GoogleGenerativeAI } from "@google/generative-ai";
import { Company, DDResult, DDFinding } from "./types";

// Gemini APIの初期化
const getGenAI = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Gemini APIキーが設定されていません。.env.localファイルにVITE_GEMINI_API_KEY=your_api_keyを設定してください。"
    );
  }
  return new GoogleGenerativeAI(apiKey);
};

/**
 * Gemini APIを使って労務DD結果を生成
 */
export const generateDDResults = async (
  company: Company,
  ddLevel: string,
  extraContext?: string
): Promise<DDResult> => {
  try {
    const genAI = getGenAI();
    // ✅ モデル名を修正
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // プロンプト作成
    const prompt = buildDDPrompt(company, ddLevel, extraContext);

    console.log("Gemini APIにリクエスト送信中...");
    
    // Gemini APIにリクエスト
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("Gemini APIからレスポンス受信");
    console.log("レスポンステキスト:", text.substring(0, 200) + "...");

    // JSONをパース
    const ddResult = parseGeminiResponse(text, company);
    
    return ddResult;
  } catch (error) {
    console.error("Gemini API呼び出しエラー:", error);
    
    // エラー時はフォールバック
    return generateFallbackResult(company);
  }
};

/**
 * DD用のプロンプトを構築
 */
const buildDDPrompt = (
  company: Company,
  ddLevel: string,
  extraContext?: string
): string => {
  const baseInfo = `
# 労務デューデリジェンス（DD）タスク

あなたは経験豊富な社会保険労務士です。以下の企業について労務DDを実施してください。

## 対象企業情報
- 企業名: ${company.name}
- 業種: ${company.industry}
- 従業員数: ${company.employees}名
- 売上高: ¥${company.revenue.toLocaleString()}
- 営業利益: ¥${company.profit.toLocaleString()}
- 希望売却価格: ¥${company.askingPrice.toLocaleString()}
- 平均年齢: ${company.averageAge}歳

## 強み
${company.strengths.map((s) => `- ${s}`).join("\n")}

## 弱み
${company.weaknesses.map((w) => `- ${w}`).join("\n")}

## DD実施レベル
${ddLevel}

${extraContext ? `## 追加情報・調査結果\n${extraContext}` : ""}

## 出力形式
以下のJSON形式で出力してください。**JSON以外の文字は一切含めないでください。**

{
  "findings": [
    {
      "category": "hr",
      "severity": "高",
      "title": "リスクのタイトル",
      "description": "リスクの詳細説明",
      "impact": -20000000,
      "recommendation": "推奨対応策"
    }
  ],
  "trueValue": 720000000,
  "potentialValue": 730000000,
  "summary": "DD結果のサマリー"
}

## 注意事項
1. **findings配列**: 発見した労務リスクを列挙（2〜5件程度）
2. **category**: "hr"（人事労務）を使用
3. **severity**: "低"、"中"、"高"、"重大"のいずれか
4. **impact**: 金額的影響（マイナスの場合は負の値）
5. **trueValue**: 真の企業価値（簿外債務を考慮した現在価値）
6. **potentialValue**: 潜在価値（リスク改善後の将来価値）
7. **summary**: 100文字程度のサマリー

重要: 出力は必ず有効なJSON形式にしてください。マークダウンのコードブロックも不要です。
`;

  return baseInfo;
};

/**
 * Geminiのレスポンスをパース
 */
const parseGeminiResponse = (text: string, company: Company): DDResult => {
  try {
    // マークダウンのコードブロックを除去
    let jsonText = text.trim();
    jsonText = jsonText.replace(/```json\n?/g, "");
    jsonText = jsonText.replace(/```\n?/g, "");
    jsonText = jsonText.trim();

    const parsed = JSON.parse(jsonText);

    // バリデーション
    if (!parsed.findings || !Array.isArray(parsed.findings)) {
      throw new Error("findings配列が不正です");
    }

    return {
      findings: parsed.findings.map((f: any) => ({
        category: f.category || "hr",
        severity: f.severity || "中",
        title: f.title || "タイトル未設定",
        description: f.description || "",
        impact: typeof f.impact === "number" ? f.impact : 0,
        recommendation: f.recommendation || ""
      })),
      trueValue: parsed.trueValue || company.trueValue || company.askingPrice,
      potentialValue: parsed.potentialValue || company.trueValue || company.askingPrice,
      summary: parsed.summary || "DD結果のサマリーがありません。"
    };
  } catch (error) {
    console.error("JSONパースエラー:", error);
    console.log("受信したテキスト:", text);
    
    // パース失敗時はフォールバック
    return generateFallbackResult(company);
  }
};

/**
 * エラー時のフォールバック結果
 */
const generateFallbackResult = (company: Company): DDResult => {
  const trueValue = company.trueValue ?? company.askingPrice;
  const potentialValue = trueValue * 1.1;

  const findings: DDFinding[] = [
    {
      category: "hr",
      severity: "高",
      title: "長時間労働と未払残業のリスク",
      description:
        "勤怠データと賃金台帳から、一部部署で固定残業時間を超えるサービス残業が常態化している可能性が読み取れる。",
      impact: -20000000,
      recommendation:
        "過去の未払分について優先度の高い部署から精査し、是正と再発防止の仕組み作りを行うべきである。"
    },
    {
      category: "hr",
      severity: "中",
      title: "安全衛生管理の形式化",
      description:
        "労災・ヒヤリハットの記録は存在するが、分析・対策が十分とは言えず、潜在的な労災リスクが残存している。",
      impact: -8000000,
      recommendation:
        "リスクアセスメントの実施と、危険度の高い工程からの是正措置を優先して検討する必要がある。"
    }
  ];

  return {
    findings,
    trueValue,
    potentialValue,
    summary:
      "※API接続エラーのため、サンプルデータを表示しています。APIキーとモデル名を確認してください。"
  };
};