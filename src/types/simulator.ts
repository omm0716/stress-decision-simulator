export type MarketCrashMode = 'none' | 'moderate' | 'blackswan';

export type ExpenseCategory = 'subscription' | 'habit' | 'emergency' | 'custom';

export type EssentialCategory = 'rent' | 'groceries' | 'utilities' | 'necessities' | 'custom';

// 🍞 숨만 쉬어도 나가는 기초 생존 생활비 항목 (월세, 공과금, 마트 장보기, 샤워/생필품 등)
export interface EssentialExpenseItem {
  id: string;
  name: string;
  category: EssentialCategory;
  description: string;
  monthlyCost: number; // 만원
  isActive: boolean;
}

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
  name: string;
  year: number;
  durationMonths: number;
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
  initialSeed: number; // 초기 종잣돈 (만원)
  monthlyNetIncome: number; // 세후 월 실수령 급여 (만원, 예: 250만원)
  essentialExpenses: EssentialExpenseItem[]; // 기초 생존 생활비 목록 (월세, 마트, 공과금, 생필품)
  monthlySavings: number; // (호환용 또는 수동 오버라이드)
  targetYears: number; // 년수
  expectedAnnualReturn: number; // %
  annualSavingsGrowthRate: number; // 연간 급여 인상률 (%)

  expenseLeaks: ExpenseLeakItem[];
  
  // ⚠️ 다중 수입 중단 쇼크 목록
  incomeShocks: IncomeShockEvent[];

  // 🚗 대형 지름 1: 자동차 구매
  carPurchase: CarPurchaseConfig;

  // 🏠 대형 지름 2: 내 집 마련 / 주담대
  homePurchase: HomePurchaseConfig;

  // 스트레스 시나리오
  marketCrashMode: MarketCrashMode;
  inflationRate: number; // 생활물가 상승률 (기본 3%)
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
  accumulatedEssential: number; // 누적 기초 생활비 지출액 (만원)
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
  totalEssentialAmount: number; // 전체 기간 총 기초 생활비 지출 합계

  // 월간 현금흐름 파이프라인 (1년차 기준)
  monthlyNetIncome: number; // 세후 월급
  totalMonthlyEssential: number; // 월 기초 생존 생활비 합계 (월세+마트+공과금+생필품)
  baseMonthlySavingsCapacity: number; // 기초 생활비 제하고 남는 저축 여력
  totalMonthlyLeak: number; // 월 라이프스타일 누수 합계 (배달+OTT+커피 등)
  actualMonthlyInvested: number; // 실제 매월 계좌에 꽂히는 순수 투자금

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
