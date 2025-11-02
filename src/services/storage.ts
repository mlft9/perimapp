import type { Product } from '../types';

const STORAGE_KEY = 'perimapp_products';

export const saveProducts = (products: Product[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
};

export const loadProducts = (): Product[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
      return [];
    }
  }
  return [];
};

export const addProduct = (product: Product): void => {
  const products = loadProducts();
  products.push(product);
  saveProducts(products);
};

export const deleteProduct = (id: string): void => {
  const products = loadProducts();
  const filtered = products.filter(p => p.id !== id);
  saveProducts(filtered);
};

export const updateProduct = (id: string, updatedProduct: Partial<Product>): void => {
  const products = loadProducts();
  const index = products.findIndex(p => p.id === id);
  if (index !== -1) {
    products[index] = { ...products[index], ...updatedProduct };
    saveProducts(products);
  }
};
