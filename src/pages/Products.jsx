// src/pages/Products.jsx
import { useState } from "react";
import { FiPlus, FiEdit, FiSearch, FiX, FiRefreshCcw, FiFilter } from "react-icons/fi";
import Swal from 'sweetalert2'; 
import AddProductForm from "../components/AddProductForm";
import EditProductForm from "../components/EditProductForm";

// 🚀 Chỉ import Custom Hook của chúng ta
import { useProducts } from "../hooks/useProducts";

const Products = () => {
  // Quản lý trạng thái UI (Form, Tìm kiếm)
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // 🚀 Gọi Hook: Lấy toàn bộ Data và Logic từ Hook ra
  const { products, categoryStructure, isLoading, addProduct, updateProduct } = useProducts();

  // Gọi Hook Thêm
  const handleAddProduct = async (newProduct) => {
    const success = await addProduct(newProduct);
    if (success) setShowForm(false);
  };

  // Gọi Hook Sửa
  const handleUpdateProduct = async (updatedProduct) => {
    const success = await updateProduct(updatedProduct.id, updatedProduct);
    if (success) setEditingProduct(null);
  };

  // Các hàm Confirm UI vẫn giữ ở đây, sau khi confirm xong thì gọi hàm updateProduct của Hook
  const handleToggleStatus = (product, newStatus, title, text, confirmBtn, successMsg) => {
    Swal.fire({
      title, text, icon: newStatus === 'inactive' ? 'warning' : 'info',
      showCancelButton: true, confirmButtonColor: newStatus === 'inactive' ? '#ef4444' : '#22c55e', cancelButtonColor: '#94a3b8',
      confirmButtonText: confirmBtn, cancelButtonText: 'Hủy'
    }).then((result) => {
      if (result.isConfirmed) {
        updateProduct(product.id, { ...product, status: newStatus }, successMsg);
      }
    });
  };

  // Lọc dữ liệu
  const allSubCategories = categoryStructure ? ["All", ...Object.values(categoryStructure).flat()] : ["All"];
  const filteredProducts = products.filter((product) => {
    const matchSearch = searchTerm.trim() === "" || product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.id.toString().includes(searchTerm);
    const matchCategory = selectedCategory === "All" || product.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  // Render Loader
  if (isLoading) return <div className="p-5 text-center text-muted fw-bold">Đang tải dữ liệu sản phẩm...</div>;

  // Render Forms
  if (showForm) return <AddProductForm onClose={() => setShowForm(false)} onAddProduct={handleAddProduct} products={products} categoryStructure={categoryStructure} />;
  if (editingProduct) return <EditProductForm product={editingProduct} onClose={() => setEditingProduct(null)} onUpdateProduct={handleUpdateProduct} products={products} categoryStructure={categoryStructure} />;

  // Render UI Chính (Giữ nguyên cấu trúc HTML/CSS cũ của bạn)
  return (
    <div className="container-fluid p-0 animate-fade-up">
      <div className="d-flex justify-content-between align-items-center mb-4 px-3">
        <div><h4 className="fw-bold text-dark m-0" style={{ fontSize: '1.25rem' }}>DANH SÁCH SẢN PHẨM</h4></div>
        
        <div className="d-flex gap-3">
          <div className="input-group shadow-sm" style={{ width: '220px', borderRadius: '12px', overflow: 'hidden' }}>
            <span className="input-group-text bg-white border-0 text-muted"><FiFilter /></span>
            <select 
              className="form-select border-0 bg-white shadow-none fw-medium text-dark cursor-pointer"
              value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} style={{ appearance: 'none' }}
            >
              {allSubCategories.map(cat => (<option key={cat} value={cat}>{cat === "All" ? "Tất cả danh mục" : cat}</option>))}
            </select>
          </div>

          <div className="input-group shadow-sm" style={{ width: '300px', borderRadius: '12px', overflow: 'hidden' }}>
            <span className="input-group-text bg-white border-0 text-muted"><FiSearch /></span>
            <input 
              type="text" className="form-control border-0 bg-white shadow-none" placeholder="Tìm theo tên hoặc Mã SP..." 
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="card-modern overflow-hidden bg-white shadow-sm border-0" style={{ borderRadius: '20px' }}>
        <div className="d-flex justify-content-between align-items-center p-4 border-bottom border-light">
          <h6 className="card-title m-0 fw-bold text-dark">
            {searchTerm || selectedCategory !== "All" ? `Đang lọc...` : "Tất cả sản phẩm"}
          </h6>
          <button onClick={() => setShowForm(true)} className="btn text-white fw-medium d-flex align-items-center px-4 py-2 rounded-pill shadow-sm border-0" style={{backgroundColor: '#ff6b35'}}>
            <FiPlus className="me-2 fs-5" /> Thêm sản phẩm
          </button>
        </div>

        <div className="card-body p-0">
          <div className="table-responsive px-2 pb-2">
            <table className="table table-custom table-hover table-borderless align-middle mb-0 mt-2">
              <thead>
                <tr className="border-bottom border-light">
                  <th className="py-3 px-4">SẢN PHẨM</th>
                  <th className="py-3 text-center">GIÁ BÁN</th>
                  <th className="py-3">TỒN KHO</th>
                  <th className="py-3">DANH MỤC</th>
                  <th className="py-3">TRẠNG THÁI</th>
                  <th className="py-3 text-center">THAO TÁC</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                    <tr><td colSpan="6" className="text-center py-5 text-muted">Không có sản phẩm nào.</td></tr>
                ) : (
                    filteredProducts.map((item) => {
                      const isInactive = item.status === 'inactive';
                      return (
                        <tr key={item.id} style={{ transition: '0.3s', opacity: isInactive ? 0.6 : 1, backgroundColor: isInactive ? '#f8fafc' : 'transparent' }}>
                            <td className="px-4 py-3">
                              <div className="d-flex align-items-center">
                                  <img src={item.img} alt={item.name} className="rounded-4 shadow-sm border" style={{ width: '48px', height: '48px', objectFit: 'cover', filter: isInactive ? 'grayscale(100%)' : 'none' }} onError={(e) => { e.target.src = "https://placehold.co/100?text=No+Image" }}/>
                                  <div className="ms-3">
                                      <div className={`fw-bold ${isInactive ? 'text-muted text-decoration-line-through' : 'text-dark'}`}>{item.name}</div>
                                      <div className="text-muted small">Mã SP: #{item.id}</div>
                                  </div>
                              </div>
                            </td>
                            <td className="text-center fw-bolder text-primary">${Number(item.price).toFixed(2)}</td>
                            <td><div className={`fw-bold ${item.stockCount > 0 ? 'text-success' : 'text-danger'}`}>{item.stockCount} Cái</div></td>
                            <td><span className="badge bg-light text-secondary rounded-pill px-3 py-2 border border-light fw-bold">{item.category}</span></td>
                            <td><span className={`badge rounded-pill px-3 py-2 fw-bold ${isInactive ? 'bg-secondary bg-opacity-10 text-secondary' : 'bg-success bg-opacity-10 text-success'}`}>{isInactive ? 'Ngừng bán' : 'Đang bán'}</span></td>
                            <td className="text-center">
                              <div className="d-flex justify-content-center gap-2">
                                  <button onClick={() => setEditingProduct(item)} className="btn btn-sm btn-light border-0 shadow-sm rounded-circle text-primary p-2"><FiEdit size={15} /></button>
                                  {!isInactive ? (
                                    <button onClick={() => handleToggleStatus(item, 'inactive', 'Ngưng bán?', 'Sản phẩm sẽ bị ẩn.', 'Đồng ý', 'Đã ngưng bán!')} className="btn btn-sm btn-light border-0 shadow-sm rounded-circle text-danger p-2"><FiX size={15} /></button>
                                  ) : (
                                    <button onClick={() => handleToggleStatus(item, 'active', 'Khôi phục?', 'Sản phẩm sẽ hiển thị lại.', 'Khôi phục', 'Đã khôi phục!')} className="btn btn-sm btn-light border-0 shadow-sm rounded-circle text-success p-2"><FiRefreshCcw size={15} /></button>
                                  )}
                              </div>
                            </td>
                        </tr>
                      );
                    })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;