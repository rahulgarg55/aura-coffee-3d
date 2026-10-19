export type CoffeeCategory =
  | "all"
  | "signature"
  | "espresso"
  | "cold"
  | "pastry"
  | "beans";

export interface CoffeeProduct {
  id: string;
  name: string;
  category: "signature" | "espresso" | "cold" | "pastry" | "beans";
  tagline: string;
  description: string;
  price: number;
  rating: number;
  reviewsCount: number;
  origin?: string;
  elevation?: string;
  process?: string;
  roastLevel?: "Light" | "Medium-Light" | "Medium" | "Dark";
  tastingNotes: string[];
  caffeineMg?: number;
  calories?: number;
  temperature: "Hot" | "Iced" | "Both" | "Ambient";
  image: string;
  popular?: boolean;
  award?: string;
}

export interface CustomCoffeeConfig {
  baseId: string;
  baseName: string;
  cupType: "crystal-glass" | "matte-ceramic" | "minimal-tumbler";
  roastLevel: "light" | "medium" | "dark";
  milkType: "whole" | "oat" | "almond" | "macadamia" | "none";
  temperature: "hot" | "iced";
  sweetness: 0 | 25 | 50 | 100;
  extraShot: boolean;
  toppings: string[];
  calculatedPrice: number;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  customizationSummary?: string;
}

export interface CoffeeOrigin {
  id: string;
  region: string;
  country: string;
  farm: string;
  altitude: string;
  varietal: string;
  process: string;
  flavorProfile: {
    acidity: number;
    sweetness: number;
    body: number;
    aroma: number;
    cleanliness: number;
  };
  notes: string[];
  story: string;
  coordinates: string;
}

export interface AtelierLocation {
  id: string;
  city: string;
  neighborhood: string;
  address: string;
  hoursWeekday: string;
  hoursWeekend: string;
  seatsTotal: number;
  seatsAvailableNow: number;
  headBarista: string;
  image: string;
  phone: string;
}

export interface ReviewItem {
  id: string;
  author: string;
  title: string;
  avatar: string;
  location: string;
  rating: number;
  date: string;
  quote: string;
  order: string;
}
