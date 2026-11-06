export type MarketCrashMode = 'none' | 'moderate' | 'blackswan';

export interface SimulatorInputs {
  initialSeed: number; // 만원 (예: 1000 = 10,000,000원)
  monthlySavings: number; // 만원 (예: 100 = 1,000,000원)
  targetYears: number; // 년수 (예: 10년)
  expectedAnnualReturn: number; // % (예: 8)
  annualSavingsGrowthRate: number; // 연간 저축액 증가율 (연봉 인상률 반영 %, 기본 3%)

  // 현실 누수 변수 (Life Friction)
  deliveryFrequency: number; // 월 배달/충동 외식 횟수 (회)
  deliveryCostPerTime: number; // 1회당 비용 (만원, 기본 2.5만원)
  deliveryDefenseRate: number; // 배달 방어율 (%, 0% = 전부 시켜먹음, 100% = 전부 방어)
  
  annualEmergencyEvents: number; // 연간 경조사/돌발 이벤트 (회)
  emergencyCostPerEvent: number; // 이벤트당 평균 지출 (만원, 기본 50만원)
  
  // 돌발 수입 중단 쇼크 (Sudden Income Shock)
  enableIncomeShock: boolean; // 수입 중단 쇼크 활성화 여부
  incomeShockYear: number; // 몇 년차에 수입이 끊기는가? (예: 3년차)
  incomeShockDurationMonths: number; // 몇 개월 동안 끊기는가? (예: 6개월)
  monthlySurvivalExpense: number; // 무소득 기간 월 필수 생존비용 (만원, 예: 150만원)

  // 스트레스 시나리오
  marketCrashMode: MarketCrashMode;
  inflationRate: number; // % (기본 3%)
}

export interface YearSimulationPoint {
  year: number;
  label: string;
  idealBalance: number; // 누수 없는 장밋빛 자산 (만원)
  normalBalance: number; // 현실 지출 반영 정상 자산 (만원)
  stressBalance: number; // 스트레스 폭락장 반영 자산 (만원)
  totalPrincipal: number; // 순수 원금 누적 (만원)
  accumulatedLeakage: number; // 충동/돌발 지출로 새어나간 누적 금액 (만원)
  isCrashYear: boolean;
  hadIncomeShock: boolean;
  events: string[]; // 연도별 발생 이벤트 태그 목록
  drawdownRate: number; // 전고점 대비 하락률 (%)
  stressNetProfit: number; // 스트레스 순수익 (잔고 - 원금, 만원)
  stressProfitRate: number; // 스트레스 수익률 (%)
}

export type MentalRiskLevel = 'SAFE' | 'CAUTION' | 'PANIC' | 'MELTDOWN';

export interface SimulationResult {
  timeline: YearSimulationPoint[];
  finalIdeal: number;
  finalNormal: number;
  finalStress: number;
  totalInvestedPrincipal: number;
  totalLeakageAmount: number;
  
  maxDrawdownRate: number; // 최대 낙폭 (MDD, %)
  maxDrawdownAmount: number; // 최악의 순간 증발한 금액 (만원)
  worstYear: number; // 최악의 해
  
  mentalRisk: {
    score: number; // 0 ~ 100
    level: MentalRiskLevel;
    title: string;
    description: string;
    prescription: string;
  };
}
