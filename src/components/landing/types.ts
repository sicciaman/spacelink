export interface PricingTier {
  name: string;
  description: string;
  url: string;
  price: number;
  bundles: {
    posts: number;
    price: number;
    savings: number;
  }[];
}

export interface StatsMetric {
  name: string;
  value: string;
  icon: any;
  description: string;
}

export interface PrimeFeature {
  title: string;
  description: string;
  standard: string;
  prime: string;
}