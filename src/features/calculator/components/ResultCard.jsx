import { formatMoney } from '../utils/formatMoney';

function ResultCard({ estimate, floorArea, onOrderReport }) {
  return (
    <aside className="lg:sticky lg:top-8 lg:col-span-5">
      <div className="space-y-6 rounded-3xl border border-[#E2E8F0] bg-white p-8 shadow-xl shadow-slate-100">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Estimated build cost</p>
          <h2 className="mt-1 text-5xl font-black text-[#0F172A]">{formatMoney(estimate.mid)}</h2>
        </div>

        <div className="space-y-2.5 border-y border-[#E2E8F0] py-4 text-xs font-medium text-[#64748B]">
          <div className="flex justify-between" data-estimate-row="low">
            <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-green-500" />Low estimate</span>
            <span className="font-bold text-[#0F172A]">{formatMoney(estimate.low)}</span>
          </div>
          <div className="flex justify-between" data-estimate-row="mid">
            <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />Mid estimate</span>
            <span className="font-bold text-[#0F172A]">{formatMoney(estimate.mid)}</span>
          </div>
          <div className="flex justify-between" data-estimate-row="high">
            <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-rose-500" />High estimate</span>
            <span className="font-bold text-[#0F172A]">{formatMoney(estimate.high)}</span>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">Cost breakdown</p>
          <div className="flex justify-between border-b border-[#F1F5F9] pb-2 text-xs font-medium" data-breakdown-row="base">
            <span className="text-[#64748B]">Base build</span>
            <span className="font-semibold text-[#0F172A]">{formatMoney(estimate.baseBuildCost)}</span>
          </div>
          <div className="flex justify-between border-b border-[#F1F5F9] pb-2 text-xs font-medium" data-breakdown-row="ducted">
            <span className="text-[#64748B]">Ducted air-conditioning</span>
            <span className="font-semibold text-[#0F172A]">{formatMoney(estimate.ductedCost)}</span>
          </div>
          <div className="flex justify-between pt-1 text-sm font-bold text-[#0F172A]" data-breakdown-row="total">
            <span>TOTAL</span>
            <span>{formatMoney(estimate.total)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3 text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Cost per m2</p>
            <p className="mt-0.5 text-sm font-extrabold text-[#0F172A]">{formatMoney(estimate.baseRate)}</p>
          </div>
          <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3 text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Floor area</p>
            <p className="mt-0.5 text-sm font-extrabold text-[#0F172A]">{floorArea} m2</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOrderReport}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#E27D24] px-6 py-4 text-base font-bold text-white shadow-lg shadow-orange-100 transition-all hover:-translate-y-0.5 hover:bg-[#c9691b] active:translate-y-0"
        >
          <span>Request Initial Cost Report</span>
          <span className="text-lg">↗</span>
        </button>

        <p className="px-2 text-center text-[11px] leading-relaxed text-[#94A3B8]">
          Estimates are indicative only. Figures are based on current market data and may vary. An Initial Cost Report provides a detailed, site-specific assessment.
        </p>
      </div>
    </aside>
  );
}

export default ResultCard;
