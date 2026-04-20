import { useNavigate } from "react-router-dom";
import { FiLogOut, FiBell } from "react-icons/fi";
import Swal from 'sweetalert2'; // 🚀 Thêm thư viện thông báo

const Header = () => {
  const navigate = useNavigate();
  // Lấy dữ liệu user
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // 🚀 CẬP NHẬT HÀM LOGOUT VỚI THÔNG BÁO XÁC NHẬN
  const handleLogout = () => {
    Swal.fire({
      title: 'Đăng xuất khỏi hệ thống?',
      text: "Bạn sẽ cần đăng nhập lại để tiếp tục quản lý.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#ef4444', // Màu đỏ cảnh báo
      cancelButtonColor: '#94a3b8', // Màu xám cho nút Hủy
      confirmButtonText: 'Đăng xuất ngay',
      cancelButtonText: 'Hủy bỏ'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("user"); // Xóa dữ liệu user
        localStorage.removeItem("token"); // 🚀 Xóa luôn cả token bảo mật
        navigate("/login"); // Đá ra trang đăng nhập
      }
    });
  };

  return (
    <header className="bg-white border-bottom shadow-sm py-3 px-4 d-flex justify-content-end align-items-center" style={{ position: 'sticky', top: 0, zIndex: 99 }}>
      
      <div className="d-flex align-items-center gap-4">
        <button className="btn btn-light rounded-circle p-2 position-relative border-0 bg-transparent">
          <FiBell size={20} className="text-muted" />
          <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
        </button>

        <div className="d-flex align-items-center gap-3 border-start ps-4">
          <div className="text-end">
            {/* Hiển thị câu chào */}
            <h6 className="m-0 fw-bold text-dark">Xin chào, {user.username || "Quản trị viên"}</h6>
            <small className="text-muted fw-medium">{user.role || "Admin"}</small>
          </div>
          {/* Hiển thị Avatar */}
          <img 
            src={user.avatar || "https://randomuser.me/api/portraits/lego/1.jpg"} 
            alt="avatar" 
            className="rounded-circle shadow-sm border" 
            style={{ width: '40px', height: '40px', objectFit: 'cover' }} 
          />
          
          <button onClick={handleLogout} className="btn btn-sm btn-light text-danger fw-bold ms-2 d-flex align-items-center px-3 rounded-pill shadow-sm transition-all hover-scale">
            <FiLogOut className="me-1" /> Thoát
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;