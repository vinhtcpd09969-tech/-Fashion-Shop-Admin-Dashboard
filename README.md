👕 Fashion Shop Admin Dashboard

Hệ thống quản trị cửa hàng thời trang tích hợp đầy đủ tính năng CRUD, xác thực người dùng và phân quyền quản trị. Dự án được xây dựng theo mô hình Client-Server tách biệt, đảm bảo tính bảo mật và hiệu năng cao.

🚀 Tính năng chính
Xác thực & Phân quyền:

Đăng nhập hệ thống bằng JWT (JSON Web Token).

Phân quyền người dùng (Admin/User) để quản lý menu và chức năng.

Tự động duy trì trạng thái đăng nhập qua localStorage và AuthContext.

Quản lý Sản phẩm (CRUD):

Xem danh sách sản phẩm với chức năng phân loại theo danh mục.

Thêm/Sửa sản phẩm với Validation (React Hook Form).

Tính năng Xóa mềm (Soft Delete): Chuyển trạng thái sang "Ngưng bán", làm mờ ảnh và đẩy xuống cuối danh sách.

Quản lý Khách hàng:

Quản lý thông tin khách hàng chi tiết.

Tự động đẩy khách hàng mới/vừa chỉnh sửa lên đầu danh sách (UX Optimization).

Dashboard & Thống kê:

Thống kê tổng doanh thu, đơn hàng, sản phẩm và khách hàng.

Biểu đồ trực quan và danh sách sản phẩm mới nhất.

Quản lý Đơn hàng: Cập nhật trạng thái đơn hàng và phương thức thanh toán.

🛠 Công nghệ sử dụng
Frontend (Client)
React JS (Vite): Thư viện xây dựng giao diện.

Axios: Xử lý gọi API với Interceptors để tự động gắn Token.

React Hook Form: Quản lý form và validate dữ liệu.

SweetAlert2: Hiển thị thông báo (Popup) chuyên nghiệp.

Bootstrap & React Icons: Giao diện và biểu đồ.

Backend (Server)
Node.js & Express: Môi trường thực thi và Framework server.

MySQL: Cơ sở dữ liệu quan hệ.

JSON Web Token (JWT): Bảo mật và xác thực API.

CORS: Cấu hình cho phép Frontend truy cập tài nguyên máy chủ.

📁 Cấu trúc thư mục (Source Code)
Plaintext
├── backend-api/         # Mã nguồn Server (Node.js & Express)
│   ├── server.js        # File chạy chính, cấu hình API và MySQL
│   └── package.json     # Các dependencies của backend
├── src/                 # Mã nguồn Frontend (React)
│   ├── api/             # Cấu hình Axios Client & Interceptors
│   ├── services/        # Các hàm gọi API (Product, Customer, Order)
│   ├── hooks/           # Custom Hooks xử lý logic và State (useProducts, useCustomers...)
│   ├── contexts/        # AuthContext quản lý trạng thái đăng nhập toàn cục
│   ├── components/      # Các mảnh ghép giao diện (Form, Sidebar, Header)
│   └── pages/           # Các trang chính của hệ thống
└── README.md
⚙️ Hướng dẫn cài đặt
1. Cài đặt Database
Tạo cơ sở dữ liệu tên shop_fashion trong MySQL (Laragon hoặc XAMPP).

Import các bảng users, products, customers, orders, categories.

2. Cài đặt Backend
Bash
cd backend-api
npm install
node server.js
# Server sẽ chạy tại http://localhost:3000
3. Cài đặt Frontend
Bash
# Tại thư mục gốc
npm install
npm run dev
# Ứng dụng sẽ chạy tại http://localhost:5173
🛡 Bảo mật
Hệ thống sử dụng cơ chế Middleware verifyToken 
