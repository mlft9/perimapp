import { useState, useEffect } from 'react';
import type { Product } from './types';
import { loadProducts, saveProducts, deleteProduct as deleteProductFromStorage } from './services/storage';
import { getExpirationStatus } from './utils/dateUtils';
import BarcodeScanner from './components/BarcodeScanner';
import AddProductForm from './components/AddProductForm';
import ProductCard from './components/ProductCard';
import './App.css';

type FilterType = 'all' | 'good' | 'warning' | 'expired';

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showScanner, setShowScanner] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [scannedBarcode, setScannedBarcode] = useState<string>('');
  const [filter, setFilter] = useState<FilterType>('all');

  useEffect(() => {
    const loadedProducts = loadProducts();
    setProducts(loadedProducts);
  }, []);

  const handleScan = (barcode: string) => {
    setScannedBarcode(barcode);
    setShowScanner(false);
    setShowForm(true);
  };

  const handleAddProduct = (product: Product) => {
    const updatedProducts = [...products, product];
    setProducts(updatedProducts);
    saveProducts(updatedProducts);
    setShowForm(false);
    setScannedBarcode('');
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      deleteProductFromStorage(id);
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const getFilteredProducts = () => {
    if (filter === 'all') return products;
    return products.filter(p => getExpirationStatus(p.expirationDate) === filter);
  };

  const filteredProducts = getFilteredProducts();

  const stats = {
    total: products.length,
    expired: products.filter(p => getExpirationStatus(p.expirationDate) === 'expired').length,
    warning: products.filter(p => getExpirationStatus(p.expirationDate) === 'warning').length,
    good: products.filter(p => getExpirationStatus(p.expirationDate) === 'good').length,
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🧊 PerimApp</h1>
        <p className="subtitle">Gérez les dates de péremption de votre frigo</p>
      </header>

      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total</div>
        </div>
        <div className="stat-card good">
          <div className="stat-value">{stats.good}</div>
          <div className="stat-label">Bon état</div>
        </div>
        <div className="stat-card warning">
          <div className="stat-value">{stats.warning}</div>
          <div className="stat-label">À consommer</div>
        </div>
        <div className="stat-card expired">
          <div className="stat-value">{stats.expired}</div>
          <div className="stat-label">Expirés</div>
        </div>
      </div>

      <div className="filters">
        <button 
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          Tous
        </button>
        <button 
          className={filter === 'good' ? 'active' : ''}
          onClick={() => setFilter('good')}
        >
          Bons
        </button>
        <button 
          className={filter === 'warning' ? 'active' : ''}
          onClick={() => setFilter('warning')}
        >
          À consommer
        </button>
        <button 
          className={filter === 'expired' ? 'active' : ''}
          onClick={() => setFilter('expired')}
        >
          Expirés
        </button>
      </div>

      <div className="actions">
        <button className="btn-scan" onClick={() => setShowScanner(true)}>
          📷 Scanner un code-barres
        </button>
        <button className="btn-manual" onClick={() => setShowForm(true)}>
          ➕ Ajouter manuellement
        </button>
      </div>

      <div className="products-list">
        {filteredProducts.length === 0 ? (
          <div className="empty-state">
            <p>😊 Aucun produit pour le moment</p>
            <p className="empty-hint">
              Commencez par scanner un code-barres ou ajouter un produit manuellement
            </p>
          </div>
        ) : (
          filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onDelete={handleDeleteProduct}
            />
          ))
        )}
      </div>

      {showScanner && (
        <BarcodeScanner
          onScan={handleScan}
          onClose={() => setShowScanner(false)}
        />
      )}

      {showForm && (
        <AddProductForm
          barcode={scannedBarcode}
          onAdd={handleAddProduct}
          onCancel={() => {
            setShowForm(false);
            setScannedBarcode('');
          }}
        />
      )}
    </div>
  );
}

export default App;
