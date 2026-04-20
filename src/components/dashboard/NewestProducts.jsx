// src/components/dashboard/NewestProducts.jsx
import { FiStar } from "react-icons/fi";

const TopProductItem = ({ product }) => (
  <tr style={{ transition: '0.2s' }}>
    <td className="px-4 py-3">
        <div className="d-flex align-items-center">
            <img src={product.img || "https://placehold.co/100"} alt={product.name} className="rounded-3 shadow-sm me-3 border" style={{ width: '48px', height: '48px', objectFit: 'cover' }} />
            <div>
                <div className="fw-bold text-dark">{product.name}</div>
                <div className="text-muted" style={{ fontSize: '0.8rem' }}>Mã SP: #{product.id}</div>
            </div>
        </div>
    </td>
    <td className="text-center fw-bold text-dark fs-6">${Number(product.price).toFixed(2)}</td>
    <td className="text-center">
      <span className="badge bg-warning bg-opacity-10 text-warning px-3 py-2 rounded-pill fw-bold"><FiStar className="me-1 mb-1" />{product.rating || 5}</span>
    </td>
    <td>
      <span className={`badge rounded-pill px-3 py-2 fw-bold ${product.status === 'active' || product.status === 'Còn hàng' ? 'bg-success bg-opacity-10 text-success' : 'bg-secondary bg-opacity-10 text-secondary'}`}>
        {product.status === 'active' ? 'Đang bán' : product.status}
      </span>
    </td>
  </tr>
);

export const NewestProducts = ({ newestProducts }) => {
  return (
    <div className="card border-0 bg-white overflow-hidden h-100 shadow-sm" style={{ borderRadius: '20px' }}>
      <div className="card-header bg-white border-bottom-0 p-4 pb-2 d-flex justify-content-between align-items-center">
          <h6 className="fw-bolder text-dark m-0">Sản Phẩm Mới Nhất</h6>
      </div>
      <div className="card-body p-0">
        <div className="table-responsive px-2 pb-2">
          <table className="table align-middle mb-0 table-borderless table-hover">
            <thead>
              <tr>
                {['Sản phẩm', 'Giá', 'Đánh Giá', 'Trạng Thái'].map((head, i) => (
                  <th key={i} className={`py-3 ${i===0?'px-4':''} text-muted small fw-semibold text-uppercase ${i===1||i===2?'text-center':''}`}>{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {newestProducts.map(item => <TopProductItem key={item.id} product={item} />)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};