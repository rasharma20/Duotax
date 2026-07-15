import { useMemo, useState } from 'react';
import AccordionInfo from './components/AccordionInfo';
import DuctedToggle from './components/DuctedToggle';
import OptionButtonGroup from './components/OptionButtonGroup';
import ResultCard from './components/ResultCard';
import {
  DEFAULT_STATE,
  FINISH_LEVEL_OPTIONS,
  PROPERTY_TYPE_OPTIONS,
  STATE_OPTIONS,
  WALL_TYPE_OPTIONS,
} from './model/constants';
import { calculateEstimate } from './model/calculateEstimate';

function NumericRow({ label, value, onChange, suffix }) {
  return (
    <div className="flex items-center justify-between">
      <label className="text-sm font-semibold text-[#1E293B]">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={value}
          min={0}
          onChange={(event) => onChange(Math.max(0, Number(event.target.value) || 0))}
          className="w-20 rounded-md border border-[#E2E8F0] px-2 py-1.5 text-right font-bold"
        />
        {suffix ? <span className="text-sm font-medium text-[#64748B]">{suffix}</span> : null}
      </div>
    </div>
  );
}

function buildSummary(state) {
  const chunks = [];
  if (state.state) chunks.push(`State: ${state.state}`);
  if (state.propertyType) chunks.push(`Property: ${state.propertyType}`);
  if (state.finishLevel) chunks.push(`Finish: ${state.finishLevel}`);
  if (state.wallType) chunks.push(`Wall: ${state.wallType}`);
  chunks.push(`Year: ${state.completionYear || '-'};`);
  chunks.push(`Area: ${state.floorArea} m2;`);
  chunks.push(`Bedrooms: ${state.bedrooms};`);
  chunks.push(`Floors: ${state.floors};`);
  return chunks.join(' ');
}

function CalculatorPage() {
  const [formState, setFormState] = useState(DEFAULT_STATE);
  const [openAccordionId, setOpenAccordionId] = useState(null);
  const [isReportModalOpen, setReportModalOpen] = useState(false);
  const [reportEmail, setReportEmail] = useState('');
  const [reportRequested, setReportRequested] = useState(false);

  const estimate = useMemo(() => calculateEstimate(formState), [formState]);

  const years = useMemo(() => {
    const vals = [];
    for (let year = 1970; year <= 2030; year += 1) {
      vals.push(String(year));
    }
    return vals;
  }, []);

  const updateField = (field, value) => {
    setFormState((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const toggleAccordion = (id) => {
    setOpenAccordionId((current) => (current === id ? null : id));
  };

  const openReportModal = () => {
    setReportEmail('');
    setReportRequested(false);
    setReportModalOpen(true);
  };

  const closeReportModal = () => {
    setReportModalOpen(false);
  };

  const submitReportRequest = () => {
    setReportRequested(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-4 py-12 font-sans text-[#1E293B] antialiased sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-[#0F172A] sm:text-5xl">
            Construction cost <span className="text-[#E27D24]">calculator</span>
          </h1>
          <p className="mt-3 text-lg text-[#64748B]">Estimate your build cost across Australian states</p>
        </header>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          <main className="space-y-8 lg:col-span-7">
            <OptionButtonGroup
              label="Investment Property State"
              value={formState.state}
              options={STATE_OPTIONS}
              onChange={(value) => updateField('state', value)}
            />

            <OptionButtonGroup
              label="Investment Property Type"
              value={formState.propertyType}
              options={PROPERTY_TYPE_OPTIONS}
              rounded="lg"
              onChange={(value) => updateField('propertyType', value)}
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-3 block text-sm font-semibold uppercase tracking-wider text-[#64748B]">
                  Construction Completion Year
                </label>
                <select
                  value={formState.completionYear}
                  onChange={(event) => updateField('completionYear', event.target.value)}
                  className="w-full rounded-lg border border-[#E2E8F0] bg-white px-4 py-3 font-medium text-[#0F172A] transition-colors focus:border-[#E27D24] focus:outline-none"
                >
                  <option value="">Select Year</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-3 block text-sm font-semibold uppercase tracking-wider text-[#64748B]">
                  Spec / finish level
                </label>
                <div className="flex h-12.5 gap-2">
                  {FINISH_LEVEL_OPTIONS.map((option) => {
                    const active = option === formState.finishLevel;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => updateField('finishLevel', option)}
                        className={`flex-1 rounded-lg text-sm ${
                          active
                            ? 'border-2 border-[#E27D24] bg-[#FDF2E9] font-bold text-[#E27D24]'
                            : 'border border-[#E2E8F0] bg-white text-[#64748B]'
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="max-w-md space-y-4">
              <NumericRow
                label="Floor Area (M2)"
                value={formState.floorArea}
                onChange={(value) => updateField('floorArea', value)}
                suffix="(M2)"
              />
              <NumericRow
                label="Number of Bedrooms?"
                value={formState.bedrooms}
                onChange={(value) => updateField('bedrooms', value)}
              />
              <NumericRow
                label="Number of Floors?"
                value={formState.floors}
                onChange={(value) => updateField('floors', value)}
              />
            </div>

            <OptionButtonGroup
              label="Wall Type"
              value={formState.wallType}
              options={WALL_TYPE_OPTIONS}
              rounded="lg"
              onChange={(value) => updateField('wallType', value)}
            />

            <DuctedToggle
              enabled={formState.ductedAC}
              onToggle={() => updateField('ductedAC', !formState.ductedAC)}
            />

            <AccordionInfo
              openId={openAccordionId}
              onToggle={toggleAccordion}
              summaryText={buildSummary(formState)}
            />
          </main>

          <ResultCard
            estimate={estimate}
            floorArea={formState.floorArea}
            onOrderReport={openReportModal}
          />
        </div>

        {isReportModalOpen ? (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/60 px-4 py-10"
            onClick={closeReportModal}
          >
            <div
              className="w-full max-w-2xl rounded-[2rem] bg-white p-6 shadow-2xl shadow-slate-900/10 max-h-[calc(100vh-4rem)] overflow-y-auto"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Initial Cost Report</p>
                  <h2 className="mt-2 text-3xl font-extrabold text-[#0F172A]">Request a sample report</h2>
                  <p className="mt-2 text-sm text-[#64748B]">
                    This is a demo request flow. We will show a sample report summary based on your current estimate.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeReportModal}
                  className="rounded-full border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
                >
                  Close
                </button>
              </div>

              {reportRequested ? (
                <div className="space-y-4 rounded-3xl border border-[#E2E8F0] bg-[#F8FAFC] p-6 text-center">
                  <p className="text-sm font-bold uppercase tracking-wider text-[#64748B]">Request sent</p>
                  <h3 className="text-2xl font-extrabold text-[#0F172A]">Thanks for requesting your report.</h3>
                  <p className="text-sm text-[#475569]">
                    We have saved your report request. This demo confirms the current estimate values and can be used as a placeholder for a real report flow.
                  </p>
                  {reportEmail ? (
                    <p className="text-sm text-[#475569]">A confirmation will be sent to <span className="font-semibold text-[#0F172A]">{reportEmail}</span>.</p>
                  ) : null}
                  <button
                    type="button"
                    onClick={closeReportModal}
                    className="mt-4 rounded-2xl bg-[#E27D24] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#c9691b]"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="rounded-3xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Current estimate</p>
                      <p className="mt-3 text-3xl font-extrabold text-[#0F172A]">{estimate.mid ? `$${estimate.mid.toLocaleString()}` : '-'}</p>
                      <p className="mt-2 text-sm text-[#64748B]">Mid estimate based on your current selections.</p>
                    </div>
                    <div className="rounded-3xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Floor area</p>
                      <p className="mt-3 text-3xl font-extrabold text-[#0F172A]">{formState.floorArea} m2</p>
                      <p className="mt-2 text-sm text-[#64748B]">Using the value from your inputs.</p>
                    </div>
                  </div>

                  <div className="grid gap-3 rounded-3xl border border-[#E2E8F0] bg-white p-4 text-sm text-[#475569] md:grid-cols-2">
                    <div>
                      <p className="font-semibold text-[#0F172A]">State</p>
                      <p>{formState.state || 'Not selected'}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-[#0F172A]">Property type</p>
                      <p>{formState.propertyType || 'Not selected'}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-[#0F172A]">Finish level</p>
                      <p>{formState.finishLevel || 'Not selected'}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-[#0F172A]">Wall type</p>
                      <p>{formState.wallType || 'Not selected'}</p>
                    </div>
                  </div>

                  <div className="space-y-2 rounded-3xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Estimated totals</p>
                    <div className="flex justify-between text-sm text-[#475569]"><span>Low</span><span>{estimate.low ? `$${estimate.low.toLocaleString()}` : '-'}</span></div>
                    <div className="flex justify-between text-sm text-[#475569]"><span>Mid</span><span>{estimate.mid ? `$${estimate.mid.toLocaleString()}` : '-'}</span></div>
                    <div className="flex justify-between text-sm text-[#475569]"><span>High</span><span>{estimate.high ? `$${estimate.high.toLocaleString()}` : '-'}</span></div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-[#334155]">Email address</label>
                    <input
                      type="email"
                      value={reportEmail}
                      onChange={(event) => setReportEmail(event.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-2xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#0F172A] outline-none transition focus:border-[#E27D24]"
                    />
                    <p className="text-xs text-[#64748B]">
                      Optional demo email. We will not send a real message in this sample flow.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={closeReportModal}
                      className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={submitReportRequest}
                      className="rounded-2xl bg-[#E27D24] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#c9691b]"
                    >
                      Request sample report
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default CalculatorPage;
