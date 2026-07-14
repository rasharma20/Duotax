function OptionButtonGroup({
  label,
  value,
  options,
  onChange,
  rounded = 'full',
}) {
  const roundedClass = rounded === 'lg' ? 'rounded-lg' : 'rounded-full';

  return (
    <div>
      <label className="mb-3 block text-sm font-semibold uppercase tracking-wider text-[#64748B]">
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isActive = option === value;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              className={`px-5 py-2.5 text-sm transition-all ${roundedClass} ${
                isActive
                  ? 'border-2 border-[#E27D24] bg-[#FDF2E9] font-bold text-[#E27D24]'
                  : 'border border-[#E2E8F0] bg-white text-[#64748B] hover:border-[#CBD5E1]'
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default OptionButtonGroup;
