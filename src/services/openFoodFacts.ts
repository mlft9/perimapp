import type { OpenFoodFactsProduct } from '../types';

export const fetchProductByBarcode = async (barcode: string): Promise<OpenFoodFactsProduct | null> => {
  try {
    const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
    const data: OpenFoodFactsProduct = await response.json();
    
    if (data.status === 1) {
      return data;
    }
    return null;
  } catch (error) {
    console.error('Erreur lors de la récupération du produit:', error);
    return null;
  }
};
