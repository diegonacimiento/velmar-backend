export enum Size {
  XS = 'XS',
  S = 'S',
  M = 'M',
  L = 'L',
  XL = 'XL',
  '2XL' = '2XL',
  '3XL' = '3XL',
  'T-35' = 35,
  'T-36' = 36,
  'T-37' = 37,
  'T-38' = 38,
  'T-39' = 39,
  'T-40' = 40,
  'T-41' = 41,
  'T-42' = 42,
  'T-43' = 43,
  'T-44' = 44,
}

export interface ImageProduct {
  color: string;
  urls: string[];
  sizes: Size[];
}
