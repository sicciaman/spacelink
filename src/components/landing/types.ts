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