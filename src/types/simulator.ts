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

// ⚠️ 수입 중단(실직/이직 공백/안식년) 이벤트
export interface IncomeShockEvent {
  id: string;
  name: string; // 예: '1차 이직 공백', '구조조정/희망퇴직', '안식년/갭이어'
  year: number; // 몇 년차에 터지는가?
  durationMonths: number; // 몇 개월 동안 끊기는가? (1~12)
  monthlySurvivalExpense: number; // 무소득 기간 월 필수 생존비용 (만원)
  isActive: boolean;
}

// 🚗 자동차 구매 설정
export interface CarPurchaseConfig {
  enabled: boolean;
  purchaseYear: number;
  carPrice: number;
  downPayment: number;
  loanMonths: number;
  loanRate: number;
  monthlyMaintenance: number;
  annualDepreciationRate: number;
}

// 🏠 내 집 마련 / 주택담보대출 설정
export interface HomePurchaseConfig {
  enabled: boolean;
  purchaseYear: number;
  homePrice: number;
  downPayment: number;
  mortgageYears: number;
  mortgageRate: number;
  annualAppreciationRate: number;
}

export interface SimulatorInputs {
  initialSeed: number; // 만원
  monthlySavings: number; // 만원
  targetYears: number; // 년수
  expectedAnnualReturn: number; // %
  annualSavingsGrowthRate: number; // %

  expenseLeaks: ExpenseLeakItem[];
  
  // ⚠️ 다중 수입 중단 쇼크 목록
  incomeShocks: IncomeShockEvent[];

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
  idealBalance: number;
  normalBalance: number;
  stressBalance: number;
  liquidBalance: number;
  totalPrincipal: number;
  accumulatedLeakage: number;
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
  finalLiquidBalance: number;
  totalInvestedPrincipal: number;
  totalLeakageAmount: number;
  totalMonthlyLeak: number;
  topCulpritName?: string;
  topCulpritMonthly?: number;

  carImpactSummary?: {
    totalPaidForCar: number;
    finalCarValue: number;
    depreciationLoss: number;
  };

  homeImpactSummary?: {
    monthlyMortgage: number;
    totalInterestPaid: number;
    finalHomeValue: number;
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
