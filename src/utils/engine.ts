import type { SimulatorInputs, SimulationResult, YearSimulationPoint, MentalRiskLevel } from '../types/simulator';

export function runStressSimulation(inputs: SimulatorInputs): SimulationResult {
  const {
    initialSeed,
    monthlySavings,
    targetYears,
    expectedAnnualReturn,
    annualSavingsGrowthRate,
    deliveryFrequency,
    deliveryCostPerTime,
    deliveryDefenseRate,
    annualEmergencyEvents,
    emergencyCostPerEvent,
    enableIncomeShock,
    incomeShockYear,
    incomeShockDurationMonths,
    monthlySurvivalExpense,
    marketCrashMode,
  } = inputs;

  const monthlyReturnRate = Math.pow(1 + expectedAnnualReturn / 100, 1 / 12) - 1;
  
  // 월간 지출 누수 계산 (만원)
  const monthlyDeliveryLeak = deliveryFrequency * (1 - deliveryDefenseRate / 100) * deliveryCostPerTime;
  const monthlyEmergencyLeak = (annualEmergencyEvents * emergencyCostPerEvent) / 12;
  const totalMonthlyLeak = monthlyDeliveryLeak + monthlyEmergencyLeak;

  const timeline: YearSimulationPoint[] = [];

  let idealBal = initialSeed;
  let normalBal = initialSeed;
  let stressBal = initialSeed;
  let cumulativeInvested = initialSeed;
  let cumulativeLeak = 0;

  let peakStressBal = initialSeed;
  let maxDrawdownRate = 0;
  let maxDrawdownAmount = 0;
  let worstYear = 1;

  for (let year = 1; year <= targetYears; year++) {
    const events: string[] = [];
    let isCrashYear = false;
    let crashMultiplier = 1;

    // 1. 연차별 월 저축액 (연봉 인상률 반영)
    const yearGrowthFactor = Math.pow(1 + annualSavingsGrowthRate / 100, year - 1);
    const thisYearBaseSavings = Math.round(monthlySavings * yearGrowthFactor);

    // 2. 수입 중단 쇼크 여부
    const isShockYear = enableIncomeShock && year === Math.min(incomeShockYear, targetYears);
    const shockMonths = isShockYear ? Math.min(12, Math.max(1, incomeShockDurationMonths)) : 0;

    if (isShockYear) {
      events.push(`⚠️ ${shockMonths}개월 수입 중단(실직) 쇼크`);
    }

    // 3. 시장 폭락 시나리오 정의
    if (marketCrashMode === 'moderate') {
      const dropYear = Math.min(4, Math.floor(targetYears / 2) || 1);
      if (year === dropYear) {
        isCrashYear = true;
        crashMultiplier = 0.72; // -28%
        events.push('📉 -28% 시장 급락');
      }
    } else if (marketCrashMode === 'blackswan') {
      const firstCrash = Math.min(3, Math.max(1, Math.floor(targetYears * 0.3)));
      const secondCrash = Math.min(7, Math.max(2, Math.floor(targetYears * 0.7)));
      if (year === firstCrash) {
        isCrashYear = true;
        crashMultiplier = 0.65; // -35%
        events.push('⚡ -35% 블랙스완 1차 폭락');
      } else if (year === secondCrash && secondCrash !== firstCrash) {
        isCrashYear = true;
        crashMultiplier = 0.55; // -45%
        events.push('💥 -45% 대공황 2차 폭락');
      }
    }

    // 4. 12개월 시뮬레이션
    for (let m = 0; m < 12; m++) {
      // 이상적 모델: 수입 중단도 누수도 없이 꾸준히 저축
      idealBal = (idealBal + thisYearBaseSavings) * (1 + monthlyReturnRate);

      // 정상 모델: 누수 반영, 실직 없이 꾸준히 적립
      const effectiveMonthlyNormal = Math.max(0, thisYearBaseSavings - totalMonthlyLeak);
      normalBal = (normalBal + effectiveMonthlyNormal) * (1 + monthlyReturnRate);

      // 스트레스 모델: 실직 월에는 저축 0원 + 생활비 역인출(강제 헐값 매도!)
      const isShockMonth = isShockYear && m < shockMonths;
      if (isShockMonth) {
        // 수입이 끊겨 필수 생활비를 주식/투자금에서 강제 매도 인출
        stressBal = Math.max(0, stressBal - monthlySurvivalExpense) * (1 + monthlyReturnRate);
      } else {
        stressBal = (stressBal + effectiveMonthlyNormal) * (1 + monthlyReturnRate);
        cumulativeInvested += thisYearBaseSavings;
      }

      cumulativeLeak += totalMonthlyLeak;
    }

    // 연말 폭락 이벤트 적용
    if (isCrashYear) {
      stressBal = stressBal * crashMultiplier;
    }

    // MDD(최대 낙폭) 추적
    if (stressBal > peakStressBal) {
      peakStressBal = stressBal;
    }
    const currentDrawdownAmount = Math.max(0, peakStressBal - stressBal);
    const currentDrawdownRate = peakStressBal > 0 ? (currentDrawdownAmount / peakStressBal) * 100 : 0;

    if (currentDrawdownRate > maxDrawdownRate) {
      maxDrawdownRate = currentDrawdownRate;
      maxDrawdownAmount = currentDrawdownAmount;
      worstYear = year;
    }

    const stressNetProfit = Math.round(stressBal - cumulativeInvested);
    const stressProfitRate = cumulativeInvested > 0 ? (stressNetProfit / cumulativeInvested) * 100 : 0;

    timeline.push({
      year,
      label: `${year}년차`,
      idealBalance: Math.round(idealBal),
      normalBalance: Math.round(normalBal),
      stressBalance: Math.round(stressBal),
      totalPrincipal: Math.round(cumulativeInvested),
      accumulatedLeakage: Math.round(cumulativeLeak),
      isCrashYear,
      hadIncomeShock: isShockYear,
      events,
      drawdownRate: Math.round(currentDrawdownRate * 10) / 10,
      stressNetProfit,
      stressProfitRate: Math.round(stressProfitRate * 10) / 10,
    });
  }

  // 멘탈 위험도 스코어 계산 (0 ~ 100점)
  const mddScore = Math.min(45, (maxDrawdownRate / 50) * 45);
  const leakRatio = monthlySavings > 0 ? (totalMonthlyLeak / monthlySavings) : 0;
  const leakScore = Math.min(25, leakRatio * 25);
  const minFinalRatio = cumulativeInvested > 0 ? (stressBal / cumulativeInvested) : 1;
  const principalLossScore = minFinalRatio < 1 ? Math.min(20, (1 - minFinalRatio) * 40) : 0;
  const shockPenalty = enableIncomeShock ? Math.min(15, incomeShockDurationMonths * 2) : 0;

  const totalMentalScore = Math.min(100, Math.round(mddScore + leakScore + principalLossScore + shockPenalty));

  let level: MentalRiskLevel = 'SAFE';
  let title = '강철 멘탈 요새형';
  let description = '충격이 와도 흔들리지 않는 안정적인 현금흐름과 자산 방어선을 갖추고 있습니다.';
  let prescription = '현재 페이스를 유지하되, 하락장에서 저가 매수할 수 있는 현금 비중 10%만 상시 유지하세요.';

  if (totalMentalScore >= 75) {
    level = 'MELTDOWN';
    title = '멘탈 마지노선 붕괴 위험 (Panic Sell 경보)';
    description = `하락장과 수입 중단이 겹치는 구간에서 최고점 대비 -${Math.round(maxDrawdownRate)}%(-${Math.round(maxDrawdownAmount).toLocaleString()}만원)가 증발하고 생활비 때문에 주식을 바닥에서 강제 매도할 확률이 95% 이상입니다.`;
    prescription = `반드시 ${incomeShockDurationMonths || 6}개월 이상의 필수 생활비(${((incomeShockDurationMonths || 6) * monthlySurvivalExpense).toLocaleString()}만원)를 파킹통장(CMA)에 현금으로 격리해두어야 합니다.`;
  } else if (totalMentalScore >= 50) {
    level = 'PANIC';
    title = '수면 장애 및 패닉 경계형';
    description = `자산이 크게 꺾이는 ${worstYear}년차 구간에서 계좌를 열어볼 때마다 극심한 스트레스와 현금 유동성 압박이 발생합니다.`;
    prescription = `배달/외식 방어율을 높이고, 무소득 구간을 버틸 수 있는 부업이나 비상 파이프라인을 점검하세요.`;
  } else if (totalMentalScore >= 25) {
    level = 'CAUTION';
    title = '가벼운 심장 쫄깃형';
    description = '일시적인 조정장이나 지출 급증 시 불안감이 생기지만, 기본 체력으로 버틸 수 있는 수준입니다.';
    prescription = '불필요한 잔고 확인 빈도를 줄이고, 연간 돌발 지출을 위한 예비비를 별도 관리하세요.';
  }

  return {
    timeline,
    finalIdeal: Math.round(idealBal),
    finalNormal: Math.round(normalBal),
    finalStress: Math.round(stressBal),
    totalInvestedPrincipal: Math.round(cumulativeInvested),
    totalLeakageAmount: Math.round(cumulativeLeak),
    maxDrawdownRate: Math.round(maxDrawdownRate * 10) / 10,
    maxDrawdownAmount: Math.round(maxDrawdownAmount),
    worstYear,
    mentalRisk: {
      score: totalMentalScore,
      level,
      title,
      description,
      prescription,
    },
  };
}
