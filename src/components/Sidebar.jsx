import { NavLink } from "react-router-dom";
import { FiHome, FiBox, FiShoppingCart, FiUsers } from "react-icons/fi";

const Sidebar = () => {
  // Lấy thông tin user hiện tại
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <>
      <style>
        {`
          .sidebar-link { color: #6c757d; transition: all 0.3s ease; border-radius: 8px; }
          .sidebar-link:hover { background-color: #f8f9fa; color: #ff6b35; transform: translateX(5px); }
          .sidebar-link.active { background-color: rgba(255, 107, 53, 0.1); color: #ff6b35; font-weight: 600; }
        `}
      </style>

      <aside className="bg-white border-end shadow-sm" style={{ width: '260px', height: '100vh', position: 'fixed', left: 0, top: 0, zIndex: 100 }}>
        <div className="p-4 border-bottom text-center">
          <h4 className="fw-bolder m-0" style={{ color: '#ff6b35', letterSpacing: '1px' }}>POLY FASHION</h4>
          {/* Hiển thị chức vụ */}
          <span className="badge bg-light text-primary mt-2 fw-bold">{user.role}</span>
        </div>

        <nav className="p-3 d-flex flex-column gap-2">
          {/* Chỉ Admin mới thấy Dashboard */}
          {user.role === "Admin" && (
            <NavLink to="/" end className="sidebar-link d-flex align-items-center px-3 py-3 text-decoration-none">
              <FiHome className="me-3 fs-5" /> Dashboard
            </NavLink>
          )}

          {/* Ai cũng thấy Sản phẩm và Đơn hàng */}
          <NavLink to="/products" className="sidebar-link d-flex align-items-center px-3 py-3 text-decoration-none">
            <FiBox className="me-3 fs-5" /> Sản phẩm
          </NavLink>

          <NavLink to="/orders" className="sidebar-link d-flex align-items-center px-3 py-3 text-decoration-none">
            <FiShoppingCart className="me-3 fs-5" /> Đơn hàng
          </NavLink>

          {/* Chỉ Admin mới thấy Khách hàng */}
          {user.role === "Admin" && (
            <NavLink to="/customers" className="sidebar-link d-flex align-items-center px-3 py-3 text-decoration-none">
              <FiUsers className="me-3 fs-5" /> Khách hàng
            </NavLink>
          )}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;