import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FiX, FiSave, FiUser, FiUpload } from "react-icons/fi";

const EditCustomerForm = ({ customer, onClose, onUpdateCustomer, customers = [] }) => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: {
      name: customer.name,
      phone: customer.phone,
      birthday: customer.birthday ? customer.birthday.split('T')[0] : "", 
      address: customer.address || "",
      gender: customer.gender || "Khác",
      status: customer.status || "Hoạt động",
      avatar: customer.avatar || ""
    }
  });

  const [avatarPreview, setAvatarPreview] = useState(customer?.avatar || "");

  useEffect(() => {
    register("avatar");
  }, [register]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        setValue("avatar", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data) => {
    const updatedCustomer = {
      ...customer,
      name: data.name.trim(),
      phone: data.phone.trim(),
      birthday: data.birthday,
      address: data.address.trim(),
      gender: data.gender,
      status: data.status,
      avatar: data.avatar // Cập nhật ảnh mới (nếu có)
    };
    onUpdateCustomer(updatedCustomer);
  };

  const getTodayString = () => new Date().toISOString().split('T')[0];

  return (
    <div className="container-fluid p-0 animate-fade-up">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="d-flex justify-content-between align-items-center mb-4 px-3">
          <div>
            <h4 className="fw-bold text-dark m-0 d-flex align-items-center">
              <FiUser className="me-2 text-primary" /> SỬA KHÁCH HÀNG
            </h4>
            <p className="text-muted small m-0">Cập nhật thông tin mã {customer.id}</p>
          </div>
          <div className="d-flex gap-2">
            <button type="button" onClick={onClose} className="btn btn-light fw-medium px-4">Hủy bỏ</button>
            <button type="submit" className="btn btn-primary text-white px-4 fw-medium shadow-sm d-flex align-items-center">
              <FiSave className="me-2" /> Cập nhật
            </button>
          </div>
        </div>

        <div className="card-modern bg-white p-4 mx-3 mb-4 border-0">
          
          {/* 🚀 KHU VỰC ĐỔI ẢNH ĐẠI DIỆN */}
          <div className="d-flex flex-column align-items-center mb-4 pb-4 border-bottom">
            <img 
              src={avatarPreview || "https://placehold.co/150x150?text=Chưa+có+ảnh"} 
              alt="Avatar Preview" 
              className="rounded-circle shadow-sm border mb-3 object-fit-cover"
              style={{ width: '120px', height: '120px' }}
            />
            <label className="btn btn-outline-primary fw-medium cursor-pointer rounded-pill px-4">
              <FiUpload className="me-2" /> Đổi ảnh từ máy
              <input 
                type="file" 
                accept="image/*" 
                className="d-none" 
                onChange={handleImageChange} 
              />
            </label>
          </div>

          <div className="row g-4">
            <div className="col-md-6">
              <label className="form-label small fw-bold text-muted">HỌ VÀ TÊN <span className="text-danger">*</span></label>
              <input 
                type="text" 
                {...register("name", { required: "Vui lòng nhập họ tên", minLength: { value: 2, message: "Họ tên quá ngắn" } })}
                className={`form-control bg-light border-0 ${errors.name ? 'is-invalid' : ''}`} 
              />
              {errors.name && <div className="text-danger small mt-1 fw-medium">{errors.name.message}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label small fw-bold text-muted">SỐ ĐIỆN THOẠI <span className="text-danger">*</span></label>
              <input 
                type="text" 
                {...register("phone", { 
                  required: "Vui lòng nhập số",
                  pattern: { value: /^(0[3|5|7|8|9])+([0-9]{8})$/, message: "Số ĐT không hợp lệ" },
                  validate: {
                    isUnique: (value) => {
                      const isDuplicate = customers.some(c => c.id !== customer.id && c.phone === value.trim());
                      return !isDuplicate || "Số điện thoại này đã được khách khác đăng ký!";
                    }
                  }
                })}
                className={`form-control bg-light border-0 ${errors.phone ? 'is-invalid' : ''}`} 
              />
              {errors.phone && <div className="text-danger small mt-1 fw-medium">{errors.phone.message}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label small fw-bold text-muted">NGÀY SINH <span className="text-danger">*</span></label>
              <input 
                type="date" max={getTodayString()}
                {...register("birthday", { required: "Vui lòng chọn ngày sinh" })} 
                className={`form-control bg-light border-0 ${errors.birthday ? 'is-invalid' : ''}`} 
              />
              {errors.birthday && <div className="text-danger small mt-1 fw-medium">{errors.birthday.message}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label small fw-bold text-muted">GIỚI TÍNH <span className="text-danger">*</span></label>
              <select {...register("gender")} className="form-select bg-light border-0">
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>

            <div className="col-12">
              <label className="form-label small fw-bold text-muted">ĐỊA CHỈ <span className="text-danger">*</span></label>
              <textarea 
                {...register("address", { required: "Vui lòng nhập địa chỉ" })} 
                className={`form-control bg-light border-0 ${errors.address ? 'is-invalid' : ''}`} rows="3"
              ></textarea>
              {errors.address && <div className="text-danger small mt-1 fw-medium">{errors.address.message}</div>}
            </div>

            <div className="col-12">
              <label className="form-label small fw-bold text-muted">TRẠNG THÁI TÀI KHOẢN <span className="text-danger">*</span></label>
              <div className="d-flex gap-4 mt-1">
                <div className="form-check custom-radio">
                  <input className="form-check-input" type="radio" value="Hoạt động" id="editStatusActive" {...register("status")} />
                  <label className="form-check-label text-success fw-bold cursor-pointer" htmlFor="editStatusActive">Hoạt động</label>
                </div>
                <div className="form-check custom-radio">
                  <input className="form-check-input" type="radio" value="Tạm khóa" id="editStatusDraft" {...register("status")} />
                  <label className="form-check-label text-danger fw-bold cursor-pointer" htmlFor="editStatusDraft">Tạm khóa</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditCustomerForm;