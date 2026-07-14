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

          <ResultCard estimate={estimate} floorArea={formState.floorArea} />
        </div>
      </div>
    </div>
  );
}

export default CalculatorPage;
