export type MarketCrashMode = 'none' | 'moderate' | 'blackswan';

export type ExpenseCategory = 'subscription' | 'habit' | 'emergency' | 'custom';

export interface ExpenseLeakItem {
  id: string;
  name: string;
  category: ExpenseCategory;
  period: 'monthly' | 'yearly';
  frequency: number;
  costPerUnit: number; // 만원
  defenseRate: number; // %
  isActive: boolean;
}

// 🚗 자동차 구매 설정
export interface CarPurchaseConfig {
  enabled: boolean;
  purchaseYear: number; // N년차에 구매 (기본 2년차)
  carPrice: number; // 차량 가격 (만원, 예: 4800)
  downPayment: number; // 선수금 (만원, 예: 1000)
  loanMonths: number; // 할부 개월 (예: 60)
  loanRate: number; // 할부 금리 (%, 예: 5.5)
  monthlyMaintenance: number; // 월 보험료/유류비/자동차세 (만원, 예: 45)
  annualDepreciationRate: number; // 연간 감가상각률 (%, 기본 15)
}

// 🏠 내 집 마련 / 주택담보대출 설정
export interface HomePurchaseConfig {
  enabled: boolean;
  purchaseYear: number; // N년차에 매수 (기본 4년차)
  homePrice: number; // 집값 (만원, 예: 60000 = 6억원)
  downPayment: number; // 자기자본 선수금 (만원, 예: 20000 = 2억원)
  mortgageYears: number; // 대출 만기 (년, 예: 30)
  mortgageRate: number; // 주담대 금리 (%, 예: 4.2)
  annualAppreciationRate: number; // 연간 집값 변동률 (%, 기본 2.5)
}

export interface SimulatorInputs {
  initialSeed: number; // 만원
  monthlySavings: number; // 만원
  targetYears: number; // 년수
  expectedAnnualReturn: number; // %
  annualSavingsGrowthRate: number; // %

  expenseLeaks: ExpenseLeakItem[];
  
  // 돌발 수입 중단 쇼크
  enableIncomeShock: boolean;
  incomeShockYear: number;
  incomeShockDurationMonths: number;
  monthlySurvivalExpense: number; // 만원

  // 🚗 대형 지름 1: 자동차 구매
  carPurchase: CarPurchaseConfig;

  // 🏠 대형 지름 2: 내 집 마련 / 주담대
  homePurchase: HomePurchaseConfig;

  // 스트레스 시나리오
  marketCrashMode: MarketCrashMode;
  inflationRate: number;
}

export interface YearSimulationPoint {
  year: number;
  label: string;
  idealBalance: number; // 장밋빛 복리 순자산 (만원)
  normalBalance: number; // 현실 반영 순자산 (만원)
  stressBalance: number; // 스트레스 순자산 (만원)
  liquidBalance: number; // 최악의 순간 실제 쥐고 있는 현금/유동성 잔고 (만원)
  totalPrincipal: number; // 순수 원금 누적 (만원)
  accumulatedLeakage: number; // 누적 지출 누수 (만원)
  isCrashYear: boolean;
  hadIncomeShock: boolean;
  hadCarPurchase: boolean;
  hadHomePurchase: boolean;
  events: string[];
  drawdownRate: number;
  stressNetProfit: number;
  stressProfitRate: number;
}

export type MentalRiskLevel = 'SAFE' | 'CAUTION' | 'PANIC' | 'MELTDOWN';

export interface SimulationResult {
  timeline: YearSimulationPoint[];
  finalIdeal: number;
  finalNormal: number;
  finalStress: number;
  finalLiquidBalance: number; // 최종 유동성 현금 잔고
  totalInvestedPrincipal: number;
  totalLeakageAmount: number;
  totalMonthlyLeak: number;
  topCulpritName?: string;
  topCulpritMonthly?: number;

  carImpactSummary?: {
    totalPaidForCar: number; // 차에 들어간 총비용 (할부+유지비+선수금)
    finalCarValue: number; // 감가상각 후 차의 남은 잔존가치
    depreciationLoss: number; // 증발한 감가상각 손실
  };

  homeImpactSummary?: {
    monthlyMortgage: number; // 매달 나가는 주담대 원리금
    totalInterestPaid: number; // 은행에 낸 총 대출 이자
    finalHomeValue: number; // 최종 집값 평가액
  };
  
  maxDrawdownRate: number;
  maxDrawdownAmount: number;
  worstYear: number;
  
  mentalRisk: {
    score: number;
    level: MentalRiskLevel;
    title: string;
    description: string;
    prescription: string;
  };
}
