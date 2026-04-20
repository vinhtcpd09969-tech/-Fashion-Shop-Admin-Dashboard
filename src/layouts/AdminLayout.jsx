import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const AdminLayout = () => {
  return (
    // Dùng d-flex để Sidebar nằm ngang hàng với phần nội dung bên phải
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#f8f9fc' }}>
      
      {/* Cột trái: Sidebar không bị load lại khi chuyển trang */}
      <Sidebar />
      
      {/* Cột phải: Chứa Header và Nội dung thay đổi */}
      <div className="flex-grow-1 d-flex flex-column" style={{ marginLeft: '260px', transition: 'all 0.3s' }}>
        <Header />
        
        {/* Vùng không gian chính */}
        <main className="p-4 flex-grow-1">
          {/* Outlet chính là nơi Dashboard, Products, Orders... sẽ hiển thị */}
          <Outlet /> 
        </main>
        
      </div>
    </div>
  );
};

export default AdminLayout;