import { useState } from 'react';
import type { Product } from '../types';
import { fetchProductByBarcode } from '../services/openFoodFacts';
import './AddProductForm.css';

interface AddProductFormProps {
  barcode?: string;
  onAdd: (product: Product) => void;
  onCancel: () => void;
}

const AddProductForm = ({ barcode = '', onAdd, onCancel }: AddProductFormProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    barcode,
    name: '',
    brand: '',
    imageUrl: '',
    expirationDate: '',
    quantity: 1,
  });

  const handleFetchProduct = async () => {
    if (!formData.barcode) return;
    
    setLoading(true);
    const productData = await fetchProductByBarcode(formData.barcode);
    setLoading(false);

    if (productData && productData.product) {
      setFormData(prev => ({
        ...prev,
        name: productData.product.product_name || prev.name,
        brand: productData.product.brands || prev.brand,
        imageUrl: productData.product.image_url || prev.imageUrl,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.expirationDate) {
      alert('Veuillez remplir les champs obligatoires');
      return;
    }

    const product: Product = {
      id: Date.now().toString(),
      barcode: formData.barcode,
      name: formData.name,
      brand: formData.brand || undefined,
      imageUrl: formData.imageUrl || undefined,
      expirationDate: formData.expirationDate,
      addedDate: new Date().toISOString(),
      quantity: formData.quantity,
    };

    onAdd(product);
  };

  return (
    <div className="form-overlay">
      <div className="form-container">
        <div className="form-header">
          <h2>Ajouter un produit</h2>
          <button className="close-btn" onClick={onCancel}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Code-barres</label>
            <div className="barcode-input-group">
              <input
                type="text"
                value={formData.barcode}
                onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                placeholder="Entrez le code-barres"
              />
              <button
                type="button"
                onClick={handleFetchProduct}
                disabled={loading || !formData.barcode}
                className="fetch-btn"
              >
                {loading ? '⏳' : '🔍'}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Nom du produit *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Lait demi-écrémé"
              required
            />
          </div>

          <div className="form-group">
            <label>Marque</label>
            <input
              type="text"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              placeholder="Ex: Lactalis"
            />
          </div>

          <div className="form-group">
            <label>URL de l'image</label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date de péremption *</label>
              <input
                type="date"
                value={formData.expirationDate}
                onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Quantité</label>
              <input
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn-cancel">
              Annuler
            </button>
            <button type="submit" className="btn-submit">
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductForm;
