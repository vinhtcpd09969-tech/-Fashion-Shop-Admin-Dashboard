// src/pages/Customers.jsx
import { useState } from "react";
import { FiPlus, FiEdit, FiSearch, FiX, FiRefreshCcw } from "react-icons/fi";
import Swal from 'sweetalert2'; 
import CustomerForm from "../components/CustomerForm";
import EditCustomerForm from "../components/EditCustomerForm";

// 🚀 1. Import Custom Hook
import { useCustomers } from "../hooks/useCustomers";
// 🚀 2. Import các Helper dùng chung (Fix điểm yếu 3)
import { getCustomerStatusBadge, getCustomerTierBadge } from "../utils/helpers";

const Customers = () => {
  // Trạng thái UI (chỉ giao diện)
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Gọi Hook lấy dữ liệu và các hàm thao tác
  const { customers, isLoading, addCustomer, updateCustomer } = useCustomers();

  // Hàm xử lý chung (Thêm & Sửa) truyền cho Form
  const handleSaveCustomer = async (data) => {
    const safeBirthday = (data.birthday && data.birthday.trim() !== "") ? data.birthday.split('T')[0] : null;

    const safePayload = {
      ...data,
      phone: data.phone || '',
      birthday: safeBirthday,
      address: data.address || '',
      gender: data.gender || 'Khác',
      orders: data.orders ? Number(data.orders) : 0,
      totalSpent: data.totalSpent ? Number(data.totalSpent) : 0,
      tier: data.tier || 'Mới',
      status: data.status || 'Hoạt động',
      avatar: data.avatar || ''
    };

    if (editingCustomer) {
      const success = await updateCustomer(data.id, safePayload);
      if (success) {
        setEditingCustomer(null);
        setShowForm(false);
      }
    } else {
      const success = await addCustomer(safePayload);
      if (success) setShowForm(false);
    }
  };

  // Hàm hiển thị hộp thoại Xác nhận (Dùng chung cho Khóa/Khôi phục)
  const handleToggleStatus = (customer, newStatus, title, text, confirmBtn, successMsg) => {
    Swal.fire({
      title, text, icon: newStatus === 'Tạm khóa' ? 'warning' : 'info',
      showCancelButton: true,
      confirmButtonColor: newStatus === 'Tạm khóa' ? '#ef4444' : '#22c55e', 
      cancelButtonColor: '#94a3b8',
      confirmButtonText: confirmBtn, cancelButtonText: 'Hủy bỏ'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const safeBirthday = (customer.birthday && customer.birthday !== "") ? customer.birthday.split('T')[0] : null;
        const updatedCustomer = { ...customer, status: newStatus, birthday: safeBirthday };
        
        // Gọi hàm updateCustomer từ Hook, nhưng không dùng toast nhỏ mà hiện bảng to (ẩn message mặc định bằng cách truyền null)
        const success = await updateCustomer(customer.id, updatedCustomer, null);
        if (success) Swal.fire('Thành công!', successMsg, 'success');
      }
    });
  };

  // Lọc Khách hàng
  const filteredCustomers = customers.filter((cus) => {
    if (searchTerm.trim() === "") return true;
    const searchLower = searchTerm.toLowerCase();
    const matchName = cus.name?.toLowerCase().includes(searchLower);
    const matchId = String(cus.id).toLowerCase().includes(searchLower);
    const matchPhone = cus.phone?.includes(searchTerm); 
    return matchName || matchId || matchPhone;
  });

  // Render Loader & Forms
  if (isLoading) return <div className="p-5 text-center text-muted fw-bold">Đang tải dữ liệu khách hàng...</div>;
  if (showForm) return <CustomerForm onClose={() => setShowForm(false)} onSave={handleSaveCustomer} customers={customers} />;
  if (editingCustomer) return <EditCustomerForm customer={editingCustomer} onClose={() => setEditingCustomer(null)} onUpdateCustomer={handleSaveCustomer} customers={customers} />;

  // Render Layout chính
  return (
    <div className="container-fluid p-0 animate-fade-up">
      <div className="d-flex justify-content-between align-items-center mb-4 px-3">
        <div><h3 className="fw-bolder text-dark m-0" style={{ letterSpacing: '-0.5px' }}>Quản lý Khách hàng</h3></div>
        <div className="input-group shadow-sm" style={{ width: '300px', borderRadius: '12px', overflow: 'hidden' }}>
          <span className="input-group-text bg-white border-0 text-muted"><FiSearch /></span>
          <input type="text" className="form-control border-0 bg-white shadow-none" placeholder="Tìm theo Tên, SĐT, Mã KH..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </div>

      <div className="card-modern overflow-hidden bg-white mx-3 mb-4">
        <div className="d-flex justify-content-between align-items-center p-4 border-bottom">
          <h6 className="card-title m-0 fw-bold text-dark">{searchTerm ? `Kết quả tìm kiếm: "${searchTerm}"` : "Tất cả khách hàng"}</h6>
          <button onClick={() => setShowForm(true)} className="btn btn-primary text-white fw-bold d-flex align-items-center px-4 py-2 shadow-sm rounded-pill">
            <FiPlus className="me-2 fs-5" /> Thêm khách hàng
          </button>
        </div>

        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-custom table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="py-3 px-4">KHÁCH HÀNG</th>
                  <th className="py-3">THÔNG TIN LIÊN LẠC</th>
                  <th className="py-3">GIỚI TÍNH</th>
                  <th className="py-3">HẠNG</th>
                  <th className="py-3">TRẠNG THÁI</th>
                  <th className="py-3 text-center">THAO TÁC</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.length === 0 ? (
                  <tr><td colSpan="6" className="text-center py-5 text-muted">{searchTerm ? "Không tìm thấy khách hàng nào!" : "Chưa có dữ liệu khách hàng."}</td></tr>
                ) : (
                  filteredCustomers.map((cus) => {
                    const isInactive = cus.status === "Tạm khóa";
                    return (
                      <tr key={cus.id} style={{ transition: '0.3s', opacity: isInactive ? 0.6 : 1, backgroundColor: isInactive ? '#f8fafc' : 'transparent' }}>
                        <td className="px-4 py-3">
                          <div className="d-flex align-items-center">
                            <img src={cus.avatar || "https://randomuser.me/api/portraits/lego/1.jpg"} alt={cus.name} className={`rounded-circle me-3 border shadow-sm ${isInactive ? 'grayscale' : ''}`} style={{ width: '40px', height: '40px', objectFit: 'cover', filter: isInactive ? 'grayscale(100%)' : 'none' }} />
                            <div>
                                <div className={`fw-bold ${isInactive ? 'text-muted text-decoration-line-through' : 'text-dark'}`}>{cus.name}</div>
                                <div className="text-muted small">#{cus.id}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="text-dark fw-medium">{cus.phone}</div>
                          <div className="text-muted small">{cus.address || 'Chưa cập nhật'}</div>
                        </td>
                        <td className="text-muted fw-medium">{cus.gender || 'Khác'}</td>
                        
                        {/* 🚀 3. Sử dụng Helper thay vì gọi hàm trực tiếp */}
                        <td><span className={`badge rounded px-3 py-1 fw-bold border-0 ${getCustomerTierBadge(cus.tier)}`}>{cus.tier || 'Mới'}</span></td>
                        <td><span className={`badge rounded px-3 py-1 fw-bold border-0 ${getCustomerStatusBadge(cus.status)}`}>{cus.status}</span></td>
                        
                        <td className="text-center">
                          <div className="d-flex justify-content-center gap-2">
                            <button onClick={() => setEditingCustomer(cus)} className="btn btn-sm btn-light text-primary rounded-circle p-2 shadow-sm border-0" title="Sửa"><FiEdit size={16} /></button>
                            {!isInactive ? (
                              <button onClick={() => handleToggleStatus(cus, 'Tạm khóa', 'Khóa tài khoản?', 'Khách hàng này sẽ không thể mua hàng.', 'Đồng ý khóa', 'Đã khóa tài khoản!')} className="btn btn-sm btn-light text-danger rounded-circle p-2 shadow-sm border-0" title="Khóa tài khoản"><FiX size={16} /></button>
                            ) : (
                              <button onClick={() => handleToggleStatus(cus, 'Hoạt động', 'Khôi phục tài khoản?', 'Khách hàng sẽ được cấp quyền hoạt động trở lại.', 'Khôi phục', 'Khách hàng đã hoạt động trở lại!')} className="btn btn-sm btn-light text-success rounded-circle p-2 shadow-sm border-0" title="Khôi phục"><FiRefreshCcw size={16} /></button>
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

export default Customers;