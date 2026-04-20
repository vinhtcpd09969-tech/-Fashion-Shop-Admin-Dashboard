// src/pages/Login.jsx
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FiLock, FiUser } from "react-icons/fi";
import { useForm } from "react-hook-form"; 

// 🚀 1. Import axiosClient đã cấu hình sẵn thay vì axios gốc
import axiosClient from "../api/axiosClient";

// Import AuthContext để sử dụng Global State
import { AuthContext } from "../contexts/AuthContext";

const Login = () => {
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();

  // Lấy hàm dispatch từ Context để cập nhật trạng thái đăng nhập
  const { dispatch } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    setApiError("");

    // 🚀 2. Sử dụng axiosClient và chỉ truyền endpoint ("/login")
    // Không cần gõ lại "http://localhost:3000/api" nữa
    axiosClient.post("/login", data)
      .then((res) => {
        if (res.data.success) {
          
          // Gửi ACTION cho Reducer xử lý việc lưu trữ
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: {
              user: res.data.user,
              token: res.data.accessToken
            }
          });
          
          if (res.data.user.role === "Admin") {
            navigate("/");
          } else {
            navigate("/products");
          }
        }
      })
      .catch((err) => {
        setApiError(err.response?.data?.message || "Lỗi kết nối đến máy chủ");
      });
  };

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '20px' }}>
      
      {/* Khung Card chính trải rộng gần full màn hình */}
      <div className="card border-0 shadow-lg overflow-hidden animate-fade-up" style={{ width: '100%', maxWidth: '1100px', minHeight: '650px', borderRadius: '24px' }}>
        <div className="row g-0 h-100" style={{ minHeight: '650px' }}>
          
          {/* CỘT TRÁI: Hình ảnh thời trang (Ẩn trên màn hình nhỏ) */}
          <div className="col-lg-6 d-none d-lg-block position-relative overflow-hidden">
            {/* Lớp nền hình ảnh thời trang */}
            <div 
              style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundImage: 'url("https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1400&auto=format&fit=crop")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'brightness(0.85) blur(2px)', 
                transform: 'scale(1.05)' 
              }}
            ></div>
            
            {/* Lớp phủ chữ nghệ thuật lên trên ảnh */}
            <div className="position-absolute w-100 h-100 d-flex flex-column justify-content-center align-items-center text-white" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
              <div className="text-center p-4" style={{ backdropFilter: 'blur(5px)', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.2)' }}>
                <h1 className="fw-bolder mb-2" style={{ letterSpacing: '4px', textShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>POLY FASHION</h1>
                <p className="fs-5 m-0" style={{ letterSpacing: '1px' }}>Định Hình Phong Cách Của Bạn</p>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: Form Đăng nhập */}
          <div className="col-12 col-lg-6 d-flex flex-column justify-content-center align-items-center bg-white p-4 p-md-5">
            <div style={{ width: '100%', maxWidth: '400px' }}>
              
              <div className="mb-5 text-center text-lg-start">
                <h3 className="fw-bolder text-dark mb-2">Xin chào! 👋</h3>
                <p className="text-muted fw-medium m-0">Vui lòng đăng nhập vào tài khoản quản trị của bạn.</p>
              </div>

              {apiError && <div className="alert alert-danger py-2 small fw-bold text-center border-0 rounded-3 mb-4">{apiError}</div>}

              <form onSubmit={handleSubmit(onSubmit)}>
                
                {/* Ô nhập Tên đăng nhập */}
                <div className="mb-4 position-relative">
                  <label className="form-label small fw-bold text-muted mb-2">Tên đăng nhập</label>
                  <div className="position-relative">
                    <FiUser className="position-absolute" style={{ top: '14px', left: '16px', color: '#94a3b8' }} size={20} />
                    <input 
                      type="text" 
                      className={`form-control bg-light fw-medium ${errors.username ? 'border-danger' : 'border-0'}`} 
                      style={{ padding: '14px 15px 14px 48px', borderRadius: '14px' }}
                      placeholder="Nhập tên đăng nhập..." 
                      {...register("username", { 
                        required: "Tên đăng nhập không được để trống",
                        minLength: { value: 3, message: "Tên đăng nhập phải có ít nhất 3 ký tự" }
                      })}
                    />
                  </div>
                  {errors.username && <div className="text-danger small mt-2 ms-1 fw-bold">{errors.username.message}</div>}
                </div>

                {/* Ô nhập Mật khẩu */}
                <div className="mb-5 position-relative">
                  <label className="form-label small fw-bold text-muted mb-2">Mật khẩu</label>
                  <div className="position-relative">
                    <FiLock className="position-absolute" style={{ top: '14px', left: '16px', color: '#94a3b8' }} size={20} />
                    <input 
                      type="password" 
                      className={`form-control bg-light fw-medium ${errors.password ? 'border-danger' : 'border-0'}`} 
                      style={{ padding: '14px 15px 14px 48px', borderRadius: '14px' }}
                      placeholder="Nhập mật khẩu..." 
                      {...register("password", { 
                        required: "Mật khẩu không được để trống",
                        minLength: { value: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" }
                      })}
                    />
                  </div>
                  {errors.password && <div className="text-danger small mt-2 ms-1 fw-bold">{errors.password.message}</div>}
                </div>

                <button type="submit" className="btn w-100 text-white fw-bold shadow-sm" style={{ padding: '14px', backgroundColor: '#6366f1', borderRadius: '14px', fontSize: '1.05rem', transition: 'all 0.3s' }}>
                  ĐĂNG NHẬP HỆ THỐNG
                </button>
              </form>
              
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;