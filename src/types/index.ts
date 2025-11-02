export interface Product {
  id: string;
  barcode: string;
  name: string;
  brand?: string;
  imageUrl?: string;
  expirationDate: string;
  addedDate: string;
  category?: string;
  quantity: number;
}

export interface OpenFoodFactsProduct {
  product: {
    product_name: string;
    brands?: string;
    image_url?: string;
    categories?: string;
  };
  status: number;
}
