export enum UnitCategory {
  WEIGHT = 'Weight',
  VOLUME = 'Volume',
  LENGTH = 'Length',
  AREA = 'Area',
  TEMPERATURE = 'Temperature',
  TIME = 'Time',
  MASS = 'Mass',
  PRESSURE = 'Pressure',
  ENERGY = 'Energy',
  SPEED = 'Speed',
  ANGLE = 'Angle',
  OTHER = 'Other',
}

export const UnitInitialState = {
  code: '',
  name: '',
  description: '',
  symbol: '',
  conversion_factor: 0,
  base_unit: false,
  category: UnitCategory.WEIGHT,
};

export interface UnitProperty {
  code: string;
  name: string;
  description?: string;
  symbol: string;
  conversion_factor: number | string | null;
  base_unit: boolean;
  category: UnitCategory;
}
