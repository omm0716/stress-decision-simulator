import React, { useState } from 'react';
import { Table, ChevronDown, ChevronUp, TrendingDown, TrendingUp } from 'lucide-react';
import type { SimulationResult } from '../types/simulator';

interface YearlyDataTableProps {
  result: SimulationResult;
}

const formatMoney = (val: number) => {
  if (Math.abs(val) >= 10000) {
    const eok = (val / 10000).toFixed(1);
    return `${eok}억원`;
  }
  return `${val.toLocaleString()}만원`;
};

export const YearlyDataTable: React.FC<YearlyDataTableProps> = ({ result }) => {
  const [isOpen, setIsOpen] = useState(true);
  const { timeline, worstYear } = result;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
      {/* 헤더 & 토글 버튼 */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors border-b border-slate-800"
      >
        <div className="flex items-center gap-2">
          <Table className="w-5 h-5 text-indigo-400" />
          <div>
            <h2 className="text-base font-semibold text-slate-100 m-0">연도별 상세 데이터 테이블</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              원금 누적, 생활비 역인출, 시장 급락 충격의 연도별 엑셀 뷰
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono">
            {timeline.length}개년 데이터
          </span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/80 text-slate-400 border-b border-slate-800 font-medium">
                <th className="py-3 px-3.5 whitespace-nowrap">연차</th>
                <th className="py-3 px-3.5 whitespace-nowrap">발생 이벤트 / 쇼크</th>
                <th className="py-3 px-3.5 text-right whitespace-nowrap">누적 원금</th>
                <th className="py-3 px-3.5 text-right whitespace-nowrap">누적 지출누수</th>
                <th className="py-3 px-3.5 text-right whitespace-nowrap">스트레스 잔고</th>
                <th className="py-3 px-3.5 text-right whitespace-nowrap">순수익 / 손실</th>
                <th className="py-3 px-3.5 text-right whitespace-nowrap">최대 낙폭(MDD)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {timeline.map((row) => {
                const isWorst = row.year === worstYear;
                const isNegative = row.stressNetProfit < 0;

                return (
                  <tr
                    key={row.year}
                    className={`hover:bg-slate-800/30 transition-colors ${
                      isWorst ? 'bg-rose-950/20' : ''
                    } ${row.hadIncomeShock ? 'bg-amber-950/15' : ''}`}
                  >
                    <td className="py-2.5 px-3.5 whitespace-nowrap font-sans font-medium text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <span>{row.label}</span>
                        {isWorst && (
                          <span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-400 text-[10px] font-sans font-bold border border-rose-500/40">
                            최대고비
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-2.5 px-3.5 font-sans">
                      {row.events.length > 0 ? (
                        <div className="flex items-center gap-1 flex-wrap">
                          {row.events.map((ev, idx) => (
                            <span
                              key={idx}
                              className={`px-1.5 py-0.5 rounded text-[11px] font-medium border ${
                                ev.includes('실직')
                                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                                  : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                              }`}
                            >
                              {ev}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-500 text-[11px]">-</span>
                      )}
                    </td>

                    <td className="py-2.5 px-3.5 text-right text-slate-300">
                      {formatMoney(row.totalPrincipal)}
                    </td>

                    <td className="py-2.5 px-3.5 text-right text-amber-400/90">
                      -{formatMoney(row.accumulatedLeakage)}
                    </td>

                    <td className="py-2.5 px-3.5 text-right font-bold text-white">
                      {formatMoney(row.stressBalance)}
                    </td>

                    <td
                      className={`py-2.5 px-3.5 text-right font-semibold ${
                        isNegative ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                    >
                      <div className="flex items-center justify-end gap-1">
                        {isNegative ? (
                          <TrendingDown className="w-3.5 h-3.5 flex-shrink-0" />
                        ) : (
                          <TrendingUp className="w-3.5 h-3.5 flex-shrink-0" />
                        )}
                        <span>
                          {isNegative ? '' : '+'}
                          {formatMoney(row.stressNetProfit)} ({row.stressProfitRate > 0 ? '+' : ''}
                          {row.stressProfitRate}%)
                        </span>
                      </div>
                    </td>

                    <td className="py-2.5 px-3.5 text-right">
                      {row.drawdownRate > 0 ? (
                        <span className="text-rose-400 font-bold">-{row.drawdownRate}%</span>
                      ) : (
                        <span className="text-slate-500">0%</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
