import {
  BEDROOM_EXTRA,
  DUCTED_AC_COST,
  FINISH_MULTIPLIERS,
  FLOORS_EXTRA,
  STATE_BASE_RATES,
} from './constants';

export function calculateEstimate(inputState) {
  const baseRateStandard = STATE_BASE_RATES[inputState.state] ?? 2100;
  const finishMultiplier = FINISH_MULTIPLIERS[inputState.finishLevel] ?? 1;
  const baseRate = Math.round(baseRateStandard * finishMultiplier);

  const floorArea = Number(inputState.floorArea) || 0;
  const bedrooms = Number(inputState.bedrooms) || 0;
  const floors = Number(inputState.floors) || 0;

  const baseBuildCost = Math.round(floorArea * baseRate);
  const bedroomsExtra = Math.max(0, bedrooms - 1) * BEDROOM_EXTRA;
  const floorsExtra = floors > 1 ? FLOORS_EXTRA : 0;
  const ductedCost = inputState.ductedAC ? DUCTED_AC_COST : 0;

  const total = baseBuildCost + bedroomsExtra + floorsExtra + ductedCost;

  return {
    low: Math.round(total * 0.91),
    mid: Math.round(total),
    high: Math.round(total * 1.09),
    baseBuildCost,
    ductedCost,
    total,
    baseRate,
  };
}
