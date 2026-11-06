import React from 'react';
import { Car, Home, AlertOctagon, HelpCircle, Sparkles } from 'lucide-react';
import type { CarPurchaseConfig, HomePurchaseConfig } from '../types/simulator';
import { Term } from './Term';

interface HeavyPurchasePanelProps {
  car: CarPurchaseConfig;
  home: HomePurchaseConfig;
  targetYears: number;
  onCarChange: (car: CarPurchaseConfig) => void;
  onHomeChange: (home: HomePurchaseConfig) => void;
}

export const HeavyPurchasePanel: React.FC<HeavyPurchasePanelProps> = ({
  car,
  home,
  targetYears,
  onCarChange,
  onHomeChange,
}) => {
  // 차량 월 할부금 대략 계산 (미리보기용)
  const carLoan = Math.max(0, car.carPrice - car.downPayment);
  const rCar = car.loanRate / 100 / 12;
  const monthlyCarLoan = car.loanMonths > 0 && rCar > 0
    ? (carLoan * rCar * Math.pow(1 + rCar, car.loanMonths)) / (Math.pow(1 + rCar, car.loanMonths) - 1)
    : 0;
  const totalMonthlyCarDrain = Math.round(monthlyCarLoan + car.monthlyMaintenance);

  // 주담대 월 원리금 계산 (미리보기용)
  const homeLoan = Math.max(0, home.homePrice - home.downPayment);
  const rHome = home.mortgageRate / 100 / 12;
  const nHomeMonths = home.mortgageYears * 12;
  const monthlyMortgage = nHomeMonths > 0 && rHome > 0
    ? (homeLoan * rHome * Math.pow(1 + rHome, nHomeMonths)) / (Math.pow(1 + rHome, nHomeMonths) - 1)
    : 0;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-rose-400" />
            <h2 className="text-base font-semibold text-slate-100 m-0">
              4. 극단적 대형 지름 스트레스
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            청년·직장인 복리 투자를 파괴하는 2대 주범: <b>카푸어 & 하우스푸어</b>
          </p>
        </div>
      </div>

      {/* 🚗 1. 자동차 구매 스트레스 */}
      <div className={`p-4 rounded-xl border transition-all ${
        car.enabled ? 'bg-amber-950/20 border-amber-500/40' : 'bg-slate-950/50 border-slate-800'
      }`}>
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800/60">
          <div className="flex items-center gap-2">
            <Car className={`w-5 h-5 ${car.enabled ? 'text-amber-400' : 'text-slate-500'}`} />
            <div>
              <span className="font-bold text-sm text-slate-200">
                🚗{' '}
                <Term
                  name="자동차 구매"
                  title="카푸어 스트레스"
                  description="차량 가격뿐 아니라 취등록세, 보험료, 유류비와 함께 출고 즉시 시작되는 연 -15% 감가상각이 순자산을 파괴하는 현실입니다."
                  analogy="달리는 순간 매달 수십만 원이 도로 위에 뿌려지는 감가상각 머신"
                />
              </span>
              {car.enabled && (
                <span className="text-[11px] block text-amber-400 font-mono">
                  선수금 -{car.downPayment}만 즉시 인출 + 월 -{totalMonthlyCarDrain}만원 고정 지출
                </span>
              )}
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={car.enabled}
              onChange={(e) => onCarChange({ ...car, enabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
          </label>
        </div>

        {car.enabled && (
          <div className="space-y-4 pt-1">
            {/* 대표 차종 프리셋 버튼 */}
            <div>
              <div className="text-[11px] text-slate-400 mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" /> 대표 차종 시세 프리셋:
              </div>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() =>
                    onCarChange({
                      ...car,
                      carPrice: 2600,
                      downPayment: 600,
                      monthlyMaintenance: 35,
                    })
                  }
                  className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-center transition-colors"
                >
                  <div className="font-bold text-[11px]">아반떼 신차</div>
                  <div className="text-[10px] text-slate-400 font-mono">2,600만원</div>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onCarChange({
                      ...car,
                      carPrice: 4800,
                      downPayment: 1000,
                      monthlyMaintenance: 45,
                    })
                  }
                  className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-center transition-colors"
                >
                  <div className="font-bold text-[11px]">그랜저 / 쏘렌토</div>
                  <div className="text-[10px] text-slate-400 font-mono">4,800만원</div>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onCarChange({
                      ...car,
                      carPrice: 8200,
                      downPayment: 2000,
                      monthlyMaintenance: 65,
                    })
                  }
                  className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-rose-300 border border-rose-500/30 text-center transition-colors"
                >
                  <div className="font-bold text-[11px]">제네시스·독일차</div>
                  <div className="text-[10px] text-slate-400 font-mono">8,200만원</div>
                </button>
              </div>
            </div>

            {/* 세부 슬라이더들 */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-400">구매 시점</span>
                  <span className="font-mono font-bold text-amber-300">{car.purchaseYear}년차</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max={targetYears}
                  value={Math.min(car.purchaseYear, targetYears)}
                  onChange={(e) => onCarChange({ ...car, purchaseYear: Number(e.target.value) })}
                  className="w-full accent-amber-500 bg-slate-800 h-1.5 rounded cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-400">차량 총 가격</span>
                  <span className="font-mono font-bold text-slate-200">{car.carPrice.toLocaleString()}만원</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="15000"
                  step="100"
                  value={car.carPrice}
                  onChange={(e) => onCarChange({ ...car, carPrice: Number(e.target.value) })}
                  className="w-full accent-amber-500 bg-slate-800 h-1.5 rounded cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-400">초기 선수금 (통장 인출)</span>
                  <span className="font-mono font-bold text-rose-400">{car.downPayment.toLocaleString()}만원</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={car.carPrice}
                  step="100"
                  value={Math.min(car.downPayment, car.carPrice)}
                  onChange={(e) => onCarChange({ ...car, downPayment: Number(e.target.value) })}
                  className="w-full accent-rose-500 bg-slate-800 h-1.5 rounded cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-400">월 유지비 (보험+기름+세금)</span>
                  <span className="font-mono font-bold text-amber-300">월 {car.monthlyMaintenance}만원</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="120"
                  step="5"
                  value={car.monthlyMaintenance}
                  onChange={(e) => onCarChange({ ...car, monthlyMaintenance: Number(e.target.value) })}
                  className="w-full accent-amber-500 bg-slate-800 h-1.5 rounded cursor-pointer"
                />
              </div>
            </div>

            <div className="bg-slate-950/70 p-2.5 rounded text-[11px] text-slate-400 flex items-start gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
              <span>
                <b>감가상각의 공포:</b> 차는 출고되는 순간부터 매년 가치가 -{car.annualDepreciationRate}%씩 녹아내립니다. 즉, 통장 잔고는 할부금으로 깎이고 차의 자산 가치도 동시에 증발합니다.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 🏠 2. 내 집 마련 / 영끌 주담대 스트레스 */}
      <div className={`p-4 rounded-xl border transition-all ${
        home.enabled ? 'bg-sky-950/20 border-sky-500/40' : 'bg-slate-950/50 border-slate-800'
      }`}>
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800/60">
          <div className="flex items-center gap-2">
            <Home className={`w-5 h-5 ${home.enabled ? 'text-sky-400' : 'text-slate-500'}`} />
            <div>
              <span className="font-bold text-sm text-slate-200">
                🏠{' '}
                <Term
                  name="내 집 마련"
                  title="하우스푸어 스트레스"
                  description="자기자본이 묶이고 30년간 매달 수백만 원의 대출 원리금이 강제로 빠져나가면서, 투자 여력과 현금 유동성이 질식하는 현상입니다."
                  analogy="등기는 내 집이지만 사실상 은행에 매달 월세를 내는 형태"
                />
              </span>
              {home.enabled && (
                <span className="text-[11px] block text-sky-400 font-mono">
                  자기자본 -{home.downPayment.toLocaleString()}만 투입 + 주담대 월 원리금 -{Math.round(monthlyMortgage)}만원
                </span>
              )}
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={home.enabled}
              onChange={(e) => onHomeChange({ ...home, enabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-sky-500"></div>
          </label>
        </div>

        {home.enabled && (
          <div className="space-y-4 pt-1">
            {/* 대표 아파트 시세 프리셋 버튼 */}
            <div>
              <div className="text-[11px] text-slate-400 mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-sky-400" /> 현실 아파트 시세 프리셋:
              </div>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() =>
                    onHomeChange({
                      ...home,
                      homePrice: 35000,
                      downPayment: 14000,
                    })
                  }
                  className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-center transition-colors"
                >
                  <div className="font-bold text-[11px]">지방 거점 아파트</div>
                  <div className="text-[10px] text-slate-400 font-mono">3.5억원 (대출 2.1억)</div>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onHomeChange({
                      ...home,
                      homePrice: 65000,
                      downPayment: 25000,
                    })
                  }
                  className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-sky-300 border border-sky-500/30 text-center transition-colors"
                >
                  <div className="font-bold text-[11px]">수도권 실속 아파트</div>
                  <div className="text-[10px] text-slate-400 font-mono">6.5억원 (대출 4억)</div>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onHomeChange({
                      ...home,
                      homePrice: 120000,
                      downPayment: 60000,
                    })
                  }
                  className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-500/30 text-center transition-colors"
                >
                  <div className="font-bold text-[11px]">서울 주요 아파트</div>
                  <div className="text-[10px] text-slate-400 font-mono">12.0억원 (대출 6억)</div>
                </button>
              </div>
            </div>

            {/* 세부 슬라이더들 */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-400">매수 시점</span>
                  <span className="font-mono font-bold text-sky-300">{home.purchaseYear}년차</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max={targetYears}
                  value={Math.min(home.purchaseYear, targetYears)}
                  onChange={(e) => onHomeChange({ ...home, purchaseYear: Number(e.target.value) })}
                  className="w-full accent-sky-500 bg-slate-800 h-1.5 rounded cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-400">집값 (매매가)</span>
                  <span className="font-mono font-bold text-slate-200">
                    {(home.homePrice / 10000).toFixed(1)}억원 ({home.homePrice.toLocaleString()}만)
                  </span>
                </div>
                <input
                  type="range"
                  min="20000"
                  max="250000"
                  step="1000"
                  value={home.homePrice}
                  onChange={(e) => onHomeChange({ ...home, homePrice: Number(e.target.value) })}
                  className="w-full accent-sky-500 bg-slate-800 h-1.5 rounded cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-400">자기자본 선수금 (내 돈)</span>
                  <span className="font-mono font-bold text-sky-300">
                    {(home.downPayment / 10000).toFixed(1)}억원
                  </span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max={home.homePrice}
                  step="1000"
                  value={Math.min(home.downPayment, home.homePrice)}
                  onChange={(e) => onHomeChange({ ...home, downPayment: Number(e.target.value) })}
                  className="w-full accent-sky-500 bg-slate-800 h-1.5 rounded cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-400">주담대 금리 & 만기</span>
                  <span className="font-mono font-bold text-rose-400">
                    연 {home.mortgageRate}% ({home.mortgageYears}년 만기)
                  </span>
                </div>
                <input
                  type="range"
                  min="2.5"
                  max="8.0"
                  step="0.1"
                  value={home.mortgageRate}
                  onChange={(e) => onHomeChange({ ...home, mortgageRate: Number(e.target.value) })}
                  className="w-full accent-rose-500 bg-slate-800 h-1.5 rounded cursor-pointer"
                />
              </div>
            </div>

            <div className="bg-slate-950/70 p-2.5 rounded text-[11px] text-slate-400 flex items-start gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-sky-400 mt-0.5 flex-shrink-0" />
              <span>
                <b>하우스푸어 스트레스:</b> 매달 <b>-{Math.round(monthlyMortgage)}만원의 원리금</b>이 30년 동안 강제로 빠져나가므로, 주식이나 저축에 투입할 수 있는 잉여 현금흐름이 완전히 질식하게 됩니다.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
