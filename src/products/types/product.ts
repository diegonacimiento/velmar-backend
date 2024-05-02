export enum Size {
  XS = 'XS',
  S = 'S',
  M = 'M',
  L = 'L',
  XL = 'XL',
  '2XL' = '2XL',
  '3XL' = '3XL',
}

export interface ImageProduct {
  color: string;
  urls: string[];
  sizes: Size[];
}
