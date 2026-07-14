function AccordionItem({ id, title, children, openId, onToggle }) {
  const expanded = openId === id;

  return (
    <div className="border-t border-[#E2E8F0] pt-3">
      <button
        type="button"
        className="accordion-toggle flex w-full justify-between text-sm font-medium text-[#64748B]"
        onClick={() => onToggle(id)}
        aria-expanded={expanded}
      >
        <span>{title}</span>
        <span className="accordion-arrow">▼</span>
      </button>
      <div className={`accordion-content mt-2 text-xs text-[#64748B] ${expanded ? '' : 'hidden'}`}>
        {children}
      </div>
    </div>
  );
}

function AccordionInfo({ openId, onToggle, summaryText }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
      <button type="button" className="w-full border-b border-[#E2E8F0] p-5 text-left font-bold hover:bg-[#F8FAFC]">
        <span>How your estimate is calculated</span>
      </button>
      <div className="space-y-4 bg-[#F8FAFC] p-5">
        <div>
          <button type="button" className="mb-2 flex w-full items-center justify-between text-sm font-bold text-[#0F172A]">
            <span>Your inputs</span>
            <span>▲</span>
          </button>
          <p className="text-xs leading-relaxed text-[#64748B]">
            Your estimate starts with a per-m2 build rate based on your selected state and finish level, sourced from current Australian construction data. Rates typically range from $1,800/m2 (standard) to $4,500/m2 (luxury) depending on location and specification.
          </p>
          <div id="your-inputs-summary" className="mt-2 text-sm text-[#334155]">
            <strong>Selections:</strong> {summaryText}
          </div>
        </div>

        <AccordionItem id="how-calculated" title="How we calculated it" openId={openId} onToggle={onToggle}>
          Each inclusion adds a fixed estimated cost to your total. Ducted air-conditioning adds approximately $18,000-$25,000, solar panels add $8,000-$12,000, and an alfresco area adds $15,000-$22,000 depending on size and specification.
        </AccordionItem>

        <AccordionItem id="what-affects" title="What affects your estimate" openId={openId} onToggle={onToggle}>
          The low estimate assumes favorable site conditions, competitive tender pricing, and no significant variations. The high estimate accounts for site-specific challenges, material cost movements, and contractor availability in your area.
        </AccordionItem>

        <AccordionItem id="totals-exgst" title="Totals (ex-GST)" openId={openId} onToggle={onToggle}>
          This estimate excludes land purchase, stamp duty, council fees, architect fees, demolition (for knockdown rebuilds), landscaping, driveway, fencing, and connection to services (water, gas, electricity). An Initial Cost Report provides a comprehensive breakdown.
        </AccordionItem>
      </div>
    </div>
  );
}

export default AccordionInfo;
