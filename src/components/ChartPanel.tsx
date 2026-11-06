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
import { TrendingUp, AlertOctagon, HelpCircle } from 'lucide-react';
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
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-800 gap-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-400" />
          <div>
            <h2 className="text-base font-semibold text-slate-100 m-0">자산 궤적 시뮬레이션</h2>
            <p className="text-xs text-slate-400 mt-0.5">환상(이상) vs 현실 vs 최악의 위기 3중 비교</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs flex-wrap">
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span> 장밋빛 복리
          </span>
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <span className="w-2 h-2 rounded-full bg-sky-400"></span> 현실 반영
          </span>
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span> 폭락장 스트레스
          </span>
        </div>
      </div>

      {/* 최종 자산 비교 스탯 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
          <div className="text-[11px] text-slate-400">총 적립 원금</div>
          <div className="text-sm md:text-base font-bold text-slate-200 font-mono mt-0.5">
            {formatKoreanMoney(totalInvestedPrincipal)}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">순수 내가 넣은 돈</div>
        </div>
        <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-800/40">
          <div className="text-[11px] text-emerald-400">
            <Term
              name="장밋빛 최종 (이상)"
              title="장밋빛 복리 잔고"
              description="지출 누수도 없고 시장 폭락도 전혀 없는, 기존 금융 계산기들이 보여주던 이상적인 환상의 잔고입니다."
              analogy="날씨 화창하고 신호등이 전부 초록불일 때의 최고 속도"
            />
          </div>
          <div className="text-sm md:text-base font-bold text-emerald-300 font-mono mt-0.5">
            {formatKoreanMoney(finalIdeal)}
          </div>
          <div className="text-[10px] text-emerald-500/80 mt-0.5">누수 0 + 하락장 0일 때</div>
        </div>
        <div className="p-3 rounded-lg bg-sky-950/20 border border-sky-800/40">
          <div className="text-[11px] text-sky-400">
            <Term
              name="현실 지출 반영"
              title="현실 반영 잔고"
              description="OTT 구독료, 커피값, 배달비 등 현실의 지출 누수를 빼고 모았을 때의 정직한 잔고입니다."
              analogy="주유비와 톨게이트비를 지불하고 남은 순수 자산"
            />
          </div>
          <div className="text-sm md:text-base font-bold text-sky-300 font-mono mt-0.5">
            {formatKoreanMoney(finalNormal)}
          </div>
          <div className="text-[10px] text-sky-500/80 mt-0.5">OTT/배달 누수 제외 잔고</div>
        </div>
        <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-700/50">
          <div className="text-[11px] text-rose-400 font-semibold">
            <Term
              name="스트레스 최종 잔고"
              title="스트레스 잔고 (최후 마지노선)"
              description="사소한 지출 누수 + 수입 중단(실직) + 시장 폭락까지 겹쳤을 때 내 계좌에 실제로 남아있을 '진짜 마지노선 생존 자금'입니다."
              analogy="태풍과 폭설이 몰아칠 때 안전하게 살아남는 마지노선"
            />
          </div>
          <div className="text-sm md:text-base font-bold text-rose-300 font-mono mt-0.5">
            {formatKoreanMoney(finalStress)}
          </div>
          <div className="text-[10px] text-rose-400/80 mt-0.5 font-medium">폭락+실직 충격 후 잔고</div>
        </div>
      </div>

      {/* 3개 곡선 직접 해설 배너 */}
      <div className="mb-4 bg-slate-950/70 p-3 rounded-lg border border-slate-800 text-[11px] text-slate-300 space-y-1">
        <div className="flex items-center gap-1 font-semibold text-slate-200">
          <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
          <span>그래프를 읽는 핵심 포인트:</span>
        </div>
        <div className="text-slate-400 leading-relaxed">
          초록 점선과 파란 실선 사이의 격차는 <b>"사소한 구독·배달 지출이 갉아먹은 기회비용"</b>이며, 파란 실선과 빨간 영역 사이의 격차는 <b>"시장 폭락 및 실직 쇼크가 안겨준 심리적 타격"</b>입니다.
        </div>
      </div>

      {/* Recharts 차트 */}
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={timeline} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="idealGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="normalGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="stressGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} vertical={false} />
            <XAxis dataKey="label" stroke="#64748b" fontSize={11} tickLine={false} />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              tickFormatter={(v) => (v >= 10000 ? `${Math.round(v / 10000)}억` : `${v}만`)}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-slate-900/95 border border-slate-700 p-3 rounded-lg shadow-xl text-xs space-y-1.5 backdrop-blur-md">
                      <div className="font-bold text-slate-200 border-b border-slate-700 pb-1 flex items-center justify-between gap-4">
                        <span>{label}</span>
                        {data.isCrashYear && (
                          <span className="px-1.5 py-0.5 rounded bg-rose-500/30 text-rose-300 text-[10px] flex items-center gap-1">
                            <AlertOctagon className="w-3 h-3" /> 폭락 이벤트 발생!
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between gap-4 text-emerald-400">
                        <span>장밋빛 이상 잔고:</span>
                        <span className="font-mono font-semibold">{formatKoreanMoney(data.idealBalance)}</span>
                      </div>
                      <div className="flex justify-between gap-4 text-sky-400">
                        <span>현실 반영 잔고:</span>
                        <span className="font-mono font-semibold">{formatKoreanMoney(data.normalBalance)}</span>
                      </div>
                      <div className="flex justify-between gap-4 text-rose-400 font-bold">
                        <span>스트레스 잔고:</span>
                        <span className="font-mono">{formatKoreanMoney(data.stressBalance)}</span>
                      </div>
                      {data.drawdownRate > 0 && (
                        <div className="text-[10px] text-rose-300/80 pt-1 border-t border-slate-800">
                          고점 대비 낙폭: -{data.drawdownRate}%
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
              stroke="#10b981"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              fill="url(#idealGrad)"
              name="장밋빛 복리"
            />
            <Area
              type="monotone"
              dataKey="normalBalance"
              stroke="#0ea5e9"
              strokeWidth={2}
              fill="url(#normalGrad)"
              name="현실 반영"
            />
            <Area
              type="monotone"
              dataKey="stressBalance"
              stroke="#f43f5e"
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
