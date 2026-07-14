function DuctedToggle({ enabled, onToggle }) {
  return (
    <div>
      <label className="mb-3 block text-sm font-semibold uppercase tracking-wider text-[#64748B]">
        Inclusions
      </label>
      <div className="flex max-w-sm items-center justify-between rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
        <div>
          <p className="text-sm font-bold text-[#0F172A]">Ducted air-conditioning</p>
          <p className="text-xs text-[#64748B]">Whole-home reverse cycle system</p>
        </div>
        <button
          type="button"
          onClick={onToggle}
          className={`relative flex h-6 w-12 items-center rounded-full p-0.5 transition-all ${
            enabled ? 'justify-end bg-[#E27D24]' : 'justify-start bg-[#E2E8F0]'
          }`}
          aria-pressed={enabled}
          aria-label="Toggle ducted air-conditioning"
        >
          <span className="h-5 w-5 rounded-full bg-white shadow-md" />
        </button>
      </div>
    </div>
  );
}

export default DuctedToggle;
