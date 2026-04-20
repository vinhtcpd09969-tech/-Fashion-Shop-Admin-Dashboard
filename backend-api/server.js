const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const jwt = require('jsonwebtoken'); 
const SECRET_KEY = "chuoi_khoa_bao_mat_poly_fashion_cua_toi";

const app = express();
app.use(cors()); 

// 🚀 ĐÃ SỬA CHỖ NÀY: Tăng giới hạn dung lượng gửi lên thành 50MB để chứa vừa ảnh Base64
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ==========================================
// 1. KẾT NỐI DATABASE
// ==========================================
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'shop_fashion'
});

db.connect((err) => {
  if (err) {
    console.error('Lỗi kết nối MySQL:', err);
    return;
  }
  console.log('Đã kết nối thành công tới MySQL!');
});

// ==========================================
// 2. API XÁC THỰC (ĐĂNG NHẬP BẰNG JWT)
// ==========================================
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  const sql = "SELECT id, username, role, avatar FROM users WHERE username = ? AND password = ?";
  db.query(sql, [username, password], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    
    if (results.length > 0) {
      const user = results[0];
      
      // TẠO TOKEN
      const token = jwt.sign(
        { id: user.id, role: user.role, username: user.username }, 
        SECRET_KEY, 
        { expiresIn: '24h' }
      );

      // TRẢ VỀ THÔNG TIN USER VÀ TOKEN
      res.json({ success: true, user: user, accessToken: token });
    } else {
      res.status(401).json({ success: false, message: "Sai tên đăng nhập hoặc mật khẩu!" });
    }
  });
});

// ==========================================
// MIDDLEWARE: BẢO VỆ API (KIỂM TRA TOKEN)
// ==========================================
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 

  // LOG 1: NẰM GỌN TRONG HÀM (Xem Token gửi lên)
  console.log("Server nhận được Token từ React là:", token);

  if (!token) return res.status(401).json({ message: "Từ chối truy cập! Bạn chưa đăng nhập." });

  jwt.verify(token, SECRET_KEY, (err, decodedUser) => {
    if (err) return res.status(403).json({ message: "Phiên đăng nhập đã hết hạn!" });
    req.user = decodedUser;
    
    // LOG 2: NẰM GỌN TRONG HÀM (Xem ai đang gọi API)
    console.log("Người đang gọi API là:", req.user.username);
    
    next(); 
  });
};

// ==========================================
// 3. API SẢN PHẨM (ĐÃ BẢO VỆ BẰNG verifyToken)
// ==========================================
app.get('/api/products', verifyToken, (req, res) => {
  db.query("SELECT * FROM products ORDER BY id DESC", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post('/api/products', verifyToken, (req, res) => {
  const { name, desc_text, price, stockCount, category, img, status } = req.body;
  const sql = `INSERT INTO products (name, desc_text, price, stockCount, category, img, status) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  db.query(sql, [name, desc_text, price, stockCount, category, img, status], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: result.insertId, ...req.body });
  });
});

app.put('/api/products/:id', verifyToken, (req, res) => {
  const { name, desc_text, price, stockCount, category, img, status } = req.body;
  const sql = `UPDATE products SET name=?, desc_text=?, price=?, stockCount=?, category=?, img=?, status=? WHERE id=?`;
  db.query(sql, [name, desc_text, price, stockCount, category, img, status, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: req.params.id, ...req.body });
  });
});

app.delete('/api/products/:id', verifyToken, (req, res) => {
  db.query("DELETE FROM products WHERE id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Xóa thành công!" });
  });
});

// ==========================================
// 4. API KHÁCH HÀNG (ĐÃ BẢO VỆ)
// ==========================================
app.get('/api/customers', verifyToken, (req, res) => {
  db.query("SELECT * FROM customers ORDER BY id DESC", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post('/api/customers', verifyToken, (req, res) => {
  const { id, name, phone, birthday, address, gender, status, avatar } = req.body;
  const sql = `INSERT INTO customers (id, name, phone, birthday, address, gender, status, avatar) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  db.query(sql, [id, name, phone, birthday, address, gender, status, avatar], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ ...req.body });
  });
});

app.put('/api/customers/:id', verifyToken, (req, res) => {
  const { name, phone, birthday, address, gender, status, avatar } = req.body;
  const sql = `UPDATE customers SET name=?, phone=?, birthday=?, address=?, gender=?, status=?, avatar=? WHERE id=?`;
  db.query(sql, [name, phone, birthday, address, gender, status, avatar, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: req.params.id, ...req.body });
  });
});

app.delete('/api/customers/:id', verifyToken, (req, res) => {
  db.query("DELETE FROM customers WHERE id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Xóa thành công!" });
  });
});

// ==========================================
// 5. API ĐƠN HÀNG 
// ==========================================
app.get('/api/orders', verifyToken, (req, res) => {
  db.query("SELECT * FROM orders ORDER BY createdDate DESC", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.put('/api/orders/:id/status', verifyToken, (req, res) => {
  // Nhận thêm paymentMethod từ React gửi lên
  const { status, paymentStatus, paymentMethod } = req.body; 
  
  const sql = "UPDATE orders SET status = ?, paymentStatus = ?, paymentMethod = ? WHERE id = ?";
  db.query(sql, [status, paymentStatus, paymentMethod, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Cập nhật thành công", id: req.params.id, status, paymentStatus, paymentMethod });
  });
});

app.listen(3000, () => {
  console.log('Server Node.js đang chạy tại http://localhost:3000');
});

app.listen(3000, () => {
  console.log('Server Node.js đang chạy tại http://localhost:3000');
});   

// dnah muc 
app.get('/api/categories', (req, res) => {
    // Câu lệnh SQL: Lấy tên danh mục chính và gom nhóm các danh mục con thành mảng
    const sql = `
        SELECT 
            c.id,
            c.name AS name, 
            JSON_ARRAYAGG(s.name) AS subCategories
        FROM categories c
        LEFT JOIN subcategories s ON c.id = s.category_id
        GROUP BY c.id, c.name
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Lỗi truy vấn danh mục:", err);
            return res.status(500).json({ success: false, message: "Lỗi máy chủ cơ sở dữ liệu" });
        }
        
        // Tùy thuộc vào phiên bản MySQL/MariaDB của Laragon, 
        // JSON_ARRAYAGG có thể trả về mảng trực tiếp hoặc chuỗi JSON (string).
        // Đoạn code này đảm bảo dữ liệu luôn ở dạng Mảng (Array) chuẩn cho React.
        const formattedResults = results.map(row => ({
            id: row.id,
            name: row.name,
            subCategories: typeof row.subCategories === 'string' ? JSON.parse(row.subCategories) : (row.subCategories || [])
        }));

        res.json(formattedResults);
    });
});