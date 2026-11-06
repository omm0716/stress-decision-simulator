import React, { useState } from 'react';
import { Gauge, AlertTriangle, Copy, Check, Wrench, HelpCircle } from 'lucide-react';
import type { SimulationResult, MentalRiskLevel } from '../types/simulator';
import { Term } from './Term';

interface MentalReportCardProps {
  result: SimulationResult;
}

const getBadgeStyles = (level: MentalRiskLevel) => {
  switch (level) {
    case 'SAFE':
      return {
        bg: 'bg-[#172921]/90 border-[#456e5d] text-[#8cd4b5]',
        bar: 'bg-gradient-to-r from-[#3b7a5e] to-[#68b894]',
        text: 'text-[#8cd4b5]',
      };
    case 'CAUTION':
      return {
        bg: 'bg-[#2e2212]/90 border-[#8c6a32] text-[#f0cf85]',
        bar: 'bg-gradient-to-r from-[#9e7836] to-[#e5be67]',
        text: 'text-[#f0cf85]',
      };
    case 'PANIC':
      return {
        bg: 'bg-[#361e12]/90 border-[#b35c2e] text-[#ffad75]',
        bar: 'bg-gradient-to-r from-[#b35c2e] to-[#f08b49]',
        text: 'text-[#ffad75]',
      };
    case 'MELTDOWN':
      return {
        bg: 'bg-[#3d1714]/95 border-[#c93b2b] text-[#ff9e8a] animate-pulse',
        bar: 'bg-gradient-to-r from-[#9e281b] via-[#db4635] to-[#ff6f5e]',
        text: 'text-[#ff8a75]',
      };
  }
};

export const MentalReportCard: React.FC<MentalReportCardProps> = ({ result }) => {
  const { mentalRisk, maxDrawdownRate, maxDrawdownAmount, worstYear, totalLeakageAmount } = result;
  const [copied, setCopied] = useState(false);
  const styles = getBadgeStyles(mentalRisk.level);

  const handleCopy = () => {
    const text = `[⚙ 제국 증기 압력 & 의사결정 스트레스 감정서]
• 보일러 내압 등급: ${mentalRisk.title} (${mentalRisk.score} PSI)
• 최대 압력 강하(MDD): -${maxDrawdownRate}% (최고점 대비 -${maxDrawdownAmount.toLocaleString()}만원 증발)
• 임계 위험 시점: ${worstYear}년차
• 누적 배관 누출액: ${totalLeakageAmount.toLocaleString()}만원
• 수석 기관사 처방: ${mentalRisk.prescription}

👉 의사결정 스트레스 시험기 (1889 Industrial Edition)`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="steam-panel p-5 relative overflow-hidden">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#5c4524]">
        <div className="flex items-center gap-2.5">
          <Gauge className="w-5 h-5 text-[#e05a47]" />
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#e05a47] block">
              GAUGE NO. II — BOILER PRESSURE &amp; MENTAL INTEGRITY
            </span>
            <h2 className="text-base font-bold text-[#f7e7ce] m-0">보일러 내압 &amp; 멘탈 마지노선 감정서</h2>
          </div>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="text-xs px-3 py-1.5 rounded brass-plaque hover:brightness-110 flex items-center gap-1.5 transition-all cursor-pointer font-semibold"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-[#7ec8a3]" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? '감정서 필사 완료!' : '감정서 복사'}
        </button>
      </div>

      {/* 증기 보일러 압력 게이지 바 */}
      <div className="mb-5 bg-[#120e0b] p-3 rounded border border-[#4d3a1f]">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs text-[#d8c7ad] font-medium">
            <Term
              name="보일러 폭발 위험 압력 (스트레스 지수)"
              title="멘탈 폭발 압력 지수 (0~100 PSI)"
              description="폭락장의 깊이, 실직 기간, 대출 원리금 압박을 종합해 '당신이 공포를 못 이기고 바닥에서 손절(보일러 폭발)할 확률'을 0~100 PSI로 계측한 지표입니다."
              analogy="압력이 75 PSI를 넘어가면 보일러 리벳이 튀어나오며 폭발 직전에 이름"
            />
          </span>
          <span className={`text-sm font-bold font-mono ${styles.text}`}>
            {mentalRisk.score} / 100 PSI
          </span>
        </div>
        <div className="w-full bg-[#090705] h-4 rounded-sm overflow-hidden p-0.5 border border-[#5c4524] relative">
          {/* 눈금 표시선 */}
          <div className="absolute inset-0 flex justify-between px-4 pointer-events-none opacity-30">
            <span className="w-px h-full bg-[#f0cf85]"></span>
            <span className="w-px h-full bg-[#f0cf85]"></span>
            <span className="w-px h-full bg-[#f0cf85]"></span>
          </div>
          <div
            className={`h-full transition-all duration-500 ${styles.bar}`}
            style={{ width: `${Math.max(5, mentalRisk.score)}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-[10px] font-mono text-[#8c765a] mt-1">
          <span>0 PSI (안정 순항)</span>
          <span>50 PSI (과열 경보)</span>
          <span className="text-[#e05a47]">100 PSI (즉시 폭발)</span>
        </div>
      </div>

      {/* 진단 타이틀 뱃지 & 설명 */}
      <div className={`p-4 rounded border-2 mb-4 ${styles.bg}`}>
        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <div className="font-bold text-sm tracking-tight">[감정 결과] {mentalRisk.title}</div>
        </div>
        <p className="text-xs leading-relaxed opacity-95">{mentalRisk.description}</p>
      </div>

      {/* 핵심 스트레스 지표 3종 */}
      <div className="grid grid-cols-3 gap-2.5 mb-3 text-center">
        <div className="bg-[#140f0c] p-2.5 rounded border border-[#4d3a1f]">
          <div className="text-[10px] text-[#bfa988]">
            <Term
              name="최대 낙폭 (MDD)"
              title="MDD (최대 압력 강하폭)"
              description="내 계좌가 가장 잘나갈 때 대비 바닥까지 몇 %나 곤두박질쳤는지를 뜻하는 고통 지수입니다."
              analogy="증기기관차가 절벽 아래로 급강하한 최대 깊이 (-30% 넘으면 대부분 투매 발생)"
            />
          </div>
          <div className="text-sm font-bold font-mono text-[#e05a47] mt-0.5">-{maxDrawdownRate}%</div>
          <div className="text-[10px] text-[#9c8669] font-mono mt-0.5">
            (-{maxDrawdownAmount.toLocaleString()}만원)
          </div>
        </div>
        <div className="bg-[#140f0c] p-2.5 rounded border border-[#4d3a1f]">
          <div className="text-[10px] text-[#bfa988]">최대 위험 연차</div>
          <div className="text-sm font-bold font-mono text-[#f0cf85] mt-0.5">{worstYear}년차</div>
          <div className="text-[10px] text-[#9c8669] mt-0.5">보일러 과열 정점</div>
        </div>
        <div className="bg-[#140f0c] p-2.5 rounded border border-[#4d3a1f]">
          <div className="text-[10px] text-[#bfa988]">
            <Term
              name="누적 증기 누출"
              title="누적 지출 누수 원금"
              description="배달, OTT 구독, 커피 등으로 배관 틈새로 야금야금 새어나간 원금의 총합계입니다."
              analogy="헐거운 파이프 이음새로 허공에 흩어진 증기 총량"
            />
          </div>
          <div className="text-sm font-bold font-mono text-[#7ec8a3] mt-0.5">
            {totalLeakageAmount.toLocaleString()}만원
          </div>
          <div className="text-[10px] text-[#9c8669] mt-0.5">유실된 원금 합</div>
        </div>
      </div>

      {/* MDD 용어 직접 설명 */}
      <div className="mb-4 parchment-note p-2.5 text-[11px] flex items-start gap-2">
        <HelpCircle className="w-3.5 h-3.5 text-[#f0cf85] mt-0.5 flex-shrink-0" />
        <span>
          <b>MDD(최대 낙폭)란?</b> 내 자산이 최고점 대비 얼마까지 추락하는가를 뜻합니다. 이 수치가 -30%를 넘어가면 대다수는 심리적 패닉으로 바닥에서 투매하게 됩니다.
        </span>
      </div>

      {/* 수석 기관사 처방전 */}
      <div className="p-3.5 rounded bg-[#261c12] border-2 border-[#9e7836] text-[#f7e7ce]">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#f0cf85] mb-1">
          <Wrench className="w-3.5 h-3.5 text-[#f0cf85]" />
          <span>수석 기관사의 1줄 수리 처방전:</span>
        </div>
        <p className="text-xs leading-relaxed text-[#e6d7be] font-medium">{mentalRisk.prescription}</p>
      </div>
    </div>
  );
};
