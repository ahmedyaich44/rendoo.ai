export type ActivityRow = {
  id: string;
  title: string;
  location_name: string;
  city: string;
  country: string;
  category: string;
  image_url: string | null;
};

export type ActivitySlotRow = {
  id: string;
  starts_at: string;
  ends_at: string;
  spots_left: number;
  price: number;
  currency: string;
};

