import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Activity, AlertOctagon, HelpCircle } from 'lucide-react';
import type { SimulationResult } from '../types/simulator';
import { Term } from './Term';

interface ChartPanelProps {
  result: SimulationResult;
}

const formatKoreanMoney = (value: number) => {
  if (value >= 10000) {
    const eok = Math.floor(value / 10000);
    const man = value % 10000;
    return man > 0 ? `${eok}억 ${man.toLocaleString()}만` : `${eok}억원`;
  }
  return `${value.toLocaleString()}만원`;
};

export const ChartPanel: React.FC<ChartPanelProps> = ({ result }) => {
  const { timeline, finalIdeal, finalNormal, finalStress, totalInvestedPrincipal } = result;

  return (
    <div className="steam-panel p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 mb-4 border-b border-[#5c4524] gap-2">
        <div className="flex items-center gap-2.5">
          <Activity className="w-5 h-5 text-[#f0cf85]" />
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#c99738] block">
              CHART NO. I — PRESSURE TRAJECTORY GRAPH
            </span>
            <h2 className="text-base font-bold text-[#f7e7ce] m-0">자본 &amp; 압력 궤적 기록계</h2>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs flex-wrap font-mono">
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#2e2312] text-[#f0cf85] border border-[#8c6a32]">
            <span className="w-2 h-2 rounded-full bg-[#d4af37]"></span> 황금빛 이상
          </span>
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#162923] text-[#7ec8a3] border border-[#3e6b58]">
            <span className="w-2 h-2 rounded-full bg-[#59b39c]"></span> 현실 원장
          </span>
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#361714] text-[#ff9e8a] border border-[#8f3d2f] font-bold">
            <span className="w-2 h-2 rounded-full bg-[#db4635]"></span> 극한 압력(스트레스)
          </span>
        </div>
      </div>

      {/* 최종 자산 비교 황동 계기판 4종 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="p-3 rounded bg-[#140f0c]/90 border border-[#4d3a1f]">
          <div className="text-[11px] text-[#bfa988]">총 투입 원금(석탄)</div>
          <div className="text-sm md:text-base font-bold text-[#e6d7be] font-mono mt-0.5">
            {formatKoreanMoney(totalInvestedPrincipal)}
          </div>
          <div className="text-[10px] text-[#8c765a] mt-0.5">순수 납입 원금</div>
        </div>

        <div className="p-3 rounded bg-[#261d10]/80 border border-[#8c6a32]">
          <div className="text-[11px] text-[#f0cf85]">
            <Term
              name="황금빛 이상 잔고"
              title="무결점 이상 복리 잔고"
              description="증기 누출(지출 누수)도 없고 보일러 역류(폭락장)도 전혀 없는, 기존 계산기들이 보여주던 이상적인 환상의 잔고입니다."
              analogy="마찰열과 증기 손실이 0%인 상상 속의 영구기관"
            />
          </div>
          <div className="text-sm md:text-base font-bold text-[#f7dfa5] font-mono mt-0.5">
            {formatKoreanMoney(finalIdeal)}
          </div>
          <div className="text-[10px] text-[#bfa988] mt-0.5">누수 0 + 무풍 순항</div>
        </div>

        <div className="p-3 rounded bg-[#15241f]/80 border border-[#3e6b58]">
          <div className="text-[11px] text-[#7ec8a3]">
            <Term
              name="현실 원장 잔고"
              title="현실 지출 반영 잔고"
              description="구독료, 커피값, 배달비 등 일상적인 배관 증기 누출을 제외하고 모았을 때의 정직한 장부 잔고입니다."
              analogy="정상적인 마찰 손실을 반영한 평시 기관차 출력"
            />
          </div>
          <div className="text-sm md:text-base font-bold text-[#9be0bf] font-mono mt-0.5">
            {formatKoreanMoney(finalNormal)}
          </div>
          <div className="text-[10px] text-[#6fa38b] mt-0.5">일상 누수 차감 후</div>
        </div>

        <div className="p-3 rounded bg-[#331612]/90 border-2 border-[#a83829]">
          <div className="text-[11px] text-[#ff9e8a] font-semibold">
            <Term
              name="스트레스 최종 잔고"
              title="극한 압력(스트레스) 생존 잔고"
              description="지출 누수 + 연료 중단(실직) + 대형 부채 + 시장 폭락까지 모두 겹쳤을 때 끝내 살아남는 '최후 마지노선 자본'입니다."
              analogy="폭풍우와 보일러 과열 속에서도 폭발하지 않고 남은 최종 동력"
            />
          </div>
          <div className="text-sm md:text-base font-bold text-[#ffb4a3] font-mono mt-0.5">
            {formatKoreanMoney(finalStress)}
          </div>
          <div className="text-[10px] text-[#e07a68] mt-0.5 font-medium">최악의 위기 돌파 후</div>
        </div>
      </div>

      {/* 3개 곡선 직접 해설 배너 */}
      <div className="mb-4 parchment-note p-3 text-[11px] space-y-1">
        <div className="flex items-center gap-1.5 font-bold text-[#f0cf85]">
          <HelpCircle className="w-3.5 h-3.5 text-[#f0cf85]" />
          <span>계측 기록지 판독 요령:</span>
        </div>
        <div className="text-[#d8c7ad] leading-relaxed">
          황금 점선과 청록 실선 사이의 간격은 <b>"사소한 구독·배달 누수가 증발시킨 기회비용"</b>이며, 청록 실선과 붉은 영역 사이의 낙차는 <b>"실직·폭락·대형 할부가 가한 실질 타격"</b>입니다.
        </div>
      </div>

      {/* Recharts 차트 */}
      <div className="w-full h-80 bg-[#120e0b]/90 p-3 rounded border border-[#4d3a1f]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={timeline} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="idealGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#d4af37" stopOpacity={0.28} />
                <stop offset="95%" stopColor="#d4af37" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="normalGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#59b39c" stopOpacity={0.32} />
                <stop offset="95%" stopColor="#59b39c" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="stressGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#db4635" stopOpacity={0.55} />
                <stop offset="95%" stopColor="#db4635" stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#3d2e1b" opacity={0.7} vertical={true} />
            <XAxis dataKey="label" stroke="#9c8669" fontSize={11} tickLine={false} />
            <YAxis
              stroke="#9c8669"
              fontSize={11}
              tickLine={false}
              tickFormatter={(v) => (v >= 10000 ? `${Math.round(v / 10000)}억` : `${v}만`)}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-[#1b140e]/95 border-2 border-[#9e7836] p-3 rounded shadow-2xl text-xs space-y-1.5 backdrop-blur-md">
                      <div className="font-bold text-[#f7e7ce] border-b border-[#5c4524] pb-1 flex items-center justify-between gap-4">
                        <span className="font-mono">{label} 계측치</span>
                        {data.isCrashYear && (
                          <span className="px-1.5 py-0.5 rounded bg-[#4a1c17] text-[#ff9e8a] border border-[#a83829] text-[10px] flex items-center gap-1">
                            <AlertOctagon className="w-3 h-3" /> 폭락 충격!
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between gap-4 text-[#f0cf85]">
                        <span>황금빛 이상 잔고:</span>
                        <span className="font-mono font-semibold">{formatKoreanMoney(data.idealBalance)}</span>
                      </div>
                      <div className="flex justify-between gap-4 text-[#7ec8a3]">
                        <span>현실 원장 잔고:</span>
                        <span className="font-mono font-semibold">{formatKoreanMoney(data.normalBalance)}</span>
                      </div>
                      <div className="flex justify-between gap-4 text-[#ff8a75] font-bold">
                        <span>스트레스 생존 잔고:</span>
                        <span className="font-mono">{formatKoreanMoney(data.stressBalance)}</span>
                      </div>
                      {data.drawdownRate > 0 && (
                        <div className="text-[10px] text-[#ff9e8a] pt-1 border-t border-[#4d3a1f] font-mono">
                          최고점 대비 압력 강하(MDD): -{data.drawdownRate}%
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="idealBalance"
              stroke="#d4af37"
              strokeWidth={1.8}
              strokeDasharray="5 4"
              fill="url(#idealGrad)"
              name="황금빛 이상"
            />
            <Area
              type="monotone"
              dataKey="normalBalance"
              stroke="#59b39c"
              strokeWidth={2}
              fill="url(#normalGrad)"
              name="현실 원장"
            />
            <Area
              type="monotone"
              dataKey="stressBalance"
              stroke="#db4635"
              strokeWidth={3}
              fill="url(#stressGrad)"
              name="스트레스 잔고"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
