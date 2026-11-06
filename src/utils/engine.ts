import type {
  SimulatorInputs,
  SimulationResult,
  YearSimulationPoint,
  MentalRiskLevel,
  ExpenseLeakItem,
} from '../types/simulator';

export function calculateItemMonthlyLeak(item: ExpenseLeakItem): number {
  if (!item.isActive) return 0;
  const netRatio = Math.max(0, 1 - item.defenseRate / 100);
  if (item.period === 'monthly') {
    return item.frequency * item.costPerUnit * netRatio;
  }
  return (item.frequency * item.costPerUnit * netRatio) / 12;
}

// 원리금 균등분할 상환 월 납입금 계산 (PMT 공식)
function calculateMonthlyPayment(principal: number, annualRate: number, totalMonths: number): number {
  if (principal <= 0 || totalMonths <= 0) return 0;
  if (annualRate <= 0) return principal / totalMonths;
  const r = annualRate / 100 / 12;
  return (principal * r * Math.pow(1 + r, totalMonths)) / (Math.pow(1 + r, totalMonths) - 1);
}

export function runStressSimulation(inputs: SimulatorInputs): SimulationResult {
  const {
    initialSeed,
    monthlySavings,
    targetYears,
    expectedAnnualReturn,
    annualSavingsGrowthRate,
    expenseLeaks,
    enableIncomeShock,
    incomeShockYear,
    incomeShockDurationMonths,
    monthlySurvivalExpense,
    carPurchase,
    homePurchase,
    marketCrashMode,
  } = inputs;

  const monthlyReturnRate = Math.pow(1 + expectedAnnualReturn / 100, 1 / 12) - 1;
  
  // 동적 누수 지출 목록 합산 (만원)
  let totalMonthlyLeak = 0;
  let topCulpritName = '';
  let topCulpritMonthly = 0;

  expenseLeaks.forEach((item) => {
    const leak = calculateItemMonthlyLeak(item);
    totalMonthlyLeak += leak;
    if (leak > topCulpritMonthly) {
      topCulpritMonthly = leak;
      topCulpritName = item.name;
    }
  });

  // 🚗 차량 할부 계산
  const carLoanPrincipal = Math.max(0, carPurchase.carPrice - carPurchase.downPayment);
  const monthlyCarLoan = carPurchase.enabled
    ? calculateMonthlyPayment(carLoanPrincipal, carPurchase.loanRate, carPurchase.loanMonths)
    : 0;

  // 🏠 주담대 할부 계산
  const homeLoanPrincipal = Math.max(0, homePurchase.homePrice - homePurchase.downPayment);
  const monthlyHomeMortgage = homePurchase.enabled
    ? calculateMonthlyPayment(homeLoanPrincipal, homePurchase.mortgageRate, homePurchase.mortgageYears * 12)
    : 0;

  const timeline: YearSimulationPoint[] = [];

  let idealBal = initialSeed;
  let normalBal = initialSeed;
  let stressBal = initialSeed;
  let liquidCash = initialSeed; // 실제 현금/주식 유동성 잔고
  let cumulativeInvested = initialSeed;
  let cumulativeLeak = 0;

  let carCurrentValue = 0;
  let homeCurrentValue = 0;

  let totalPaidForCar = 0;
  let totalInterestPaidHome = 0;

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

    // 2. 🚗 자동차 구매 이벤트
    const isCarBuyYear = carPurchase.enabled && year === Math.min(carPurchase.purchaseYear, targetYears);
    if (isCarBuyYear) {
      events.push(`🚗 차량 구매 (선수금 ${carPurchase.downPayment}만)`);
      stressBal = Math.max(0, stressBal - carPurchase.downPayment);
      liquidCash = Math.max(0, liquidCash - carPurchase.downPayment);
      carCurrentValue = carPurchase.carPrice;
      totalPaidForCar += carPurchase.downPayment;
    }

    // 3. 🏠 내 집 마련 이벤트
    const isHomeBuyYear = homePurchase.enabled && year === Math.min(homePurchase.purchaseYear, targetYears);
    if (isHomeBuyYear) {
      events.push(`🏠 내 집 마련 (선수금 ${homePurchase.downPayment}만)`);
      stressBal = Math.max(0, stressBal - homePurchase.downPayment);
      liquidCash = Math.max(0, liquidCash - homePurchase.downPayment);
      homeCurrentValue = homePurchase.homePrice;
    }

    // 4. 수입 중단 쇼크 여부
    const isShockYear = enableIncomeShock && year === Math.min(incomeShockYear, targetYears);
    const shockMonths = isShockYear ? Math.min(12, Math.max(1, incomeShockDurationMonths)) : 0;

    if (isShockYear) {
      events.push(`⚠️ ${shockMonths}개월 수입 중단(실직) 쇼크`);
    }

    // 5. 시장 폭락 시나리오 정의
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

    // 6. 12개월 시뮬레이션
    for (let m = 0; m < 12; m++) {
      // 이상적 모델: 차도 집도 누수도 없이 순수하게 복리로만 모음
      idealBal = (idealBal + thisYearBaseSavings) * (1 + monthlyReturnRate);

      // 정상 모델: 현실 누수 지출만 제외
      const effectiveMonthlyNormal = Math.max(0, thisYearBaseSavings - totalMonthlyLeak);
      normalBal = (normalBal + effectiveMonthlyNormal) * (1 + monthlyReturnRate);

      // 스트레스 모델:
      // (1) 차량 월 고정 지출 계산
      let thisMonthCarCost = 0;
      if (carPurchase.enabled && year >= carPurchase.purchaseYear) {
        const monthsSinceCarBuy = (year - carPurchase.purchaseYear) * 12 + m;
        const isUnderCarLoan = monthsSinceCarBuy < carPurchase.loanMonths;
        thisMonthCarCost = (isUnderCarLoan ? monthlyCarLoan : 0) + carPurchase.monthlyMaintenance;
        totalPaidForCar += thisMonthCarCost;
      }

      // (2) 주담대 월 상환액
      let thisMonthHomeCost = 0;
      if (homePurchase.enabled && year >= homePurchase.purchaseYear) {
        thisMonthHomeCost = monthlyHomeMortgage;
        // 이자 비중 추정 (원리금 중 약 40~50%가 이자)
        totalInterestPaidHome += monthlyHomeMortgage * 0.45;
      }

      // 대형 고정 지출 합계
      const heavyObligations = thisMonthCarCost + thisMonthHomeCost;

      const isShockMonth = isShockYear && m < shockMonths;
      if (isShockMonth) {
        // 수입 0원 + 생활비 + 차량/대출 원리금까지 통장에서 강제 매도 출혈!
        const totalEmergencyDrain = monthlySurvivalExpense + heavyObligations;
        liquidCash = Math.max(0, liquidCash - totalEmergencyDrain) * (1 + monthlyReturnRate);
        stressBal = Math.max(0, stressBal - totalEmergencyDrain) * (1 + monthlyReturnRate);
      } else {
        // 정상 수입월: 저축액에서 (누수 지출 + 차량/대출 지출)을 빼고 남은 순저축
        const netCashflow = thisYearBaseSavings - totalMonthlyLeak - heavyObligations;
        if (netCashflow >= 0) {
          liquidCash = (liquidCash + netCashflow) * (1 + monthlyReturnRate);
          stressBal = (stressBal + netCashflow) * (1 + monthlyReturnRate);
        } else {
          // 저축액보다 차/집 대출+누수가 더 크면 자산에서 역인출 발생!
          const deficit = Math.abs(netCashflow);
          liquidCash = Math.max(0, liquidCash - deficit) * (1 + monthlyReturnRate);
          stressBal = Math.max(0, stressBal - deficit) * (1 + monthlyReturnRate);
        }
        cumulativeInvested += thisYearBaseSavings;
      }

      cumulativeLeak += totalMonthlyLeak;
    }

    // 연말 폭락 이벤트 적용 (주식/유동성 자산 급락)
    if (isCrashYear) {
      stressBal = stressBal * crashMultiplier;
      liquidCash = liquidCash * crashMultiplier;
    }

    // 차량 감가상각 적용 (매년 가치 하락)
    if (carPurchase.enabled && year >= carPurchase.purchaseYear) {
      carCurrentValue = carCurrentValue * (1 - carPurchase.annualDepreciationRate / 100);
    }

    // 부동산 가치 변동 적용 (매년 시세 변동)
    if (homePurchase.enabled && year >= homePurchase.purchaseYear) {
      const houseAppreciationMultiplier = isCrashYear ? 0.92 : (1 + homePurchase.annualAppreciationRate / 100);
      homeCurrentValue = homeCurrentValue * houseAppreciationMultiplier;
    }

    // 총 순자산 합산 (유동 자산 + 부동산 자산 + 차량 잔존가치)
    const totalNetAsset = Math.round(stressBal + (homePurchase.enabled ? homeCurrentValue * 0.4 : 0) + carCurrentValue * 0.5);

    // MDD(최대 낙폭) 추적
    if (totalNetAsset > peakStressBal) {
      peakStressBal = totalNetAsset;
    }
    const currentDrawdownAmount = Math.max(0, peakStressBal - totalNetAsset);
    const currentDrawdownRate = peakStressBal > 0 ? (currentDrawdownAmount / peakStressBal) * 100 : 0;

    if (currentDrawdownRate > maxDrawdownRate) {
      maxDrawdownRate = currentDrawdownRate;
      maxDrawdownAmount = currentDrawdownAmount;
      worstYear = year;
    }

    const stressNetProfit = Math.round(totalNetAsset - cumulativeInvested);
    const stressProfitRate = cumulativeInvested > 0 ? (stressNetProfit / cumulativeInvested) * 100 : 0;

    timeline.push({
      year,
      label: `${year}년차`,
      idealBalance: Math.round(idealBal),
      normalBalance: Math.round(normalBal),
      stressBalance: Math.round(totalNetAsset),
      liquidBalance: Math.round(liquidCash),
      totalPrincipal: Math.round(cumulativeInvested),
      accumulatedLeakage: Math.round(cumulativeLeak),
      isCrashYear,
      hadIncomeShock: isShockYear,
      hadCarPurchase: isCarBuyYear,
      hadHomePurchase: isHomeBuyYear,
      events,
      drawdownRate: Math.round(currentDrawdownRate * 10) / 10,
      stressNetProfit,
      stressProfitRate: Math.round(stressProfitRate * 10) / 10,
    });
  }

  // 멘탈 위험도 스코어 계산 (0 ~ 100점)
  const mddScore = Math.min(40, (maxDrawdownRate / 50) * 40);
  const leakRatio = monthlySavings > 0 ? (totalMonthlyLeak / monthlySavings) : 0;
  const leakScore = Math.min(20, leakRatio * 20);
  
  // 자동차 & 주담대 대형 지출 부담도 가산
  let heavyExpensePenalty = 0;
  if (carPurchase.enabled) heavyExpensePenalty += 15;
  if (homePurchase.enabled) heavyExpensePenalty += 15;

  const shockPenalty = enableIncomeShock ? Math.min(15, incomeShockDurationMonths * 2) : 0;

  const totalMentalScore = Math.min(100, Math.round(mddScore + leakScore + heavyExpensePenalty + shockPenalty));

  let level: MentalRiskLevel = 'SAFE';
  let title = '강철 멘탈 요새형';
  let description = '대형 대출이나 무리한 지출 없이 탄탄한 안전마진을 확보하고 있습니다.';
  let prescription = '현재 페이스를 유지하되, 하락장에서 저가 매수할 수 있는 현금 비중 10%만 상시 유지하세요.';

  if (totalMentalScore >= 75) {
    level = 'MELTDOWN';
    title = '영끌·카푸어 파산 경보 (마지노선 붕괴)';
    description = `차량 유지비와 주담대 원리금 압박 속에 실직과 하락장이 겹치며 최고점 대비 -${Math.round(maxDrawdownRate)}%가 증발하고, 비상금 부족으로 강제 경매나 헐값 매도에 내몰릴 확률이 95% 이상입니다.`;
    prescription = `차량 등급을 낮추거나 주담대 상환 부담을 월 소득의 35% 이내로 줄이지 않으면 단 3~4개월의 수입 중단에도 계좌가 완전히 침몰합니다.`;
  } else if (totalMentalScore >= 50) {
    level = 'PANIC';
    title = '현금흐름 질식 경계형';
    description = `대출 원리금과 차량 할부금이 매달 저축 여력을 압박하여, ${worstYear}년차 위기 구간에서 극심한 유동성 스트레스를 겪게 됩니다.`;
    prescription = `월 고정 할부금을 줄이고, 최소 1년치 대출 원리금을 방어할 수 있는 비상 현금 파이프라인을 구축하세요.`;
  } else if (totalMentalScore >= 25) {
    level = 'CAUTION';
    title = '가벼운 심장 쫄깃형';
    description = '일시적인 조정장이나 지출 급증 시 불안감이 생기지만, 기본 체력으로 버텨낼 수 있습니다.';
    prescription = '불필요한 구독료와 누수 지출을 통제하고 비상금을 안전하게 분리해두세요.';
  }

  const finalTimelinePoint = timeline[timeline.length - 1];

  return {
    timeline,
    finalIdeal: Math.round(idealBal),
    finalNormal: Math.round(normalBal),
    finalStress: finalTimelinePoint ? finalTimelinePoint.stressBalance : Math.round(stressBal),
    finalLiquidBalance: finalTimelinePoint ? finalTimelinePoint.liquidBalance : Math.round(liquidCash),
    totalInvestedPrincipal: Math.round(cumulativeInvested),
    totalLeakageAmount: Math.round(cumulativeLeak),
    totalMonthlyLeak: Math.round(totalMonthlyLeak * 10) / 10,
    topCulpritName,
    topCulpritMonthly: Math.round(topCulpritMonthly * 10) / 10,
    carImpactSummary: carPurchase.enabled
      ? {
          totalPaidForCar: Math.round(totalPaidForCar),
          finalCarValue: Math.round(carCurrentValue),
          depreciationLoss: Math.round(totalPaidForCar - carCurrentValue),
        }
      : undefined,
    homeImpactSummary: homePurchase.enabled
      ? {
          monthlyMortgage: Math.round(monthlyHomeMortgage),
          totalInterestPaid: Math.round(totalInterestPaidHome),
          finalHomeValue: Math.round(homeCurrentValue),
        }
      : undefined,
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
