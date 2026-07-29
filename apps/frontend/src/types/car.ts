export interface CarSpecs {
  hp: number;
  zeroToHundred: string;
  topSpeed: string;
  engine: string;
}

export interface CarModelData {
  id: string;
  name: string;
  brand: string;
  year: number;
  modelPath: string;
  category: string;
  specs: CarSpecs;
  defaultColor?: string;
}

export interface ColorPreset {
  name: string;
  hex: string;
}

export interface CarShowcaseProps {
  models?: CarModelData[];
  initialCarId?: string;
  className?: string;
}
