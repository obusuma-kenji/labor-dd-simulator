import { StageScenario } from "../types";

export const stage2Scenario: StageScenario = {
  id: "stage2",
  name: "老舗飲食業：割烹すずかぜの労務DD",
  
  story: {
    background: 
      "1965年創業の老舗割烹料理店「すずかぜ」。地元で愛される本店に加え、駅前に2店舗を展開。伝統的な日本料理と季節の味で、地域の冠婚葬祭や接待に欠かせない存在です。",
    
    ownerProfile: {
      name: "鈴木 風太",
      age: 65,
      career: "料理人として30年修行後、父の跡を継いで二代目に。チェーン展開で売上を3倍に伸ばした。",
      concern: "調理師不足が深刻で、現場は限界。長時間労働で若手が定着せず、技術承継ができない。コロナ後の人材確保にも苦戦している。"
    },
    
    successionReason: 
      "65歳となり、厨房に立つ体力が続かなくなってきた。娘は栄養士として別の道を歩んでおり、親族に継ぐ者がいない。優良な買い手に譲り、従業員の雇用と味を守りたい。",
    
    keyChallenge: 
      "調理師・ホール担当の長時間労働（月80時間超の残業）、休日出勤の常態化。パート・アルバイトの社会保険未加入、同一労働同一賃金対応の遅れ。ハラスメント相談窓口の未整備。",
    
    employeesSituation: 
      "正社員25名（調理15名、ホール10名）、パート・アルバイト40名。平均年齢47歳。ベテラン調理師は高齢化し、若手が育っていない。離職率は年20%。"
  },
  
  company: {
    id: "c2",
    name: "株式会社すずかぜ",
    industry: "飲食業（割烹料理・日本料理）",
    employees: 65,
    revenue: 580000000,
    profit: 28000000,
    askingPrice: 180000000,
    trueValue: 150000000,
    averageAge: 47,
    strengths: [
      "地元で50年以上の実績、顧客基盤が強固",
      "伝統的な調理技術と季節の仕入れノウハウ",
      "3店舗とも駅近で立地が良好"
    ],
    weaknesses: [
      "調理師・ホール担当の長時間労働が常態化",
      "若手の離職率が高く、技術承継が困難",
      "パート・アルバイトの労務管理が未整備"
    ]
  },
  
  initialGameState: {
    monthsOwned: 0,
    investigationPoints: 8,
    usedCardIds: [],
    discoveredRiskIds: []
  },
  
  risks: [
    {
      id: "R2-1",
      type: "risk",
      hidden: true,
      category: "hr",
      severity: "critical",
      title: "長時間労働と未払残業（調理師・ホール）",
      description: 
        "繁忙期（週末・祝日）は開店前準備から閉店後片付けまで14時間超の勤務が常態化。固定残業代は設定されているが、実態は月80時間超の残業があり、未払残業代が累積している。",
      impact: -25000000,
      recommendation: 
        "過去2年分の勤怠データを精査し、未払残業代を算定。シフト管理システムの導入と、調理補助・ホール人員の増員で業務を平準化する。"
    },
    {
      id: "R2-2",
      type: "risk",
      hidden: true,
      category: "hr",
      severity: "high",
      title: "休日出勤・代休未取得の常態化",
      description: 
        "冠婚葬祭シーズンは休日出勤が続き、代休が取得できていない。労基法違反のリスクがある。",
      impact: -8000000,
      recommendation: 
        "代休取得ルールを明確化し、取得状況を管理。繁忙期は応援スタッフを確保する仕組みを構築。"
    },
    {
      id: "R2-3",
      type: "risk",
      hidden: true,
      category: "hr",
      severity: "high",
      title: "パート・アルバイトの社会保険未加入",
      description: 
        "週30時間以上勤務のパート従業員が社会保険に未加入。適用漏れが多数存在する可能性がある。",
      impact: -6000000,
      recommendation: 
        "全パート・アルバイトの労働時間を精査し、適用要件を満たす者を社会保険に加入させる。"
    },
    {
      id: "R2-4",
      type: "risk",
      hidden: true,
      category: "hr",
      severity: "medium",
      title: "同一労働同一賃金対応の遅れ",
      description: 
        "正社員とパートで同じ業務をしているケースがあるが、賞与・手当に差がある。説明が不十分で訴訟リスクがある。",
      impact: -4000000,
      recommendation: 
        "職務内容を整理し、正社員・パート間の処遇差を合理的に説明できる制度に見直す。"
    },
    {
      id: "R2-5",
      type: "risk",
      hidden: true,
      category: "hr",
      severity: "medium",
      title: "ハラスメント相談窓口の未整備",
      description: 
        "厨房での厳しい指導がパワハラと受け取られるケースがあるが、相談窓口が整備されていない。",
      impact: -3000000,
      recommendation: 
        "ハラスメント防止規程を整備し、外部相談窓口を設置。管理職研修を実施する。"
    },
    {
      id: "R2-6",
      type: "opportunity",
      hidden: true,
      category: "hr",
      severity: "medium",
      title: "調理技術のマニュアル化による効率化",
      description: 
        "ベテラン調理師の技術を標準化すれば、若手育成が加速し、調理時間の短縮も期待できる。",
      impact: 8000000,
      recommendation: 
        "調理工程をマニュアル化し、OJT教育体系を整備。動画マニュアルも活用する。"
    }
  ],
  
  investigationCards: [
    {
      id: "C2-1",
      name: "就業規則・賃金規程の確認",
      description: "就業規則と賃金規程を確認し、残業・休日・手当の取り扱いをチェックする。",
      cost: 2,
      revealsRisks: ["R2-1", "R2-4"],
      addsContext: [
        "固定残業手当は月30時間分だが、実態は80時間超の残業がある。",
        "正社員とパートの手当・賞与の差について、明確な基準がない。"
      ]
    },
    {
      id: "C2-2",
      name: "勤怠データ・打刻状況の確認",
      description: "タイムカードと実際の勤務時間を突合し、残業・休日出勤の実態を確認する。",
      cost: 3,
      revealsRisks: ["R2-1", "R2-2"],
      addsContext: [
        "繁忙期（週末）は14時間超の勤務が常態化している。",
        "代休が取得できておらず、休日出勤手当も未払いのケースがある。"
      ]
    },
    {
      id: "C2-3",
      name: "賃金台帳・給与データの確認",
      description: "賃金台帳と勤怠データを突合し、残業代・休日手当の支払い状況を確認する。",
      cost: 3,
      revealsRisks: ["R2-1", "R2-2"],
      addsContext: [
        "固定残業時間を超える残業代が支給されていないケースが多数ある。",
        "休日出勤手当の未払いが散見される。"
      ]
    },
    {
      id: "C2-4",
      name: "社会保険・雇用保険の加入状況確認",
      description: "パート・アルバイトの労働時間と社会保険加入状況を確認する。",
      cost: 2,
      revealsRisks: ["R2-3"],
      addsContext: [
        "週30時間以上勤務のパート従業員で、社会保険未加入者が複数いる。"
      ]
    },
    {
      id: "C2-5",
      name: "ハラスメント・相談窓口の確認",
      description: "ハラスメント防止規程と相談窓口の有無を確認する。",
      cost: 2,
      revealsRisks: ["R2-5"],
      addsContext: [
        "ハラスメント防止規程はあるが、相談窓口が明確でない。",
        "厨房での厳しい指導がパワハラと感じられているケースがある。"
      ]
    },
    {
      id: "C2-6",
      name: "店舗見学・現場観察",
      description: "実際の店舗を見学し、調理・接客の業務フローを確認する。",
      cost: 3,
      revealsRisks: ["R2-6"],
      addsContext: [
        "ベテラン調理師の技術は高いが、マニュアル化されていない。",
        "若手は見よう見まねで学んでおり、習得に時間がかかる。"
      ]
    },
    {
      id: "C2-7",
      name: "調理師・ホール担当者へのインタビュー",
      description: "調理師・ホール担当者に労働時間・休日・指導状況をヒアリングする。",
      cost: 3,
      revealsRisks: ["R2-1", "R2-2", "R2-5", "R2-6"],
      addsContext: [
        "繁忙期は休みが取れず、体力的に限界を感じている。",
        "厨房での指導が厳しく、若手が辞めていく。"
      ]
    },
    {
      id: "C2-8",
      name: "人事・総務担当者へのインタビュー",
      description: "人事・総務担当者に労務管理の実態を確認する。",
      cost: 2,
      revealsRisks: ["R2-1", "R2-3", "R2-4"],
      addsContext: [
        "残業時間の管理が不十分で、固定残業を超える分が把握できていない。",
        "パート・アルバイトの社会保険加入基準が曖昧である。"
      ]
    },
    {
      id: "C2-9",
      name: "従業員アンケート・面談",
      description: "従業員の満足度・不満・健康状態を匿名アンケートで把握する。",
      cost: 3,
      revealsRisks: ["R2-1", "R2-2", "R2-5"],
      addsContext: [
        "長時間労働と休日不足への不満が多い。",
        "厨房の雰囲気が厳しく、若手が萎縮している。"
      ]
    },
    {
      id: "C2-10",
      name: "調理技術・マニュアルの確認",
      description: "調理工程のマニュアルやレシピの整備状況を確認する。",
      cost: 2,
      revealsRisks: ["R2-6"],
      addsContext: [
        "レシピはあるが、細かい技術は口伝で、標準化されていない。"
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
