import { useForm } from "react-hook-form";
import { FiX, FiSave, FiImage, FiInfo } from "react-icons/fi";

// 🚀 ĐÃ SỬA: Nhận thêm prop categoryStructure từ component cha
const EditProductForm = ({ product, onClose, onUpdateProduct, products = [], categoryStructure = {} }) => {
  
  // Lấy danh sách các danh mục chính (Áo, Quần...) từ dữ liệu động truyền vào
  const categories = Object.keys(categoryStructure);

  // Tìm danh mục cha của sản phẩm hiện tại
  let initialCategory = categories.length > 0 ? categories[0] : "";
  for (const [key, values] of Object.entries(categoryStructure)) {
    if (values.includes(product.category)) {
      initialCategory = key;
      break;
    }
  }

  const { 
    register, 
    handleSubmit, 
    watch, 
    setValue,
    formState: { errors } 
  } = useForm({
    defaultValues: {
      productName: product.name,
      description: product.desc_text || product.desc || "",
      price: product.price,
      stock: product.stockCount,
      category: initialCategory,
      subCategory: product.category,
      status: product.status || "active",
      img: product.img || ""
    }
  });

  const selectedCategory = watch("category");
  const imageUrl = watch("img");

  const onSubmit = (data) => {
    const updatedProduct = {
      ...product, 
      name: data.productName.trim(),
      desc_text: data.description.trim(),
      price: parseFloat(data.price),
      stockCount: parseInt(data.stock),
      category: data.subCategory,
      status: data.status,
      img: data.img.trim()
    };

    onUpdateProduct(updatedProduct);
  };

  return (
    <div className="container-fluid p-0" style={{ animation: 'fadeIn 0.3s ease' }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        
        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4 px-3">
          <div>
            <h4 className="fw-bold text-dark m-0" style={{ fontSize: '1.25rem' }}>SỬA SẢN PHẨM</h4>
            <p className="text-muted small m-0">Cập nhật thông tin cho mã SP #{product.id}</p>
          </div>
          <div className="d-flex gap-2">
            <button type="button" onClick={onClose} className="btn btn-light btn-modern px-4 py-2 d-flex align-items-center fw-medium border text-muted">
              <FiX className="me-2 fs-5" /> Hủy bỏ
            </button>
            <button type="submit" className="btn btn-primary btn-modern text-white px-4 py-2 d-flex align-items-center shadow-sm fw-medium border-0" style={{ backgroundColor: '#ff6b35' }}>
              <FiSave className="me-2 fs-5" /> Cập nhật
            </button>
          </div>
        </div>

        {/* NỘI DUNG FORM CHÍNH */}
        <div className="row g-4 mx-1">
          {/* CỘT TRÁI */}
          <div className="col-12 col-lg-8">
            <div className="card-modern rounded-4 p-4 mb-4 bg-white shadow-sm border-0">
              <h6 className="fw-bold text-dark mb-4">Thông tin chung</h6>
              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted text-uppercase">Tên sản phẩm <span className="text-danger">*</span></label>
                <input 
                  type="text" 
                  {...register("productName", { 
                    required: "Tên sản phẩm không được để trống",
                    minLength: { value: 5, message: "Tên phải có ít nhất 5 ký tự" },
                    maxLength: { value: 100, message: "Tên quá dài (tối đa 100 ký tự)" },
                    validate: {
                      isUnique: (value) => {
                        const isDuplicate = products.some(p => p.id !== product.id && p.name.toLowerCase() === value.trim().toLowerCase());
                        return !isDuplicate || "Tên sản phẩm này đã được sử dụng cho một sản phẩm khác!";
                      }
                    }
                  })}
                  className={`form-control bg-light border-0 ${errors.productName ? 'is-invalid' : ''}`} 
                />
                {errors.productName && <div className="text-danger small mt-1">{errors.productName.message}</div>}
              </div>
              
              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted text-uppercase">Mô tả sản phẩm <span className="text-danger">*</span></label>
                <textarea 
                  {...register("description", {
                    required: "Mô tả không được để trống",
                    minLength: { value: 10, message: "Vui lòng nhập mô tả chi tiết hơn" }
                  })}
                  className={`form-control bg-light border-0 ${errors.description ? 'is-invalid' : ''}`} 
                  rows="5"
                ></textarea>
                {errors.description && <div className="text-danger small mt-1">{errors.description.message}</div>}
              </div>

              <div className="mb-2 mt-4">
                <label className="form-label small fw-semibold text-muted text-uppercase">Trạng thái sản phẩm <span className="text-danger">*</span></label>
                <div className="d-flex gap-4 mt-2">
                  <div className="form-check custom-radio">
                    <input className="form-check-input" type="radio" value="active" id="editStatusActive" {...register("status", { required: "Vui lòng chọn trạng thái" })} />
                    <label className="form-check-label fw-medium text-dark cursor-pointer" htmlFor="editStatusActive">Đang bán</label>
                  </div>
                  <div className="form-check custom-radio">
                    <input className="form-check-input" type="radio" value="inactive" id="editStatusDraft" {...register("status", { required: "Vui lòng chọn trạng thái" })} />
                    <label className="form-check-label fw-medium text-muted cursor-pointer" htmlFor="editStatusDraft">Bản nháp / Ngừng bán</label>
                  </div>
                </div>
                {errors.status && <div className="text-danger small mt-1">{errors.status.message}</div>}
              </div>
            </div>

            <div className="card-modern rounded-4 p-4 bg-white shadow-sm border-0">
              <h6 className="fw-bold text-dark mb-4">Giá & Kho hàng</h6>
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-muted text-uppercase">Giá bán ($) <span className="text-danger">*</span></label>
                  <input 
                    type="number" step="0.01"
                    {...register("price", { 
                      required: "Giá bán không được để trống", 
                      min: { value: 0.1, message: "Giá bán phải lớn hơn 0" },
                      max: { value: 50000, message: "Giá bán không hợp lý" }
                    })}
                    className={`form-control bg-light border-0 text-primary fw-bold ${errors.price ? 'is-invalid' : ''}`} 
                  />
                  {errors.price && <div className="text-danger small mt-1">{errors.price.message}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-muted text-uppercase">Số lượng kho <span className="text-danger">*</span></label>
                  <input 
                    type="number" 
                    {...register("stock", { 
                      required: "Số lượng không được để trống", 
                      min: { value: 0, message: "Số lượng không được âm" },
                      max: { value: 10000, message: "Số lượng vượt quá sức chứa" }
                    })}
                    className={`form-control bg-light border-0 fw-medium text-success ${errors.stock ? 'is-invalid' : ''}`} 
                  />
                  {errors.stock && <div className="text-danger small mt-1">{errors.stock.message}</div>}
                </div>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI */}
          <div className="col-12 col-lg-4">
            <div className="card-modern rounded-4 p-4 mb-4 bg-white shadow-sm border-0">
              <h6 className="fw-bold text-dark mb-4">Hình ảnh sản phẩm</h6>
              
              <div className="mb-3 text-center">
                {imageUrl ? (
                  <img 
                    src={imageUrl} 
                    alt="Preview" 
                    className="img-fluid rounded-4 shadow-sm border mb-3" 
                    style={{ maxHeight: '220px', width: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.target.src = "https://placehold.co/400x400?text=Link+Anh+Loi"; }}
                  />
                ) : (
                  <div className="bg-light rounded-4 d-flex flex-column align-items-center justify-content-center mb-3" style={{ height: '220px', border: '2px dashed #dee2e6' }}>
                    <FiImage size={40} className="text-muted mb-2" />
                    <span className="text-muted small">Chưa có ảnh</span>
                  </div>
                )}
              </div>
              
              <label className="form-label small fw-semibold text-muted text-uppercase">Link hình ảnh (URL) <span className="text-danger">*</span></label>
              <input 
                type="text" 
                {...register("img", { 
                  required: "Vui lòng dán link ảnh từ web",
                  pattern: {
                    value: /^(http|https):\/\/[^ "]+$/,
                    message: "Đường dẫn không hợp lệ (Phải bắt đầu bằng http:// hoặc https://)"
                  }
                })}
                className={`form-control bg-light border-0 ${errors.img ? 'is-invalid' : ''}`} 
              />
              {errors.img && <div className="text-danger small mt-1">{errors.img.message}</div>}
              
              <div className="mt-2 text-muted" style={{ fontSize: '0.75rem' }}>
                <FiInfo className="me-1" /> Có thể xóa link cũ và dán link mới để thay đổi ảnh.
              </div>
            </div>

            <div className="card-modern rounded-4 p-4 mb-4 bg-white shadow-sm border-0">
              <h6 className="fw-bold text-dark mb-4">Phân loại</h6>
              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted text-uppercase">Danh mục chính <span className="text-danger">*</span></label>
                <select 
                  {...register("category", { 
                    required: "Vui lòng chọn danh mục",
                    // Khi đổi danh mục chính, tự động chọn phần tử đầu tiên của danh mục con tương ứng
                    onChange: (e) => setValue("subCategory", categoryStructure[e.target.value]?.[0] || "") 
                  })}
                  className={`form-select bg-light border-0 text-dark fw-medium ${errors.category ? 'is-invalid' : ''}`}
                >
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                {errors.category && <div className="text-danger small mt-1">{errors.category.message}</div>}
              </div>
              
              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted text-uppercase">Loại sản phẩm <span className="text-danger">*</span></label>
                <select 
                  {...register("subCategory", { required: "Vui lòng chọn loại" })} 
                  className={`form-select bg-light border-0 text-dark fw-medium ${errors.subCategory ? 'is-invalid' : ''}`}
                >
                  {/* Lấy mảng danh mục con dựa trên danh mục chính đang được chọn */}
                  {categoryStructure[selectedCategory]?.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                </select>
                {errors.subCategory && <div className="text-danger small mt-1">{errors.subCategory.message}</div>}
              </div>

            </div>
            
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditProductForm;