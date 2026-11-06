import type {
  SimulatorInputs,
  SimulationResult,
  YearSimulationPoint,
  MentalRiskLevel,
  ExpenseLeakItem,
  EssentialExpenseItem,
} from '../types/simulator';

export function calculateItemMonthlyLeak(item: ExpenseLeakItem): number {
  if (!item.isActive) return 0;
  const netRatio = Math.max(0, 1 - item.defenseRate / 100);
  if (item.period === 'monthly') {
    return item.frequency * item.costPerUnit * netRatio;
  }
  return (item.frequency * item.costPerUnit * netRatio) / 12;
}

export function calculateTotalEssentialMonthly(items: EssentialExpenseItem[]): number {
  return items.reduce((acc, item) => (item.isActive ? acc + item.monthlyCost : acc), 0);
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
    monthlyNetIncome,
    essentialExpenses,
    targetYears,
    expectedAnnualReturn,
    annualSavingsGrowthRate,
    expenseLeaks,
    incomeShocks,
    carPurchase,
    homePurchase,
    marketCrashMode,
    inflationRate,
  } = inputs;

  const monthlyReturnRate = Math.pow(1 + expectedAnnualReturn / 100, 1 / 12) - 1;

  // 1. 숨만 쉬어도 나가는 기초 생존 생활비 합산 (월세, 마트 장보기, 공과금, 생필품 등)
  const totalMonthlyEssential = calculateTotalEssentialMonthly(essentialExpenses);

  // 1년차 기준 기초 생활비 제외 후 남는 최대 저축 여력
  const baseMonthlySavingsCapacity = Math.max(0, monthlyNetIncome - totalMonthlyEssential);

  // 2. 동적 누수 지출 목록 합산 (배달, OTT, 커피, 택시 등)
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

  // 1년차 실제 매월 계좌에 적립되는 금액 (음수면 적자)
  const actualMonthlyInvested = monthlyNetIncome - totalMonthlyEssential - totalMonthlyLeak;

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
  let liquidCash = initialSeed;
  let cumulativeInvested = initialSeed;
  let cumulativeLeak = 0;
  let cumulativeEssential = 0;

  let carCurrentValue = 0;
  let homeCurrentValue = 0;

  let totalPaidForCar = 0;
  let totalInterestPaidHome = 0;

  let peakStressBal = initialSeed;
  let maxDrawdownRate = 0;
  let maxDrawdownAmount = 0;
  let worstYear = 1;

  let totalAllShockMonths = 0;

  for (let year = 1; year <= targetYears; year++) {
    const events: string[] = [];
    let isCrashYear = false;
    let crashMultiplier = 1;

    // 1. 연차별 세후 월급 (연봉 인상률 반영) & 기초 생활비 (장바구니 물가상승률 절반 수준 반영)
    const incomeGrowthFactor = Math.pow(1 + annualSavingsGrowthRate / 100, year - 1);
    const livingCostInflationFactor = Math.pow(1 + (inflationRate * 0.6) / 100, year - 1);

    const thisYearMonthlyIncome = Math.round(monthlyNetIncome * incomeGrowthFactor);
    const thisYearMonthlyEssential = Math.round(totalMonthlyEssential * livingCostInflationFactor);

    // 기초 생활비를 빼고 남은 당해 연도 월간 저축 가능 여력 (적자 가능)
    const thisYearDisposable = thisYearMonthlyIncome - thisYearMonthlyEssential;
    const thisYearBaseSavings = Math.max(0, thisYearDisposable);

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

    // 4. ⚠️ 다중 수입 중단(실직/이직 공백) 쇼크 검사
    const activeShocksThisYear = incomeShocks.filter((s) => s.isActive && s.year === year);
    let totalShockMonthsThisYear = 0;
    let shockMonthlyDrain = thisYearMonthlyEssential;

    if (activeShocksThisYear.length > 0) {
      totalShockMonthsThisYear = Math.min(
        12,
        activeShocksThisYear.reduce((sum, s) => sum + s.durationMonths, 0)
      );
      totalAllShockMonths += totalShockMonthsThisYear;
      const configuredMaxShockExpense = Math.max(
        ...activeShocksThisYear.map((s) => s.monthlySurvivalExpense)
      );
      // 실직 기간에는 최소한 기초 생존비(월세+마트+공과금+생필품) 또는 설정된 생존비 중 큰 금액이 통장에서 빠져나감
      shockMonthlyDrain = Math.max(thisYearMonthlyEssential, configuredMaxShockExpense);

      activeShocksThisYear.forEach((s) => {
        events.push(`⚠️ ${s.name} (${s.durationMonths}개월)`);
      });
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
      // 이상적 모델: 기초 생활비(월세·마트·공과금)만 지출하고, 사치 누수 0원, 실직 0회로 남은 돈을 100% 복리 적립
      idealBal = (idealBal + thisYearBaseSavings) * (1 + monthlyReturnRate);

      // 정상 모델: 기초 생활비 + 일상 누수(OTT·배달·커피) 제외 후 적립
      const effectiveMonthlyNormal = Math.max(0, thisYearDisposable - totalMonthlyLeak);
      normalBal = (normalBal + effectiveMonthlyNormal) * (1 + monthlyReturnRate);

      // 스트레스 모델 고정 지출 계산
      let thisMonthCarCost = 0;
      if (carPurchase.enabled && year >= carPurchase.purchaseYear) {
        const monthsSinceCarBuy = (year - carPurchase.purchaseYear) * 12 + m;
        const isUnderCarLoan = monthsSinceCarBuy < carPurchase.loanMonths;
        thisMonthCarCost = (isUnderCarLoan ? monthlyCarLoan : 0) + carPurchase.monthlyMaintenance;
        totalPaidForCar += thisMonthCarCost;
      }

      let thisMonthHomeCost = 0;
      if (homePurchase.enabled && year >= homePurchase.purchaseYear) {
        thisMonthHomeCost = monthlyHomeMortgage;
        totalInterestPaidHome += monthlyHomeMortgage * 0.45;
      }

      const heavyObligations = thisMonthCarCost + thisMonthHomeCost;

      // 실직/무소득 달인가?
      const isShockMonth = m < totalShockMonthsThisYear;
      if (isShockMonth) {
        // 수입 0원 + 기초생활비(월세·마트·공과금) + 대출/차량 고정비까지 자산에서 강제 매도 출혈!
        const totalEmergencyDrain = shockMonthlyDrain + heavyObligations;
        liquidCash = Math.max(0, liquidCash - totalEmergencyDrain) * (1 + monthlyReturnRate);
        stressBal = Math.max(0, stressBal - totalEmergencyDrain) * (1 + monthlyReturnRate);
      } else {
        const netCashflow = thisYearDisposable - totalMonthlyLeak - heavyObligations;
        if (netCashflow >= 0) {
          liquidCash = (liquidCash + netCashflow) * (1 + monthlyReturnRate);
          stressBal = (stressBal + netCashflow) * (1 + monthlyReturnRate);
        } else {
          const deficit = Math.abs(netCashflow);
          liquidCash = Math.max(0, liquidCash - deficit) * (1 + monthlyReturnRate);
          stressBal = Math.max(0, stressBal - deficit) * (1 + monthlyReturnRate);
        }
        cumulativeInvested += thisYearBaseSavings;
      }

      cumulativeLeak += totalMonthlyLeak;
      cumulativeEssential += thisYearMonthlyEssential;
    }

    // 연말 폭락 이벤트 적용
    if (isCrashYear) {
      stressBal = stressBal * crashMultiplier;
      liquidCash = liquidCash * crashMultiplier;
    }

    // 차량 감가상각
    if (carPurchase.enabled && year >= carPurchase.purchaseYear) {
      carCurrentValue = carCurrentValue * (1 - carPurchase.annualDepreciationRate / 100);
    }

    // 부동산 가치 변동
    if (homePurchase.enabled && year >= homePurchase.purchaseYear) {
      const houseAppreciationMultiplier = isCrashYear ? 0.92 : (1 + homePurchase.annualAppreciationRate / 100);
      homeCurrentValue = homeCurrentValue * houseAppreciationMultiplier;
    }

    // 총 순자산 합산
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
      accumulatedEssential: Math.round(cumulativeEssential),
      isCrashYear,
      hadIncomeShock: totalShockMonthsThisYear > 0,
      hadCarPurchase: isCarBuyYear,
      hadHomePurchase: isHomeBuyYear,
      events,
      drawdownRate: Math.round(currentDrawdownRate * 10) / 10,
      stressNetProfit,
      stressProfitRate: Math.round(stressProfitRate * 10) / 10,
    });
  }

  // 멘탈 위험도 스코어 계산
  const mddScore = Math.min(35, (maxDrawdownRate / 50) * 35);
  const essentialBurdenRatio = monthlyNetIncome > 0 ? totalMonthlyEssential / monthlyNetIncome : 1;
  const essentialPenalty = essentialBurdenRatio > 0.6 ? 15 : essentialBurdenRatio > 0.45 ? 8 : 0;
  const leakRatio = baseMonthlySavingsCapacity > 0 ? totalMonthlyLeak / baseMonthlySavingsCapacity : 1;
  const leakScore = Math.min(15, leakRatio * 15);
  
  let heavyExpensePenalty = 0;
  if (carPurchase.enabled) heavyExpensePenalty += 15;
  if (homePurchase.enabled) heavyExpensePenalty += 15;

  const totalActiveShocksCount = incomeShocks.filter((s) => s.isActive).length;
  const shockMonthsPenalty = Math.min(20, totalAllShockMonths * 2);
  const multiShockPenalty = totalActiveShocksCount >= 2 ? 10 : 0;
  const deficitPenalty = actualMonthlyInvested < 0 ? 25 : 0;

  const totalMentalScore = Math.min(
    100,
    Math.round(
      mddScore +
        essentialPenalty +
        leakScore +
        heavyExpensePenalty +
        shockMonthsPenalty +
        multiShockPenalty +
        deficitPenalty
    )
  );

  let level: MentalRiskLevel = 'SAFE';
  let title = '강철 멘탈 요새형';
  let description = '기초 생활비(월세·마트·공과금)를 제하고도 탄탄한 저축 여력과 비상 안전망을 확보하고 있습니다.';
  let prescription = '현재 페이스를 유지하되, 하락장에서 저가 매수할 수 있는 현금 비중 10%만 상시 유지하세요.';

  if (actualMonthlyInvested < 0) {
    level = 'MELTDOWN';
    title = '만성 적자 보일러 역류 경보 (저축 불가)';
    description = `세후 월급(${monthlyNetIncome}만원)에서 기초 생활비(${totalMonthlyEssential}만원)와 일상 누수(${Math.round(totalMonthlyLeak)}만원)를 빼면 매달 ${Math.abs(Math.round(actualMonthlyInvested))}만원씩 적자가 발생하여 종잣돈을 갉아먹고 있습니다.`;
    prescription = `투자를 논하기 전에 월세·고정비를 줄이거나 '${topCulpritName || '구독·배달'}' 지출을 즉시 차단해 월 현금흐름을 흑자로 돌려놓아야 합니다.`;
  } else if (totalMentalScore >= 75) {
    level = 'MELTDOWN';
    title = '연쇄 실직·고정비 복합 파산 경보';
    description = `숨만 쉬어도 나가는 기초 생활비(월 ${totalMonthlyEssential}만원)와 대출 압박 속에 실직과 하락장이 겹치며, 계좌 잔고가 바닥나 강제 투매에 내몰릴 확률이 98%입니다.`;
    prescription = `반복되는 수입 중단에 대비해 최소 6~12개월치 기초 생활비(${(totalMonthlyEssential * 6).toLocaleString()}~${(totalMonthlyEssential * 12).toLocaleString()}만원)를 별도 비상 파킹통장에 격리해야 합니다.`;
  } else if (totalMentalScore >= 50) {
    level = 'PANIC';
    title = '유동성 절벽 및 패닉 경계형';
    description = `월세·마트 장보기·공과금 등 고정 지출 비중이 높아, ${worstYear}년차 위기 구간에서 심리적 공황과 극심한 잔고 스트레스가 발생합니다.`;
    prescription = `이직 전 최소 6개월치 기초 생계비(${(totalMonthlyEssential * 6).toLocaleString()}만원)를 먼저 확보하고, '${topCulpritName || '일상 누수'}' 밸브를 조이세요.`;
  } else if (totalMentalScore >= 25) {
    level = 'CAUTION';
    title = '가벼운 심장 쫄깃형';
    description = '일시적인 소득 중단이나 시장 조정이 와도 기존 시드로 기초 생활비를 어느 정도 방어할 수 있습니다.';
    prescription = '마트 장바구니 물가 상승에 대비해 불필요한 정기 구독료를 주기적으로 정리하세요.';
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
    totalEssentialAmount: Math.round(cumulativeEssential),
    monthlyNetIncome,
    totalMonthlyEssential: Math.round(totalMonthlyEssential * 10) / 10,
    baseMonthlySavingsCapacity: Math.round(baseMonthlySavingsCapacity * 10) / 10,
    totalMonthlyLeak: Math.round(totalMonthlyLeak * 10) / 10,
    actualMonthlyInvested: Math.round(actualMonthlyInvested * 10) / 10,
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
