export const STATE_OPTIONS = ['NSW', 'VIC', 'QLD', 'ACT', 'WA', 'SA'];

export const PROPERTY_TYPE_OPTIONS = [
  'House',
  'Granny',
  'Apartment',
  'Office',
  'Warehouse',
];

export const FINISH_LEVEL_OPTIONS = ['Low', 'Standard', 'High'];

export const WALL_TYPE_OPTIONS = ['Brick Veneer', 'Double Brick', 'Concrete'];

export const DEFAULT_STATE = {
  state: 'NSW',
  propertyType: 'Granny',
  finishLevel: 'Standard',
  wallType: 'Brick Veneer',
  ductedAC: true,
  completionYear: '2020',
  floorArea: 200,
  bedrooms: 4,
  floors: 1,
};

export const STATE_BASE_RATES = {
  NSW: 2100,
  VIC: 2000,
  QLD: 1900,
  ACT: 2200,
  WA: 1950,
  SA: 1850,
};

export const FINISH_MULTIPLIERS = {
  Low: 0.9,
  Standard: 1,
  High: 1.2,
};

export const DUCTED_AC_COST = 41413;
export const BEDROOM_EXTRA = 15000;
export const FLOORS_EXTRA = 25000;
