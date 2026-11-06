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
  const carLoan = Math.max(0, car.carPrice - car.downPayment);
  const rCar = car.loanRate / 100 / 12;
  const monthlyCarLoan = car.loanMonths > 0 && rCar > 0
    ? (carLoan * rCar * Math.pow(1 + rCar, car.loanMonths)) / (Math.pow(1 + rCar, car.loanMonths) - 1)
    : 0;
  const totalMonthlyCarDrain = Math.round(monthlyCarLoan + car.monthlyMaintenance);

  const homeLoan = Math.max(0, home.homePrice - home.downPayment);
  const rHome = home.mortgageRate / 100 / 12;
  const nHomeMonths = home.mortgageYears * 12;
  const monthlyMortgage = nHomeMonths > 0 && rHome > 0
    ? (homeLoan * rHome * Math.pow(1 + rHome, nHomeMonths)) / (Math.pow(1 + rHome, nHomeMonths) - 1)
    : 0;

  return (
    <div className="steam-panel p-5 space-y-5">
      <div className="flex items-center justify-between pb-2.5 border-b border-[#5c4524]">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#e05a47] block">
            VALVE NO. IV — HEAVY ASSET BURDENS
          </span>
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-[#e05a47]" />
            <h2 className="text-base font-bold text-[#f7e7ce] m-0">
              4. 극단적 대형 지출 부하 (차량 &amp; 부동산)
            </h2>
          </div>
          <p className="text-xs text-[#bfa988] mt-0.5">
            복리 증기기관을 멈춰 세우는 2대 중장비 부채: <b>카푸어 &amp; 하우스푸어</b>
          </p>
        </div>
      </div>

      {/* 🚗 1. 자동차 구매 스트레스 */}
      <div className={`p-4 rounded border transition-all ${
        car.enabled ? 'bg-[#2a1d12]/90 border-[#9e7836]' : 'bg-[#140f0c]/60 border-[#3d2e1b]'
      }`}>
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#4d3a1f]">
          <div className="flex items-center gap-2">
            <Car className={`w-5 h-5 ${car.enabled ? 'text-[#f0cf85]' : 'text-[#7a6852]'}`} />
            <div>
              <span className="font-bold text-sm text-[#f7e7ce]">
                🚂{' '}
                <Term
                  name="자가용 증기마차(자동차) 구매"
                  title="카푸어 감가상각 부하"
                  description="차량 가격뿐 아니라 취등록세, 보험료, 연료비와 함께 출고 즉시 시작되는 연 -15% 감가상각이 순자산을 녹여버리는 현상입니다."
                  analogy="달리는 순간 매달 은화가 도로 위에 흩뿌려지는 호화 증기 마차"
                />
              </span>
              {car.enabled && (
                <span className="text-[11px] block text-[#f0cf85] font-mono mt-0.5">
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
            <div className="w-9 h-5 bg-[#120e0b] border border-[#5c4524] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#f0cf85] after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#8c6a32]"></div>
          </label>
        </div>

        {car.enabled && (
          <div className="space-y-4 pt-1">
            <div>
              <div className="text-[11px] text-[#bfa988] mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#f0cf85]" /> 대표 차종 시세 규격:
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
                  className="p-2 rounded bg-[#1f1710] hover:bg-[#2e2217] text-[#e6d7be] border border-[#5c4524] text-center transition-colors cursor-pointer"
                >
                  <div className="font-bold text-[11px]">실속형 (아반떼)</div>
                  <div className="text-[10px] text-[#bfa988] font-mono">2,600만원</div>
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
                  className="p-2 rounded bg-[#2b1f13] hover:bg-[#3a2a19] text-[#f0cf85] border border-[#8c6a32] text-center transition-colors cursor-pointer"
                >
                  <div className="font-bold text-[11px]">중형급 (그랜저)</div>
                  <div className="text-[10px] text-[#d8c7ad] font-mono">4,800만원</div>
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
                  className="p-2 rounded bg-[#361915] hover:bg-[#47201b] text-[#ff9e8a] border border-[#8f3d2f] text-center transition-colors cursor-pointer"
                >
                  <div className="font-bold text-[11px]">귀족형 (수입·대형)</div>
                  <div className="text-[10px] text-[#ffbfb3] font-mono">8,200만원</div>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[#bfa988]">출고 시점</span>
                  <span className="font-mono font-bold text-[#f0cf85]">{car.purchaseYear}년차</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max={targetYears}
                  value={Math.min(car.purchaseYear, targetYears)}
                  onChange={(e) => onCarChange({ ...car, purchaseYear: Number(e.target.value) })}
                  className="w-full cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[#bfa988]">차량 가격</span>
                  <span className="font-mono font-bold text-[#f7e7ce]">{car.carPrice.toLocaleString()}만원</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="15000"
                  step="100"
                  value={car.carPrice}
                  onChange={(e) => onCarChange({ ...car, carPrice: Number(e.target.value) })}
                  className="w-full cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[#bfa988]">초기 선수금</span>
                  <span className="font-mono font-bold text-[#e05a47]">{car.downPayment.toLocaleString()}만원</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={car.carPrice}
                  step="100"
                  value={Math.min(car.downPayment, car.carPrice)}
                  onChange={(e) => onCarChange({ ...car, downPayment: Number(e.target.value) })}
                  className="w-full cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[#bfa988]">월 유지비 (연료·보험)</span>
                  <span className="font-mono font-bold text-[#f0cf85]">월 {car.monthlyMaintenance}만원</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="120"
                  step="5"
                  value={car.monthlyMaintenance}
                  onChange={(e) => onCarChange({ ...car, monthlyMaintenance: Number(e.target.value) })}
                  className="w-full cursor-pointer"
                />
              </div>
            </div>

            <div className="parchment-note p-2.5 text-[11px] flex items-start gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-[#f0cf85] mt-0.5 flex-shrink-0" />
              <span>
                <b>감가상각 경고:</b> 차량은 출고 즉시 매년 가치가 -{car.annualDepreciationRate}%씩 부식됩니다. 할부금으로 현금이 빠져나가는 동시에 기계의 잔존가치도 소멸합니다.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 🏠 2. 내 집 마련 / 영끌 주담대 스트레스 */}
      <div className={`p-4 rounded border transition-all ${
        home.enabled ? 'bg-[#1a2421]/90 border-[#456e5d]' : 'bg-[#140f0c]/60 border-[#3d2e1b]'
      }`}>
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#3d4d46]">
          <div className="flex items-center gap-2">
            <Home className={`w-5 h-5 ${home.enabled ? 'text-[#7ec8a3]' : 'text-[#7a6852]'}`} />
            <div>
              <span className="font-bold text-sm text-[#f7e7ce]">
                🏛{' '}
                <Term
                  name="저택·부동산 매입 (주담대)"
                  title="하우스푸어 원리금 압박"
                  description="자기자본이 부동산에 묶이고 30년간 매달 수백만 원의 은행 대출 원리금이 강제 징수되면서 현금 유동성이 질식하는 현상입니다."
                  analogy="문패는 내 이름이지만 실질적으로는 은행 영주에게 매달 공물을 바치는 구조"
                />
              </span>
              {home.enabled && (
                <span className="text-[11px] block text-[#7ec8a3] font-mono mt-0.5">
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
            <div className="w-9 h-5 bg-[#120e0b] border border-[#5c4524] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#7ec8a3] after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#35634d]"></div>
          </label>
        </div>

        {home.enabled && (
          <div className="space-y-4 pt-1">
            <div>
              <div className="text-[11px] text-[#bfa988] mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#7ec8a3]" /> 대표 부동산 시세 규격:
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
                  className="p-2 rounded bg-[#18221f] hover:bg-[#22302c] text-[#d8c7ad] border border-[#3d594e] text-center transition-colors cursor-pointer"
                >
                  <div className="font-bold text-[11px]">지방 거점 주택</div>
                  <div className="text-[10px] text-[#8cd4b5] font-mono">3.5억 (대출 2.1억)</div>
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
                  className="p-2 rounded bg-[#1e2e29] hover:bg-[#283d36] text-[#8cd4b5] border border-[#4e7a69] text-center transition-colors cursor-pointer"
                >
                  <div className="font-bold text-[11px]">수도권 실속 주택</div>
                  <div className="text-[10px] text-[#d8c7ad] font-mono">6.5억 (대출 4억)</div>
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
                  className="p-2 rounded bg-[#361915] hover:bg-[#47201b] text-[#ff9e8a] border border-[#8f3d2f] text-center transition-colors cursor-pointer"
                >
                  <div className="font-bold text-[11px]">수도 중심지 저택</div>
                  <div className="text-[10px] text-[#ffbfb3] font-mono">12.0억 (대출 6억)</div>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[#bfa988]">매입 시점</span>
                  <span className="font-mono font-bold text-[#7ec8a3]">{home.purchaseYear}년차</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max={targetYears}
                  value={Math.min(home.purchaseYear, targetYears)}
                  onChange={(e) => onHomeChange({ ...home, purchaseYear: Number(e.target.value) })}
                  className="w-full cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[#bfa988]">주택 매매가</span>
                  <span className="font-mono font-bold text-[#f7e7ce]">
                    {(home.homePrice / 10000).toFixed(1)}억원
                  </span>
                </div>
                <input
                  type="range"
                  min="20000"
                  max="250000"
                  step="1000"
                  value={home.homePrice}
                  onChange={(e) => onHomeChange({ ...home, homePrice: Number(e.target.value) })}
                  className="w-full cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[#bfa988]">자기자본 선수금</span>
                  <span className="font-mono font-bold text-[#7ec8a3]">
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
                  className="w-full cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[#bfa988]">대출 금리 ({home.mortgageYears}년)</span>
                  <span className="font-mono font-bold text-[#e05a47]">
                    연 {home.mortgageRate}%
                  </span>
                </div>
                <input
                  type="range"
                  min="2.5"
                  max="8.0"
                  step="0.1"
                  value={home.mortgageRate}
                  onChange={(e) => onHomeChange({ ...home, mortgageRate: Number(e.target.value) })}
                  className="w-full cursor-pointer"
                />
              </div>
            </div>

            <div className="parchment-note p-2.5 text-[11px] flex items-start gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-[#7ec8a3] mt-0.5 flex-shrink-0" />
              <span>
                <b>원리금 질식 주의:</b> 매월 <b>-{Math.round(monthlyMortgage)}만원의 원리금</b>이 30년간 강제 집행되므로, 실직이나 위기 발생 시 유동성 고갈로 가장 먼저 타격을 입습니다.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
