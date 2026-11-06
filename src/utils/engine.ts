import type { SimulatorInputs, SimulationResult, YearSimulationPoint, MentalRiskLevel } from '../types/simulator';

export function runStressSimulation(inputs: SimulatorInputs): SimulationResult {
  const {
    initialSeed,
    monthlySavings,
    targetYears,
    expectedAnnualReturn,
    deliveryFrequency,
    deliveryCostPerTime,
    deliveryDefenseRate,
    annualEmergencyEvents,
    emergencyCostPerEvent,
    marketCrashMode,
  } = inputs;

  const monthlyReturnRate = Math.pow(1 + expectedAnnualReturn / 100, 1 / 12) - 1;
  
  // 월간 지출 누수 계산 (만원)
  const monthlyDeliveryLeak = deliveryFrequency * (1 - deliveryDefenseRate / 100) * deliveryCostPerTime;
  const monthlyEmergencyLeak = (annualEmergencyEvents * emergencyCostPerEvent) / 12;
  const totalMonthlyLeak = monthlyDeliveryLeak + monthlyEmergencyLeak;

  const effectiveMonthlyNormal = Math.max(0, monthlySavings - totalMonthlyLeak);

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

  // 연도별 시뮬레이션
  for (let year = 1; year <= targetYears; year++) {
    let isCrashYear = false;
    let crashMultiplier = 1;

    // 스트레스 시나리오 정의
    if (marketCrashMode === 'moderate') {
      // 4년 차에 -28% 조정장
      if (year === Math.min(4, Math.floor(targetYears / 2) || 1)) {
        isCrashYear = true;
        crashMultiplier = 0.72; // -28%
      }
    } else if (marketCrashMode === 'blackswan') {
      // 3년 차에 -35% 급락, 7년 차에 -45% 대공황
      const firstCrash = Math.min(3, Math.max(1, Math.floor(targetYears * 0.3)));
      const secondCrash = Math.min(7, Math.max(2, Math.floor(targetYears * 0.7)));
      if (year === firstCrash) {
        isCrashYear = true;
        crashMultiplier = 0.65; // -35%
      } else if (year === secondCrash && secondCrash !== firstCrash) {
        isCrashYear = true;
        crashMultiplier = 0.55; // -45%
      }
    }

    // 12개월 월복리 적립 시뮬레이션
    for (let m = 0; m < 12; m++) {
      // 1. 이상적 복리 (누수 전혀 없음)
      idealBal = (idealBal + monthlySavings) * (1 + monthlyReturnRate);

      // 2. 정상 현실 복리 (현실 지출 누수 제외 후 적립)
      normalBal = (normalBal + effectiveMonthlyNormal) * (1 + monthlyReturnRate);

      // 3. 스트레스 복리 (현실 지출 누수 + 시장 폭락 충격)
      stressBal = (stressBal + effectiveMonthlyNormal) * (1 + monthlyReturnRate);

      cumulativeInvested += monthlySavings;
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

    timeline.push({
      year,
      label: `${year}년차`,
      idealBalance: Math.round(idealBal),
      normalBalance: Math.round(normalBal),
      stressBalance: Math.round(stressBal),
      totalPrincipal: Math.round(cumulativeInvested),
      accumulatedLeakage: Math.round(cumulativeLeak),
      isCrashYear,
      drawdownRate: Math.round(currentDrawdownRate * 10) / 10,
    });
  }

  // 멘탈 위험도 스코어 계산 (0 ~ 100점)
  // 요인 1: 최대 낙폭 (MDD) 영향 (0~50점)
  const mddScore = Math.min(50, (maxDrawdownRate / 50) * 50);
  
  // 요인 2: 저축 대비 누수 지출 비율 (0~30점)
  const leakRatio = monthlySavings > 0 ? (totalMonthlyLeak / monthlySavings) : 0;
  const leakScore = Math.min(30, leakRatio * 30);
  
  // 요인 3: 원금 대비 최저점 손실 여부 (0~20점)
  const minFinalRatio = cumulativeInvested > 0 ? (stressBal / cumulativeInvested) : 1;
  const principalLossScore = minFinalRatio < 1 ? Math.min(20, (1 - minFinalRatio) * 40) : 0;

  const totalMentalScore = Math.min(100, Math.round(mddScore + leakScore + principalLossScore));

  let level: MentalRiskLevel = 'SAFE';
  let title = '강철 멘탈 요새형';
  let description = '충격이 와도 흔들리지 않는 안정적인 현금흐름과 자산 방어선을 갖추고 있습니다.';
  let prescription = '현재 페이스를 유지하되, 하락장에서 저가 매수할 수 있는 현금 비중 10%만 상시 유지하세요.';

  if (totalMentalScore >= 75) {
    level = 'MELTDOWN';
    title = '멘탈 마지노선 붕괴 위험 (Panic Sell 경보)';
    description = `하락장 발생 시 최고점 대비 무려 -${Math.round(maxDrawdownRate)}%(-${Math.round(maxDrawdownAmount).toLocaleString()}만원)가 증발하여 심리적 공황으로 바닥에서 손절할 확률이 매우 높습니다.`;
    prescription = `월 누수 지출(-${Math.round(totalMonthlyLeak)}만원)을 줄여 6개월치 안전 비상금(파킹통장)을 분리해 두지 않으면 투자 여정을 완주하기 어렵습니다.`;
  } else if (totalMentalScore >= 50) {
    level = 'PANIC';
    title = '수면 장애 및 패닉 경계형';
    description = `자산이 크게 꺾이는 ${worstYear}년차 구간에서 계좌를 열어볼 때마다 극심한 스트레스와 일상 집중력 저하가 발생할 수 있습니다.`;
    prescription = `배달/외식 방어율을 20%만 올려도 스트레스 지수를 크게 낮출 수 있습니다. 변동성이 낮은 배당/채권 자산 배분을 고려하세요.`;
  } else if (totalMentalScore >= 25) {
    level = 'CAUTION';
    title = '가벼운 심장 쫄깃형';
    description = '일시적인 조정장이 올 때마다 증권 앱을 하루에도 서너 번씩 켜보는 불안감이 발생할 수 있습니다.';
    prescription = '불필요한 잔고 확인 빈도를 줄이고, 연간 돌발 지출을 위한 예비비를 별도 계좌로 격리해두세요.';
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
