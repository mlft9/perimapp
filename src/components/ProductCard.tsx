import type { Product } from '../types';
import { getExpirationStatus, formatDate, getDaysUntilExpiration } from '../utils/dateUtils';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
  onDelete: (id: string) => void;
}

const ProductCard = ({ product, onDelete }: ProductCardProps) => {
  const status = getExpirationStatus(product.expirationDate);
  const daysUntil = getDaysUntilExpiration(product.expirationDate);

  const getStatusText = () => {
    if (status === 'expired') {
      return `Expiré depuis ${Math.abs(daysUntil)} jour(s)`;
    }
    if (status === 'warning') {
      return `Expire dans ${daysUntil} jour(s)`;
    }
    return `Expire dans ${daysUntil} jour(s)`;
  };

  return (
    <div className={`product-card ${status}`}>
      <div className="product-image">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} />
        ) : (
          <div className="placeholder-image">📦</div>
        )}
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        {product.brand && <p className="product-brand">{product.brand}</p>}
        
        <div className="product-details">
          <div className="detail-row">
            <span className="label">Quantité:</span>
            <span className="value">{product.quantity}</span>
          </div>
          <div className="detail-row">
            <span className="label">Date de péremption:</span>
            <span className="value">{formatDate(product.expirationDate)}</span>
          </div>
          <div className={`expiration-status ${status}`}>
            {getStatusText()}
          </div>
        </div>
      </div>

      <button 
        className="delete-btn"
        onClick={() => onDelete(product.id)}
        aria-label="Supprimer le produit"
      >
        🗑️
      </button>
    </div>
  );
};

export default ProductCard;
