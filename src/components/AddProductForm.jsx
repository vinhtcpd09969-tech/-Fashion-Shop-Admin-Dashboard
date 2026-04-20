import { useForm } from "react-hook-form";
import { FiX, FiPackage, FiImage, FiInfo } from "react-icons/fi";

const AddProductForm = ({ onClose, onAddProduct, products = [], categoryStructure = {} }) => {
  
  // Lấy danh sách các danh mục chính từ dữ liệu động
  const categories = Object.keys(categoryStructure);

  const { 
    register, 
    handleSubmit, 
    watch, 
    setValue,
    formState: { errors } 
  } = useForm({
    defaultValues: {
      category: categories.length > 0 ? categories[0] : "",
      subCategory: categories.length > 0 ? categoryStructure[categories[0]]?.[0] : "",
      status: "active" // 🚀 Mặc định luôn là active
    }
  });

  const selectedCategory = watch("category");
  const imageUrl = watch("img");

  const onSubmit = (data) => {
    const newProduct = {
      id: Date.now(),
      name: data.productName.trim(), 
      desc_text: data.description.trim(),
      price: parseFloat(data.price),
      stockCount: parseInt(data.stock),
      category: data.subCategory, 
      status: "active", // 🚀 Ép cứng trạng thái luôn là active khi thêm mới
      img: data.img.trim() 
    };

    onAddProduct(newProduct);
  };

  return (
    <div className="container-fluid p-0" style={{ animation: 'fadeIn 0.3s ease' }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        
        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4 px-3">
          <div>
            <h4 className="fw-bold text-dark m-0" style={{ fontSize: '1.25rem' }}>THÊM SẢN PHẨM MỚI</h4>
            <p className="text-muted small m-0">Điền đầy đủ thông tin để tạo sản phẩm</p>
          </div>
          <div className="d-flex gap-2">
            <button type="button" onClick={onClose} className="btn btn-light btn-modern px-4 py-2 d-flex align-items-center fw-medium border text-muted">
              <FiX className="me-2 fs-5" /> Hủy bỏ
            </button>
            <button type="submit" className="btn btn-primary btn-modern text-white px-4 py-2 d-flex align-items-center shadow-sm fw-medium border-0" style={{ backgroundColor: '#ff6b35' }}>
              <FiPackage className="me-2 fs-5" /> Lưu sản phẩm
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
                    // CHECK TRÙNG TÊN SẢN PHẨM
                    validate: {
                      isUnique: (value) => {
                        const isDuplicate = products.some(p => p.name.toLowerCase() === value.trim().toLowerCase());
                        return !isDuplicate || "Tên sản phẩm này đã tồn tại trong hệ thống!";
                      }
                    }
                  })}
                  className={`form-control bg-light border-0 ${errors.productName ? 'is-invalid' : ''}`} 
                  placeholder="Ví dụ: Áo thun nam cotton basic" 
                />
                {errors.productName && <div className="text-danger small mt-1">{errors.productName.message}</div>}
              </div>
              
              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted text-uppercase">Mô tả sản phẩm <span className="text-danger">*</span></label>
                <textarea 
                  {...register("description", {
                    required: "Mô tả không được để trống",
                    minLength: { value: 10, message: "Vui lòng nhập mô tả chi tiết hơn (ít nhất 10 ký tự)" }
                  })}
                  className={`form-control bg-light border-0 ${errors.description ? 'is-invalid' : ''}`} 
                  rows="5" 
                  placeholder="Mô tả chất liệu, form dáng..."
                ></textarea>
                {errors.description && <div className="text-danger small mt-1">{errors.description.message}</div>}
              </div>

              {/* 🚀 ĐÃ SỬA: Chỉ giữ lại trạng thái Đang bán */}
              <div className="mb-2 mt-4">
                <label className="form-label small fw-semibold text-muted text-uppercase">Trạng thái sản phẩm</label>
                <div className="d-flex gap-4 mt-2">
                  <div className="form-check custom-radio">
                    <input 
                      className="form-check-input" 
                      type="radio" 
                      value="active" 
                      id="statusActive"
                      checked
                      readOnly
                      {...register("status")} 
                    />
                    <label className="form-check-label fw-bold text-success cursor-default" htmlFor="statusActive">
                      Đang bán (Mặc định khi thêm mới)
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-modern rounded-4 p-4 bg-white shadow-sm border-0">
              <h6 className="fw-bold text-dark mb-4">Giá & Kho hàng</h6>
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-muted text-uppercase">Giá bán ($) <span className="text-danger">*</span></label>
                  <input 
                    type="number" 
                    step="0.01"
                    {...register("price", { 
                      required: "Giá bán không được để trống", 
                      min: { value: 0.1, message: "Giá bán phải lớn hơn 0" },
                      max: { value: 50000, message: "Giá bán không hợp lý" }
                    })}
                    className={`form-control bg-light border-0 text-primary fw-bold ${errors.price ? 'is-invalid' : ''}`} 
                    placeholder="14.00" 
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
                      max: { value: 10000, message: "Số lượng vượt quá giới hạn kho" }
                    })}
                    className={`form-control bg-light border-0 fw-medium text-success ${errors.stock ? 'is-invalid' : ''}`} 
                    placeholder="48" 
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
                placeholder="https://example.com/image.jpg"
              />
              {errors.img && <div className="text-danger small mt-1">{errors.img.message}</div>}
              
              <div className="mt-2 text-muted" style={{ fontSize: '0.75rem' }}>
                <FiInfo className="me-1" /> Dán link hình (ví dụ từ Unsplash) để hiển thị.
              </div>
            </div>

            <div className="card-modern rounded-4 p-4 mb-4 bg-white shadow-sm border-0">
              <h6 className="fw-bold text-dark mb-4">Phân loại</h6>
              
              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted text-uppercase">Danh mục chính</label>
                <select 
                  {...register("category", {
                    required: "Vui lòng chọn danh mục",
                    onChange: (e) => {
                      setValue("subCategory", categoryStructure[e.target.value]?.[0] || "");
                    }
                  })}
                  className={`form-select bg-light border-0 text-dark fw-medium ${errors.category ? 'is-invalid' : ''}`}
                >
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                {errors.category && <div className="text-danger small mt-1">{errors.category.message}</div>}
              </div>
              
              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted text-uppercase">Loại sản phẩm</label>
                <select 
                  {...register("subCategory", { required: "Vui lòng chọn loại" })}
                  className={`form-select bg-light border-0 text-dark fw-medium ${errors.subCategory ? 'is-invalid' : ''}`}
                >
                  {/* Tự động đổ danh mục con tùy thuộc vào danh mục cha đang chọn */}
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

export default AddProductForm;