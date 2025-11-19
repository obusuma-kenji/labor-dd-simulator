import { StageScenario } from "../types";

export const stage1Scenario: StageScenario = {
  id: "stage1",
  name: "地方製造業：サカエ精工の労務DD",
  
  story: {
    background: 
      "サカエ精工は、1975年創業の自動車部品プレス加工メーカーです。大手自動車メーカーの2次サプライヤーとして、高い技術力と品質で信頼を獲得してきました。しかし、現社長の高齢化と後継者不在により、事業承継が喫緊の課題となっています。",
    
    ownerProfile: {
      name: "栄田 一郎",
      age: 68,
      career: "大手自動車メーカー退職後、1975年に創業。一代で年商32億円の企業に成長させた。",
      concern: "息子は都会で別の仕事に就いており、事業を継ぐ意思がない。従業員120名の雇用を守りながら、技術を次世代に継承したい。"
    },
    
    successionReason: 
      "社長は68歳で体力的な限界を感じており、あと2〜3年で引退したいと考えています。親族・従業員に後継者候補がおらず、M&Aによる第三者承継を決断しました。",
    
    keyChallenge: 
      "長時間労働が常態化しており、若手の離職率が高い。ベテラン技術者の暗黙知に依存した生産体制で、標準化が遅れている。未払残業代などの簿外債務の存在も懸念される。",
    
    employeesSituation: 
      "正社員80名、契約社員40名。平均年齢44歳。現場リーダークラス（50代）の技能は高いが、若手（20〜30代）の定着率が低く、技能承継が課題。"
  },
  
  company: {
    id: "c1",
    name: "サカエ精工株式会社",
    industry: "自動車部品製造（プレス加工）",
    employees: 120,
    revenue: 3200000000,
    profit: 180000000,
    askingPrice: 900000000,
    trueValue: 750000000,
    averageAge: 44,
    strengths: [
      "大手メーカーとの長期取引関係",
      "高い技術力と品質管理体制",
      "安定した受注と収益性"
    ],
    weaknesses: [
      "後継者不在による将来の不透明性",
      "長時間労働による若手離職",
      "技能承継の遅れ"
    ]
  },
  
  initialGameState: {
    monthsOwned: 0,
    investigationPoints: 10,
    usedCardIds: [],
    discoveredRiskIds: []
  },
  
  risks: [
    {
      id: "R1-1",
      type: "risk",
      hidden: true,
      category: "hr",
      severity: "critical",
      title: "未払残業代（過去2年分）",
      description: 
        "固定残業代制度を導入しているが、実際の残業時間は固定分を大きく超過。特に繁忙期は月100時間を超える残業が常態化しており、差額の未払いが累積している。",
      impact: -45000000,
      recommendation: 
        "過去2年分の勤怠記録を精査し、未払残業代を算定。買収価格から減額するか、売主に支払いを求める。買収後は勤怠管理システムを導入し、適正な残業管理を実施する。"
    },
    {
      id: "R1-2",
      type: "risk",
      hidden: true,
      category: "hr",
      severity: "high",
      title: "36協定違反（特別条項の上限超過）",
      description: 
        "36協定の特別条項で月80時間、年6回までと定めているが、実態は年10回以上超過しており、労基署の是正勧告リスクがある。",
      impact: -15000000,
      recommendation: 
        "直ちに36協定を遵守できる体制を構築。業務の平準化、人員増強、生産計画の見直しを実施する。"
    },
    {
      id: "R1-3",
      type: "risk",
      hidden: true,
      category: "hr",
      severity: "high",
      title: "契約社員の無期転換権発生（40名）",
      description: 
        "5年以上勤務している契約社員が40名おり、無期転換権が発生している。転換申込みがあれば拒否できず、人件費が増加する。",
      impact: -20000000,
      recommendation: 
        "無期転換を前提とした人事制度を整備し、正社員との処遇バランスを見直す。優秀な人材を確保する機会と捉え、計画的に対応する。"
    },
    {
      id: "R1-4",
      type: "risk",
      hidden: true,
      category: "hr",
      severity: "medium",
      title: "ベテラン技能者の暗黙知に依存",
      description: 
        "プレス加工の高度な技能がベテラン（50代）に集中しており、マニュアル化されていない。若手への承継が進んでおらず、退職リスクが高い。",
      impact: -12000000,
      recommendation: 
        "技能のマニュアル化と動画記録を進め、OJT体系を整備。ベテランを指導員として処遇し、技能承継を加速する。"
    },
    {
      id: "R1-5",
      type: "risk",
      hidden: true,
      category: "legal",
      severity: "medium",
      title: "就業規則の届出義務違反",
      description: 
        "就業規則を10年前に改定したが、労基署への届出を失念している。罰則の対象となる可能性がある。",
      impact: -3000000,
      recommendation: 
        "速やかに労基署に届出を行い、コンプライアンス体制を整備する。"
    },
    {
      id: "R1-6",
      type: "opportunity",
      hidden: true,
      category: "hr",
      severity: "medium",
      title: "自動化による生産性向上の余地",
      description: 
        "一部工程は自動化が可能だが、投資されていない。自動化により残業削減と生産性向上が見込める。",
      impact: 25000000,
      recommendation: 
        "ROIを試算し、優先順位の高い工程から自動化投資を実施。人員を付加価値の高い業務にシフトする。"
    }
  ],
  
  investigationCards: [
    {
      id: "C1-1",
      name: "就業規則・賃金規程の確認",
      description: "就業規則と賃金規程を確認し、労働条件や残業代の取り扱いをチェックする。",
      cost: 2,
      revealsRisks: ["R1-1", "R1-5"],
      addsContext: [
        "固定残業代は月30時間分だが、実態は月80〜100時間の残業がある。",
        "就業規則の最終改定は10年前で、労基署への届出記録が見当たらない。"
      ]
    },
    {
      id: "C1-2",
      name: "勤怠データ・打刻状況の確認",
      description: "タイムカードと実際の勤務時間を突合し、残業の実態を確認する。",
      cost: 3,
      revealsRisks: ["R1-1", "R1-2"],
      addsContext: [
        "繁忙期（月末・期末）は月100時間超の残業が常態化している。",
        "36協定の上限（月80時間）を年10回以上超過している。"
      ]
    },
    {
      id: "C1-3",
      name: "賃金台帳・給与データの確認",
      description: "賃金台帳と勤怠データを突合し、残業代の支払い状況を確認する。",
      cost: 3,
      revealsRisks: ["R1-1"],
      addsContext: [
        "固定残業時間を超える残業代が支払われていないケースが多数ある。",
        "過去2年分で約4,500万円の未払残業代が推定される。"
      ]
    },
    {
      id: "C1-4",
      name: "36協定届の確認",
      description: "36協定の内容と実際の残業時間を比較し、違反の有無を確認する。",
      cost: 2,
      revealsRisks: ["R1-2"],
      addsContext: [
        "特別条項で月80時間・年6回までと定めているが、実態は大幅に超過。"
      ]
    },
    {
      id: "C1-5",
      name: "契約社員・派遣社員の契約書確認",
      description: "有期雇用契約の内容と勤続年数を確認し、無期転換権の発生状況を把握する。",
      cost: 2,
      revealsRisks: ["R1-3"],
      addsContext: [
        "5年以上勤務の契約社員が40名おり、無期転換権が発生している。"
      ]
    },
    {
      id: "C1-6",
      name: "工場見学・現場観察",
      description: "実際の工場を見学し、作業環境や業務フローを確認する。",
      cost: 3,
      revealsRisks: ["R1-4", "R1-6"],
      addsContext: [
        "ベテラン技能者の技術は高いが、マニュアル化されていない。",
        "一部工程は自動化が可能だが、投資されていない。"
      ]
    },
    {
      id: "C1-7",
      name: "従業員インタビュー",
      description: "現場の従業員に労働時間・業務内容・不満をヒアリングする。",
      cost: 3,
      revealsRisks: ["R1-1", "R1-2", "R1-4"],
      addsContext: [
        "繁忙期の残業が多く、体力的にきつい。",
        "ベテランが忙しく、若手への指導時間が取れない。"
      ]
    },
    {
      id: "C1-8",
      name: "人事・総務担当者へのインタビュー",
      description: "人事・総務担当者に労務管理の実態を確認する。",
      cost: 2,
      revealsRisks: ["R1-1", "R1-3", "R1-5"],
      addsContext: [
        "残業時間の管理が不十分で、実態を把握しきれていない。",
        "無期転換権については認識しているが、対応が後手に回っている。"
      ]
    },
    {
      id: "C1-9",
      name: "労働基準監督署の調査履歴確認",
      description: "過去の労基署による調査・是正勧告の有無を確認する。",
      cost: 2,
      revealsRisks: ["R1-2", "R1-5"],
      addsContext: [
        "過去5年間で労基署の調査は受けていないが、今後のリスクは高い。"
      ]
    },
    {
      id: "C1-10",
      name: "技能承継・教育訓練の状況確認",
      description: "技能承継の取り組みや教育訓練制度の有無を確認する。",
      cost: 2,
      revealsRisks: ["R1-4"],
      addsContext: [
        "技能承継の体系的な仕組みがなく、OJTに依存している。",
        "若手は先輩の見よう見まねで学んでおり、習得に時間がかかる。"
      ]
    }
  ],
  
  events: [],
  
  scoringRules: {
    minMajorRisksFound: 2,
    maxTrueValueDiffRate: 0.1,
    maxBogiDiffRate: 0.2
  }
};
